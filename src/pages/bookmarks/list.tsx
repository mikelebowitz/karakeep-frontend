import { useList } from "@refinedev/core";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { TagPickerModal } from "../../components/TagPickerModal";
import { ListPickerModal } from "../../components/ListPickerModal";
import { attachBookmarkToLists } from "../../providers/dataProvider";

interface FilterState {
  search: string;
  tagIds: string[];
  listIds: string[];
  showUntagged: boolean;
  showUnlisted: boolean;
}

export const BookmarkList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  
  // Advanced filtering state
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    tagIds: [],
    listIds: [],
    showUntagged: false,
    showUnlisted: false,
  });
  
  // Two-tier selection state
  const [selectAllMatching, setSelectAllMatching] = useState(false);
  
  // Modal state
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  
  // Triage modal list filtering state
  const [listFilterText, setListFilterText] = useState("");
  const [highlightedListIndex, setHighlightedListIndex] = useState(0);
  
  // Assignment feedback state
  const [assignmentFeedback, setAssignmentFeedback] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  
  // Sync search query with filters
  useEffect(() => {
    setFilters(prev => ({ ...prev, search: searchQuery }));
  }, [searchQuery]);
  
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page when search changes
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Build filters array for API
  const apiFilters: any[] = [];
  if (debouncedSearchQuery) {
    apiFilters.push({ field: "q", operator: "eq" as const, value: debouncedSearchQuery });
  }
  
  // Add tag filters
  if (filters.tagIds.length > 0) {
    apiFilters.push({ field: "tagIds", operator: "in" as const, value: filters.tagIds });
  }
  
  // Add list filters  
  if (filters.listIds.length > 0) {
    apiFilters.push({ field: "listIds", operator: "in" as const, value: filters.listIds });
  }
  
  // Add special filters
  if (filters.showUntagged) {
    apiFilters.push({ field: "untagged", operator: "eq" as const, value: true });
  }
  
  if (filters.showUnlisted) {
    apiFilters.push({ field: "unlisted", operator: "eq" as const, value: true });
  }
  
  const { data, isLoading, error, refetch } = useList({
    resource: "bookmarks",
    pagination: {
      current: currentPage,
      pageSize: 20,
    },
    filters: apiFilters.length > 0 ? apiFilters : undefined,
  });

  // Fetch available lists for triage modal
  const { data: listsData } = useList({
    resource: "lists",
    pagination: { pageSize: 100 }
  });

  // Fetch available tags for filter display
  const { data: tagsData } = useList({
    resource: "tags",
    pagination: { pageSize: 100 }
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [focusedRowIndex, setFocusedRowIndex] = useState<number>(-1);
  const [triageBookmark, setTriageBookmark] = useState<any>(null);
  const [queueIndex, setQueueIndex] = useState<number>(-1);
  const tableRef = useRef<HTMLTableElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Reset focus when page changes
  useEffect(() => {
    setFocusedRowIndex(-1);
    setSelectedIds([]);
    setQueueIndex(-1);
  }, [currentPage]);

  const handleSelectAll = (checked: boolean) => {
    if (checked && data?.data) {
      setSelectedIds(data.data.map((b: any) => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (bookmarkId: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, bookmarkId]);
    } else {
      setSelectedIds(selectedIds.filter(id => id !== bookmarkId));
    }
  };

  const handleTagsSelected = (tagIds: string[]) => {
    setFilters(prev => ({ ...prev, tagIds }));
  };

  const handleListsSelected = (listIds: string[]) => {
    setFilters(prev => ({ ...prev, listIds }));
  };

  // Available data for lookups (moved up to be available for other hooks)
  const availableLists = useMemo(() => listsData?.data || [], [listsData]);
  const availableTags = useMemo(() => tagsData?.data || [], [tagsData]);
  
  // Filter available lists based on search text (moved up to be available for assignBookmarkToList)
  const filteredLists = useMemo(() => 
    availableLists
      // Filter out smart lists - users should only be able to add to manual lists
      .filter(list => list.type !== 'smart')
      .filter(list => list.name?.toLowerCase().includes(listFilterText.toLowerCase()))
      .sort((a, b) => {
        const aName = a.name?.toLowerCase() || '';
        const bName = b.name?.toLowerCase() || '';
        const searchText = listFilterText.toLowerCase();
        
        // Prioritize exact matches at the beginning
        const aStartsWith = aName.startsWith(searchText);
        const bStartsWith = bName.startsWith(searchText);
        
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        // Then alphabetical order
        return aName.localeCompare(bName);
      }), [availableLists, listFilterText]);

  // Assign bookmark to list
  const assignBookmarkToList = useCallback(async (listId: string) => {
    if (!triageBookmark) {
      console.error("No triage bookmark selected");
      return;
    }
    
    // Get selected list info
    const selectedList = availableLists.find(l => l.id === listId);
    
    // Check if bookmark is already in this list
    const isAlreadyInList = triageBookmark.lists?.some((list: any) => {
      const id = typeof list === 'string' ? list : list.id;
      return id === listId;
    });
    
    if (isAlreadyInList) {
      console.log("Bookmark is already in this list");
      setAssignmentFeedback({ type: 'info', message: `Already in ${selectedList?.name || 'this list'}` });
      // Clear feedback after 2 seconds
      setTimeout(() => setAssignmentFeedback(null), 2000);
      return;
    }
    
    // Enhanced debugging
    console.log("=== LIST ASSIGNMENT DEBUG ===");
    console.log("Available lists count:", availableLists.length);
    console.log("List filter text:", listFilterText);
    console.log("Filtered lists:", filteredLists.map(l => ({ id: l.id, name: l.name })));
    console.log("Highlighted list index:", highlightedListIndex);
    console.log("Selected list ID:", listId);
    console.log("Selected list object:", selectedList);
    console.log("Assigning bookmark", triageBookmark.id, "to list", selectedList?.name || 'UNKNOWN');
    
    try {
      const result = await attachBookmarkToLists(triageBookmark.id, [listId]);
      console.log("Assignment result:", result);
      
      // Update the bookmark's lists in the local state
      setTriageBookmark((prev: any) => ({
        ...prev,
        lists: [...(prev.lists || []), { id: listId, name: selectedList?.name || '' }]
      }));
      
      // Note: We can't directly update the data array as it comes from useList hook
      // The refetch() call below will get the updated data from the server
      
      // Refetch bookmarks to update the list view
      refetch();
      console.log("Successfully assigned bookmark to list");
      
      // Show success feedback
      setAssignmentFeedback({ type: 'success', message: `Added to ${selectedList?.name || 'list'}` });
      setTimeout(() => setAssignmentFeedback(null), 2000);
    } catch (error: any) {
      console.error("Failed to assign bookmark to list:", error);
      console.error("Error details:", error);
      
      // Check for specific error codes
      if (error.response?.status === 400) {
        console.log("Bookmark is already in this list (API response)");
        setAssignmentFeedback({ type: 'info', message: `Already in ${selectedList?.name || 'this list'}` });
      } else if (error.response?.status === 404) {
        console.log("List or bookmark not found");
        setAssignmentFeedback({ type: 'error', message: 'List or bookmark not found' });
      } else {
        setAssignmentFeedback({ type: 'error', message: 'Failed to add to list' });
      }
      setTimeout(() => setAssignmentFeedback(null), 3000);
    }
  }, [triageBookmark, availableLists, listFilterText, filteredLists, highlightedListIndex, refetch]);

  // Queue navigation functions
  const openTriageForIndex = useCallback((index: number) => {
    if (data?.data && index >= 0 && index < data.data.length) {
      setTriageBookmark(data.data[index]);
      setQueueIndex(index);
      // Reset triage modal state
      setListFilterText("");
      setHighlightedListIndex(0);
    }
  }, [data]);

  const navigateToNextInQueue = useCallback(() => {
    if (data?.data && queueIndex < data.data.length - 1) {
      const nextIndex = queueIndex + 1;
      setTriageBookmark(data.data[nextIndex]);
      setQueueIndex(nextIndex);
      // Reset triage modal state
      setListFilterText("");
      setHighlightedListIndex(0);
    }
  }, [data, queueIndex]);

  const navigateToPrevInQueue = useCallback(() => {
    if (data?.data && queueIndex > 0) {
      const prevIndex = queueIndex - 1;
      setTriageBookmark(data.data[prevIndex]);
      setQueueIndex(prevIndex);
      // Reset triage modal state
      setListFilterText("");
      setHighlightedListIndex(0);
    }
  }, [data, queueIndex]);

  // Ensure highlighted index stays within bounds
  useEffect(() => {
    if (highlightedListIndex >= filteredLists.length) {
      setHighlightedListIndex(Math.max(0, filteredLists.length - 1));
    }
  }, [filteredLists.length, highlightedListIndex]);

  // Update triage bookmark when data changes (after refetch)
  useEffect(() => {
    if (triageBookmark && data?.data && queueIndex >= 0) {
      const updatedBookmark = data.data.find((b: any) => b.id === triageBookmark.id);
      if (updatedBookmark) {
        setTriageBookmark(updatedBookmark);
      }
    }
  }, [data, triageBookmark, queueIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle global shortcuts
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            searchInputRef.current?.focus();
            return;
          case 'a':
            e.preventDefault();
            if (e.shiftKey) {
              // Cmd+Shift+A: Select all matching results
              setSelectAllMatching(true);
              setSelectedIds([]);
            } else {
              // Cmd+A: Select all visible bookmarks
              setSelectAllMatching(false);
              if (data?.data) {
                setSelectedIds(data.data.map((b: any) => b.id));
              }
            }
            return;
          case 'd':
            e.preventDefault();
            // Deselect all
            setSelectedIds([]);
            setSelectAllMatching(false);
            return;
        }
      }

      // Check if user is typing in an input field
      const activeElement = document.activeElement;
      if (
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        (activeElement as HTMLElement)?.contentEditable === 'true'
      ) {
        // If in search input, handle ESC to clear and blur
        if (activeElement === searchInputRef.current && e.key === 'Escape') {
          e.preventDefault();
          setSearchQuery("");
          searchInputRef.current?.blur();
        }
        return;
      }

      // Handle ESC key (must be before modal blocking check)
      if (e.key === 'Escape') {
        e.preventDefault();
        // Close modal if open (priority)
        if (triageBookmark) {
          setTriageBookmark(null);
          setQueueIndex(-1);
          setListFilterText("");
          setHighlightedListIndex(0);
        } else if (selectAllMatching || selectedIds.length > 0) {
          // Clear all selections (both visible and "all matching")
          setSelectAllMatching(false);
          setSelectedIds([]);
        } else if (focusedRowIndex >= 0) {
          // Clear focus if row is focused
          setFocusedRowIndex(-1);
        }
        return;
      }

      // Handle triage modal keyboard navigation when modal is open
      if (triageBookmark) {
        switch (e.key) {
          case "ArrowUp":
            e.preventDefault();
            setHighlightedListIndex(prev => {
              const newIndex = prev > 0 ? prev - 1 : Math.max(0, filteredLists.length - 1);
              console.log("Arrow Up: index", prev, "->", newIndex, "list:", filteredLists[newIndex]?.name);
              return newIndex;
            });
            break;
          case "ArrowDown":
            e.preventDefault();
            setHighlightedListIndex(prev => {
              const newIndex = prev < filteredLists.length - 1 ? prev + 1 : 0;
              console.log("Arrow Down: index", prev, "->", newIndex, "list:", filteredLists[newIndex]?.name);
              return newIndex;
            });
            break;
          case "ArrowLeft":
            e.preventDefault();
            navigateToPrevInQueue();
            break;
          case "ArrowRight":
            e.preventDefault();
            navigateToNextInQueue();
            break;
          case "Enter":
            e.preventDefault();
            console.log("=== ENTER KEY DEBUG ===");
            console.log("Current filteredLists:", filteredLists.map(l => ({ id: l.id, name: l.name })));
            console.log("Current highlightedListIndex:", highlightedListIndex);
            console.log("Selected list:", filteredLists[highlightedListIndex]);
            
            if (e.metaKey || e.ctrlKey) {
              // Cmd+Return: assign and advance
              if (filteredLists[highlightedListIndex]) {
                console.log("Cmd+Enter: Assigning to list and advancing");
                assignBookmarkToList(String(filteredLists[highlightedListIndex].id));
                navigateToNextInQueue();
              }
            } else {
              // Regular Return: assign to list
              if (filteredLists[highlightedListIndex]) {
                console.log("Enter: Assigning to list");
                assignBookmarkToList(String(filteredLists[highlightedListIndex].id));
                setListFilterText("");
                setHighlightedListIndex(0);
              }
            }
            break;
          case "Backspace":
            e.preventDefault();
            setListFilterText(prev => prev.slice(0, -1));
            setHighlightedListIndex(0);
            break;
          default:
            // Handle typing to filter lists
            if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
              e.preventDefault();
              const newFilterText = listFilterText + e.key;
              console.log("Typing:", e.key, "New filter text:", newFilterText);
              setListFilterText(prev => {
                const updated = prev + e.key;
                console.log("Filter text updated to:", updated);
                return updated;
              });
              setHighlightedListIndex(0); // Reset to first result
              console.log("Highlighted index reset to 0");
            }
            break;
        }
        return;
      }

      if (!data?.data || data.data.length === 0) return;

      const bookmarks = data.data;
      const maxIndex = bookmarks.length - 1;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedRowIndex(prev => {
            if (prev === -1) return 0; // Start from top if no focus yet
            return prev < maxIndex ? prev + 1 : maxIndex;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedRowIndex(prev => {
            if (prev === -1) return 0; // Start from top if no focus yet
            return prev > 0 ? prev - 1 : 0;
          });
          break;
        case " ": // Space bar
          e.preventDefault();
          if (focusedRowIndex >= 0 && focusedRowIndex <= maxIndex) {
            const bookmarkId = bookmarks[focusedRowIndex].id;
            setSelectedIds(prev => 
              prev.includes(String(bookmarkId)) 
                ? prev.filter(id => id !== String(bookmarkId))
                : [...prev, String(bookmarkId)]
            );
          }
          break;
        case "Enter":
          e.preventDefault();
          if (focusedRowIndex >= 0 && focusedRowIndex <= maxIndex) {
            openTriageForIndex(focusedRowIndex);
          }
          break;
      }
    };

    // Add global keyboard listener
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [data, focusedRowIndex, triageBookmark, selectedIds, selectAllMatching, debouncedSearchQuery, filters, listFilterText, highlightedListIndex, filteredLists, availableLists, assignBookmarkToList, navigateToNextInQueue, navigateToPrevInQueue, openTriageForIndex, refetch]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error loading bookmarks: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bookmarks</h1>
        <a href="/bookmarks/create" className="btn btn-primary btn-md">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Bookmark
        </a>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search bookmarks... (Cmd+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full pr-10"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        {searchQuery && (
          <div className="text-sm text-base-content/60 mt-2">
            Searching for "{searchQuery}" • Press ESC to clear
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      <div className="mb-6 p-4 bg-base-200 rounded-lg">
        <div className="space-y-3">
          <span className="text-sm font-medium">Filters:</span>
          
          {/* Tag Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-base-content/60 min-w-12">Tags:</span>
            {filters.tagIds.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {filters.tagIds.map(tagId => {
                  const tagName = availableTags.find(tag => String(tag.id) === tagId)?.name || tagId;
                  return (
                    <span key={tagId} className="badge badge-outline badge-sm gap-1">
                      {tagName}
                      <button 
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          tagIds: prev.tagIds.filter(id => id !== tagId)
                        }))}
                        className="btn btn-ghost btn-xs p-0 h-3 w-3"
                      >×</button>
                    </span>
                  );
                })}
              </div>
            ) : (
              <span className="text-xs text-base-content/40">None selected</span>
            )}
            <button 
              onClick={() => setIsTagModalOpen(true)}
              className="btn btn-ghost btn-xs"
            >
              + Add Tag
            </button>
          </div>
          
          {/* List Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-base-content/60 min-w-12">Lists:</span>
            {filters.listIds.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {filters.listIds.map(listId => {
                  const listName = availableLists.find(list => String(list.id) === listId)?.name || listId;
                  return (
                    <span key={listId} className="badge badge-primary badge-sm gap-1">
                      {listName}
                      <button 
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          listIds: prev.listIds.filter(id => id !== listId)
                        }))}
                        className="btn btn-ghost btn-xs p-0 h-3 w-3"
                      >×</button>
                    </span>
                  );
                })}
              </div>
            ) : (
              <span className="text-xs text-base-content/40">None selected</span>
            )}
            <button 
              onClick={() => setIsListModalOpen(true)}
              className="btn btn-ghost btn-xs"
            >
              + Add List
            </button>
          </div>
          
          {/* Special Filters */}
          <div className="flex gap-4 items-center">
            <span className="text-xs text-base-content/60 min-w-12">Special:</span>
            <label className="label cursor-pointer gap-2">
              <input 
                type="checkbox" 
                className="checkbox checkbox-xs"
                checked={filters.showUntagged}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  showUntagged: e.target.checked
                }))}
              />
              <span className="label-text text-xs">Untagged</span>
            </label>
            
            <label className="label cursor-pointer gap-2">
              <input 
                type="checkbox" 
                className="checkbox checkbox-xs"
                checked={filters.showUnlisted}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  showUnlisted: e.target.checked
                }))}
              />
              <span className="label-text text-xs">No Lists</span>
            </label>
          </div>
          
          {/* Clear Filters */}
          {(filters.tagIds.length > 0 || filters.listIds.length > 0 || filters.showUntagged || filters.showUnlisted) && (
            <button 
              onClick={() => setFilters(prev => ({
                ...prev,
                tagIds: [],
                listIds: [],
                showUntagged: false,
                showUnlisted: false
              }))}
              className="btn btn-ghost btn-xs"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra" ref={tableRef}>
          <thead>
            <tr>
              <th className="w-16">
                <div className="tooltip tooltip-right" data-tip={
                  selectAllMatching 
                    ? "All matching results selected" 
                    : selectedIds.length > 0 
                      ? `${selectedIds.length} visible selected`
                      : "Click to select visible, Cmd+Shift+A for all"
                }>
                  <input 
                    type="checkbox" 
                    className={`checkbox checkbox-sm ${selectAllMatching ? 'checkbox-warning' : ''}`}
                    checked={selectAllMatching || (selectedIds.length === data?.data?.length && data.data.length > 0)}
                    onChange={(e) => {
                      if (selectAllMatching) {
                        // Currently in "all matching" mode, clicking unchecks everything
                        setSelectAllMatching(false);
                        setSelectedIds([]);
                      } else {
                        // Normal mode, toggle visible selection
                        handleSelectAll(e.target.checked);
                      }
                    }}
                  />
                  {selectAllMatching && (
                    <span className="absolute -top-1 -right-1 text-warning text-xs">⚠️</span>
                  )}
                </div>
              </th>
              <th className="w-8"></th>
              <th>Title</th>
              <th>URL</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((bookmark: any, index: number) => (
              <tr 
                key={bookmark.id} 
                className={`hover ${focusedRowIndex === index ? '!bg-primary/30' : ''}`}
              >
                <th>
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-sm"
                    checked={selectedIds.includes(bookmark.id)}
                    onChange={(e) => handleSelectOne(bookmark.id, e.target.checked)}
                  />
                </th>
                <td className="w-8">
                  {bookmark.content?.favicon ? (
                    <img 
                      src={bookmark.content.favicon} 
                      alt=""
                      className="w-4 h-4"
                      onError={(e) => {
                        // Replace with default bookmark icon on error
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <svg 
                    className="w-4 h-4 text-base-content/50" 
                    style={{display: bookmark.content?.favicon ? 'none' : 'block'}}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </td>
                <td className="font-medium">
                  {bookmark.title || bookmark.content?.title || "Untitled"}
                </td>
                <td className="text-sm text-base-content/70 max-w-xs truncate">
                  {bookmark.content?.url || "-"}
                </td>
                <td className="text-sm">
                  {bookmark.createdAt ? formatDate(bookmark.createdAt) : "-"}
                </td>
                <td>
                  <div className="flex gap-2">
                    <a 
                      href={`/bookmarks/show/${bookmark.id}`}
                      className="btn btn-sm btn-ghost"
                    >
                      View
                    </a>
                    <a 
                      href={`/bookmarks/edit/${bookmark.id}`}
                      className="btn btn-sm btn-primary"
                    >
                      Edit
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(!data?.data || data.data.length === 0) && (
        <div className="text-center py-12">
          <div className="text-base-content/50 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">No bookmarks yet</h3>
          <p className="text-base-content/70 mb-4">
            Start by creating your first bookmark
          </p>
          <a href="/bookmarks/create" className="btn btn-primary btn-md">
            Create Bookmark
          </a>
        </div>
      )}

      {/* Bulk Actions Toast */}
      {(selectedIds.length > 0 || selectAllMatching) && (
        <div className="toast toast-center toast-bottom">
          <div className={`alert shadow-lg ${selectAllMatching ? 'alert-warning' : ''}`}>
            <div>
              <span>
                {selectAllMatching 
                  ? "All matching results selected" 
                  : `${selectedIds.length} items selected`
                }
              </span>
              {selectAllMatching && (
                <div className="text-xs mt-1 opacity-80">
                  Press Cmd+D to deselect • T=Tags • L=Lists • A=Archive
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button className="btn btn-sm">Add Tags</button>
              <button className="btn btn-sm">Add to Lists</button>
              <button className="btn btn-sm">Archive</button>
              <button className="btn btn-sm btn-error">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {data?.data && data.data.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || isLoading}
            className="btn btn-outline btn-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          
          <span className="text-sm text-base-content/70">
            Page {currentPage}
          </span>
          
          <button 
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={!data?.data || data.data.length < 20 || isLoading}
            className="btn btn-outline btn-sm"
          >
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Triage Modal */}
      {triageBookmark && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setTriageBookmark(null)}></div>
          <div className="relative bg-base-100 rounded-lg max-w-3xl max-h-[90vh] overflow-y-auto p-0 w-full shadow-2xl">
            {/* Header */}
            <div className="p-6 pb-4 border-b border-base-300">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-base-content/60">
                  Bookmark {queueIndex + 1} of {data?.data?.length || 0}
                </div>
                <div className="flex gap-2 text-xs text-base-content/50">
                  <span>←→ Navigate</span>
                  <span>↑↓ Select</span>
                  <span>⏎ Assign</span>
                  <span>⌘⏎ Assign & Next</span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                {triageBookmark.content?.favicon && (
                  <img 
                    src={triageBookmark.content.favicon} 
                    alt=""
                    className="w-8 h-8 flex-shrink-0 mt-1"
                    onError={(e) => e.currentTarget.style.display = 'none'}
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-xl leading-tight mb-2">
                    {triageBookmark.title || triageBookmark.content?.title || "Untitled"}
                  </h3>
                  {triageBookmark.content?.url && (
                    <a 
                      href={triageBookmark.content.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="link link-primary text-sm"
                      title={triageBookmark.content.url}
                    >
                      {triageBookmark.content.url.length > 60 
                        ? triageBookmark.content.url.substring(0, 60) + '...'
                        : triageBookmark.content.url
                      }
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Current Lists */}
              <div>
                <h4 className="font-semibold text-base mb-3">Currently in Lists:</h4>
                <div className="flex flex-wrap gap-2">
                  {triageBookmark.lists && triageBookmark.lists.length > 0 ? (
                    triageBookmark.lists.map((list: any, index: number) => (
                      <span 
                        key={index} 
                        className="badge badge-primary"
                      >
                        {typeof list === 'string' ? list : list.name || list.id}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-base-content/50">Not in any lists</span>
                  )}
                </div>
              </div>

              {/* List Filter Interface */}
              <div>
                <h4 className="font-semibold text-base mb-3">Add to List:</h4>
                
                {/* Assignment Feedback */}
                {assignmentFeedback && (
                  <div className={`mb-3 p-2 rounded text-sm ${
                    assignmentFeedback.type === 'success' ? 'bg-success/20 text-success' :
                    assignmentFeedback.type === 'error' ? 'bg-error/20 text-error' :
                    'bg-info/20 text-info'
                  }`}>
                    {assignmentFeedback.message}
                  </div>
                )}
                
                {/* Filter Display */}
                <div className="mb-4">
                  <div className="text-lg font-mono bg-base-200 rounded px-3 py-2 min-h-[2.5rem] flex items-center">
                    {listFilterText || <span className="text-base-content/40">Start typing to filter lists...</span>}
                    <span className="animate-pulse">|</span>
                  </div>
                </div>

                {/* Available Lists */}
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {filteredLists.length === 0 ? (
                    <div className="text-center py-8 text-base-content/50">
                      {listFilterText ? "No lists found" : "Start typing to see available lists"}
                    </div>
                  ) : (
                    filteredLists.map((list, index) => (
                      <div
                        key={list.id}
                        className={`p-3 rounded-lg flex items-center gap-3 ${
                          index === highlightedListIndex 
                            ? 'bg-primary text-primary-content' 
                            : 'bg-base-200 hover:bg-base-300'
                        }`}
                      >
                        <span className="text-lg">{list.icon || "📁"}</span>
                        <span className="font-medium">{list.name}</span>
                        {index === highlightedListIndex && (
                          <span className="ml-auto text-sm opacity-80">Press ⏎</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-base-300 bg-base-50 text-center">
              <div className="text-xs text-base-content/60">
                Press <kbd className="kbd kbd-xs">ESC</kbd> to close
                {data?.data && queueIndex < data.data.length - 1 && (
                  <span> • <kbd className="kbd kbd-xs">⌘</kbd><kbd className="kbd kbd-xs">⏎</kbd> to assign and move to next bookmark</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tag Picker Modal */}
      <TagPickerModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onSelectTags={handleTagsSelected}
        selectedTagIds={filters.tagIds}
        title="Filter by Tags"
      />

      {/* List Picker Modal */}
      <ListPickerModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onSelectLists={handleListsSelected}
        selectedListIds={filters.listIds}
        title="Filter by Lists"
      />
    </div>
  );
};