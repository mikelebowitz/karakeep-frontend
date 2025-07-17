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
    isLoading: true
  });
  
  // Available lists for assignment
  const [availableLists, setAvailableLists] = useState<any[]>([]);
  
  // Smart key bindings
  const [smartKeyBindings, setSmartKeyBindings] = useState<SmartKeyBinding[]>([]);
  
  // Load inbox bookmarks
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load ALL bookmarks from inbox for triage mode
        const allBookmarks = await (dataProvider as any).getAllInboxBookmarks();
        
        // Load available lists
        const listsResult = await dataProvider.getList('lists', {
          pagination: { page: 1, perPage: 100 },
          sort: { field: 'name', order: 'ASC' },
          filter: {}
        });
        
        console.log(`🎯 Triage mode loaded ${allBookmarks.length} bookmarks for processing`);
        
        // Generate smart key bindings for lists
        const usageStats = loadListUsage();
        const smartBindings = generateSmartKeyBindings(listsResult.data, usageStats);
        
        setTriageState(prev => ({
          ...prev,
          bookmarks: allBookmarks,
          isLoading: false
        }));
        
        setAvailableLists(listsResult.data);
        setSmartKeyBindings(smartBindings);
      } catch (error) {
        notify('Failed to load bookmarks', { type: 'error' });
        console.error('Failed to load triage data:', error);
        setTriageState(prev => ({ ...prev, isLoading: false }));
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
  
  // Loading state
  if (triageState.isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center items-center h-96">
          <span className="loading loading-spinner loading-lg"></span>
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
      <div className="container mx-auto px-6 py-4 flex-1 flex flex-col">
        <TriageHeader
          current={triageState.currentIndex + 1}
          total={triageState.bookmarks.length}
          completed={triageState.completedCount}
          onQuit={quitTriage}
        />
        
        <KeyboardCommandBar keyboardConfig={keyboardConfig} />
        
        <div className="flex gap-6 flex-1 overflow-hidden">
          {/* Bookmark Card */}
          <div className="flex-1 flex items-center justify-center">
            {currentBookmark && (
              <BookmarkCard 
                bookmark={currentBookmark}
                isProcessing={triageState.isProcessing}
              />
            )}
          </div>
          
          {/* Command Sidebar */}
          <div className="w-80 flex-shrink-0">
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