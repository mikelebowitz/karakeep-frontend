import { useState, useEffect, useRef } from "react";

interface BulkListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (selectedListIds: string[]) => void;
  availableLists: any[];
  isLoading?: boolean;
  selectedBookmarkCount: number;
  selectAllMatching?: boolean;
}

export const BulkListModal: React.FC<BulkListModalProps> = ({
  isOpen,
  onClose,
  onApply,
  availableLists,
  isLoading = false,
  selectedBookmarkCount,
  selectAllMatching = false
}) => {
  const [selectedListIds, setSelectedListIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter lists based on search query
  const filteredLists = availableLists.filter(list =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedListIds([]);
      setSearchQuery("");
      // Focus search input after modal is rendered
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleListToggle = (listId: string) => {
    setSelectedListIds(prev =>
      prev.includes(listId)
        ? prev.filter(id => id !== listId)
        : [...prev, listId]
    );
  };

  const handleApply = () => {
    onApply(selectedListIds);
    onClose();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleApply();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, selectedListIds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-base-100 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-base-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Add Bookmarks to Lists</h2>
            <button 
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-square"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-sm text-base-content/70 mb-4">
            {selectAllMatching 
              ? "Adding all matching bookmarks to selected lists"
              : `Adding ${selectedBookmarkCount} selected bookmark${selectedBookmarkCount > 1 ? 's' : ''} to selected lists`
            }
          </div>
          
          {/* Search Input */}
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search lists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full"
            disabled={isLoading}
          />
        </div>

        {/* List List */}
        <div className="p-6 overflow-y-auto max-h-96">
          {filteredLists.length === 0 ? (
            <div className="text-center py-8 text-base-content/50">
              {searchQuery ? 'No lists found matching your search' : 'No lists available'}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLists.map((list) => (
                <label
                  key={list.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedListIds.includes(list.id)}
                    onChange={() => handleListToggle(list.id)}
                    className="checkbox checkbox-primary"
                    disabled={isLoading}
                  />
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2">
                      {list.icon && <span>{list.icon}</span>}
                      {list.name}
                    </div>
                    {list.bookmarkCount && (
                      <div className="text-sm text-base-content/50">
                        {list.bookmarkCount} bookmarks
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-base-300 flex justify-between items-center">
          <div className="text-sm text-base-content/70">
            {selectedListIds.length > 0 && `${selectedListIds.length} list${selectedListIds.length > 1 ? 's' : ''} selected`}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="btn btn-primary"
              disabled={isLoading || selectedListIds.length === 0}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                `Add to ${selectedListIds.length} List${selectedListIds.length > 1 ? 's' : ''}`
              )}
            </button>
          </div>
        </div>

        {/* Keyboard hints */}
        <div className="absolute bottom-2 left-6 text-xs text-base-content/50">
          ESC to cancel • Cmd+Enter to apply
        </div>
      </div>
    </div>
  );
};