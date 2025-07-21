import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotify, useDataProvider } from 'react-admin';
// Using DaisyUI components instead of Material-UI
import { BookmarkCard } from '../../components/BookmarkCard';
import { CommandSidebar } from '../../components/CommandSidebar';
import { TriageHeader } from '../../components/TriageHeader';
import { KeyboardCommandBar } from '../../components/KeyboardCommandBar';
import { 
  getKeyboardLayout, 
  matchesBinding, 
  type TriageKeyboardConfig 
} from '../../config/triageKeyboardConfig';
import { 
  generateSmartKeyBindings, 
  saveListUsage, 
  loadListUsage,
  type SmartKeyBinding 
} from '../../utils/smartKeyBinding';

interface TriageState {
  bookmarks: any[];
  currentIndex: number;
  selectedLists: string[];
  isProcessing: boolean;
  completedCount: number;
  isLoading: boolean;
  totalCount: number;
}

export const TriageMode = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  
  // Get keyboard configuration
  const [keyboardConfig] = useState<TriageKeyboardConfig>(getKeyboardLayout());
  
  // Triage state
  const [triageState, setTriageState] = useState<TriageState>({
    bookmarks: [],
    currentIndex: 0,
    selectedLists: [],
    isProcessing: false,
    completedCount: 0,
    isLoading: true,
    totalCount: 0
  });
  
  // Available lists for assignment
  const [availableLists, setAvailableLists] = useState<any[]>([]);
  
  // Smart key bindings
  const [smartKeyBindings, setSmartKeyBindings] = useState<SmartKeyBinding[]>([]);
  
  // Load inbox bookmarks with lazy loading
  useEffect(() => {
    const loadData = async () => {
      try {
        // First, load available lists (needed for UI)
        const listsResult = await dataProvider.getList('lists', {
          pagination: { page: 1, perPage: 100 },
          sort: { field: 'name', order: 'ASC' },
          filter: {}
        });
        
        // Generate smart key bindings for lists
        const usageStats = loadListUsage();
        const smartBindings = generateSmartKeyBindings(listsResult.data, usageStats);
        setAvailableLists(listsResult.data);
        setSmartKeyBindings(smartBindings);
        
        // First, get the total count for accurate progress tracking
        const countResult = await dataProvider.getList('bookmarks', {
          pagination: { page: 1, perPage: 1 },
          sort: { field: 'createdAt', order: 'DESC' },
          filter: { listId: 'qukdzoowmmsnr8hb19b0z1xc' } // Inbox list ID
        });
        
        const totalCount = countResult.total || 0;
        
        // Load first batch of bookmarks (20) for immediate display
        const firstBatch = await dataProvider.getList('bookmarks', {
          pagination: { page: 1, perPage: 20 },
          sort: { field: 'createdAt', order: 'DESC' },
          filter: { listId: 'qukdzoowmmsnr8hb19b0z1xc' } // Inbox list ID
        });
        
        console.log(`🎯 Triage mode loaded first ${firstBatch.data.length} of ${totalCount} bookmarks`);
        
        // Set initial bookmarks and mark as not loading
        setTriageState(prev => ({
          ...prev,
          bookmarks: firstBatch.data,
          isLoading: false,
          totalCount: totalCount
        }));
        
        // Load remaining bookmarks in the background if there are more
        if (totalCount > 20) {
          loadRemainingBookmarks();
        }
        
      } catch (error) {
        notify('Failed to load bookmarks', { type: 'error' });
        console.error('Failed to load triage data:', error);
        setTriageState(prev => ({ ...prev, isLoading: false }));
      }
    };
    
    const loadRemainingBookmarks = async () => {
      try {
        // Get all remaining bookmarks
        const allBookmarks = await (dataProvider as any).getAllInboxBookmarks();
        
        // Update state with all bookmarks (this includes the ones we already have)
        setTriageState(prev => ({
          ...prev,
          bookmarks: allBookmarks
        }));
        
        console.log(`🎯 Background load complete: ${allBookmarks.length} total bookmarks`);
      } catch (error) {
        console.error('Failed to load remaining bookmarks:', error);
        // Don't show error to user since they already have some bookmarks to work with
      }
    };
    
    loadData();
  }, [dataProvider, notify]);
  
  // Get current bookmark
  const currentBookmark = triageState.bookmarks[triageState.currentIndex];
  
  // Toggle list selection by binding index
  const toggleListSelection = useCallback((bindingIndex: number) => {
    if (bindingIndex >= smartKeyBindings.length) return;
    
    const binding = smartKeyBindings[bindingIndex];
    const listId = binding.listId;
    
    setTriageState(prev => ({
      ...prev,
      selectedLists: prev.selectedLists.includes(listId)
        ? prev.selectedLists.filter(id => id !== listId)
        : [...prev.selectedLists, listId]
    }));
  }, [smartKeyBindings]);
  
  // Toggle list selection by key
  const toggleListByKey = useCallback((key: string) => {
    const binding = smartKeyBindings.find(b => b.key === key);
    if (binding) {
      const listId = binding.listId;
      setTriageState(prev => ({
        ...prev,
        selectedLists: prev.selectedLists.includes(listId)
          ? prev.selectedLists.filter(id => id !== listId)
          : [...prev.selectedLists, listId]
      }));
      
      // Track usage for smart key optimization
      saveListUsage(listId);
    }
  }, [smartKeyBindings]);
  
  // Apply selections and move to next
  const applyAndNext = useCallback(async () => {
    if (triageState.selectedLists.length === 0) {
      notify('Please select at least one list', { type: 'warning' });
      return;
    }
    
    if (triageState.isProcessing) return;
    
    setTriageState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      // Use the existing attachLists method
      await (dataProvider as any).attachLists(currentBookmark.id, triageState.selectedLists);
      
      notify('Bookmark assigned to lists', { type: 'success' });
      
      // Move to next bookmark
      setTriageState(prev => ({
        ...prev,
        isProcessing: false,
        completedCount: prev.completedCount + 1,
        currentIndex: prev.currentIndex + 1,
        selectedLists: [], // Reset selections
        // Remove processed bookmark from list
        bookmarks: prev.bookmarks.filter((_, index) => index !== prev.currentIndex)
      }));
      
      // If we've processed all bookmarks, return to list
      if (triageState.currentIndex >= triageState.bookmarks.length - 1) {
        notify('All bookmarks processed!', { type: 'success' });
        navigate('/bookmarks');
      }
    } catch (error) {
      notify('Failed to assign bookmark to lists', { type: 'error' });
      console.error('Failed to update bookmark:', error);
      setTriageState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [triageState, currentBookmark, dataProvider, notify, navigate]);
  
  // Skip to next without applying
  const skipToNext = useCallback(() => {
    if (triageState.currentIndex < triageState.bookmarks.length - 1) {
      setTriageState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        selectedLists: [] // Reset selections
      }));
    } else {
      notify('No more bookmarks to process', { type: 'info' });
      navigate('/bookmarks');
    }
  }, [triageState, notify, navigate]);
  
  // Move to previous bookmark
  const moveToPrevious = useCallback(() => {
    if (triageState.currentIndex > 0) {
      setTriageState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex - 1,
        selectedLists: [] // Reset selections
      }));
    }
  }, [triageState]);
  
  // Quit triage mode
  const quitTriage = useCallback(() => {
    if (triageState.completedCount > 0) {
      notify(`Processed ${triageState.completedCount} bookmarks`, { type: 'info' });
    }
    navigate('/bookmarks');
  }, [triageState.completedCount, notify, navigate]);
  
  // Keyboard event handler
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    // Check if this key is bound to a smart key
    const smartKeyMatch = smartKeyBindings.find(b => b.key === e.key);
    
    // Prevent default for our shortcuts
    const isOurShortcut = 
      matchesBinding(e, keyboardConfig.APPLY_AND_NEXT) ||
      matchesBinding(e, keyboardConfig.SKIP_TO_NEXT) ||
      matchesBinding(e, keyboardConfig.APPLY_AND_PREV) ||
      matchesBinding(e, keyboardConfig.QUIT) ||
      (keyboardConfig.NEXT && matchesBinding(e, keyboardConfig.NEXT)) ||
      (keyboardConfig.PREVIOUS && matchesBinding(e, keyboardConfig.PREVIOUS)) ||
      smartKeyMatch;
    
    if (isOurShortcut) {
      e.preventDefault();
    }
    
    // Check core actions
    if (matchesBinding(e, keyboardConfig.APPLY_AND_NEXT)) {
      applyAndNext();
    } else if (matchesBinding(e, keyboardConfig.SKIP_TO_NEXT)) {
      skipToNext();
    } else if (matchesBinding(e, keyboardConfig.APPLY_AND_PREV)) {
      // Apply and go to previous
      applyAndNext().then(() => moveToPrevious());
    } else if (matchesBinding(e, keyboardConfig.QUIT)) {
      quitTriage();
    } else if (keyboardConfig.NEXT && matchesBinding(e, keyboardConfig.NEXT)) {
      skipToNext();
    } else if (keyboardConfig.PREVIOUS && matchesBinding(e, keyboardConfig.PREVIOUS)) {
      moveToPrevious();
    }
    
    // Check smart key bindings for list selection
    if (smartKeyMatch) {
      toggleListByKey(e.key);
    }
  }, [
    keyboardConfig, 
    smartKeyBindings,
    applyAndNext, 
    skipToNext, 
    moveToPrevious, 
    quitTriage,
    toggleListByKey
  ]);
  
  // Set up keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
  
  // Loading state with DaisyUI skeletons
  if (triageState.isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="max-w-7xl mx-auto px-4 py-3 flex-1 flex flex-col">
          {/* Header skeleton */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="skeleton h-8 w-32"></div>
              <div className="skeleton h-6 w-48"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="skeleton h-4 w-32"></div>
              <div className="skeleton h-6 w-20"></div>
            </div>
          </div>
          
          {/* Keyboard commands skeleton */}
          <div className="mb-4">
            <div className="flex items-center gap-6">
              <div className="skeleton h-4 w-32"></div>
              <div className="skeleton h-6 w-16"></div>
              <div className="skeleton h-6 w-16"></div>
              <div className="skeleton h-6 w-12"></div>
            </div>
          </div>
          
          <div className="flex gap-4 flex-1 min-h-0">
            {/* Bookmark card skeleton */}
            <div className="flex-1 flex items-start justify-center px-2 pt-8">
              <div className="w-full max-w-4xl">
                <div className="bg-base-100 border-0 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="skeleton h-12 w-12 rounded shrink-0"></div>
                    <div className="flex-1">
                      <div className="skeleton h-6 w-3/4 mb-2"></div>
                      <div className="skeleton h-4 w-1/2"></div>
                    </div>
                  </div>
                  <div className="skeleton h-4 w-full mb-2"></div>
                  <div className="skeleton h-4 w-4/5 mb-2"></div>
                  <div className="skeleton h-4 w-2/3 mb-4"></div>
                  <div className="flex gap-2">
                    <div className="skeleton h-6 w-16"></div>
                    <div className="skeleton h-6 w-20"></div>
                    <div className="skeleton h-6 w-14"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar skeleton */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-base-100 h-full p-6">
                <div className="skeleton h-6 w-16 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-base-200 rounded-lg">
                      <div className="skeleton h-6 w-6 rounded"></div>
                      <div className="skeleton h-6 w-6 rounded-full"></div>
                      <div className="skeleton h-4 flex-1"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // No bookmarks state
  if (triageState.bookmarks.length === 0) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold mb-4">No bookmarks in Inbox</h2>
          <p className="text-base-content/70 mb-6">All bookmarks have been assigned to lists!</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/bookmarks')}
          >
            Return to Bookmarks
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 py-3 flex-1 flex flex-col">
        <TriageHeader
          current={triageState.bookmarks.length - triageState.currentIndex}
          total={triageState.totalCount || triageState.bookmarks.length + triageState.completedCount}
          completed={triageState.completedCount}
          onQuit={quitTriage}
        />
        
        <KeyboardCommandBar keyboardConfig={keyboardConfig} />
        
        <div className="flex gap-4 flex-1 min-h-0">
          {/* Bookmark Card */}
          <div className="flex-1 flex flex-col items-center px-2 pt-8">
            {currentBookmark && (
              <>
                <div className="w-full max-w-4xl">
                  <BookmarkCard 
                    bookmark={currentBookmark}
                    isProcessing={triageState.isProcessing}
                  />
                </div>
                
                {/* Selected Lists Display */}
                {triageState.selectedLists.length > 0 && (
                  <div className="w-full max-w-4xl mt-4">
                    <div className="bg-base-100 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-base-content mb-2">
                        Selected for assignment: {triageState.selectedLists.length} list{triageState.selectedLists.length !== 1 ? 's' : ''}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {triageState.selectedLists.map(listId => {
                          const list = availableLists.find(l => l.id === listId);
                          return list ? (
                            <span key={listId} className="badge badge-secondary badge-lg">
                              {list.icon} {list.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Command Sidebar */}
          <div className="w-64 flex-shrink-0">
            <CommandSidebar
              lists={availableLists}
              selectedLists={triageState.selectedLists}
              onListToggle={toggleListSelection}
              smartKeyBindings={smartKeyBindings}
            />
          </div>
        </div>
      </div>
    </div>
  );
};