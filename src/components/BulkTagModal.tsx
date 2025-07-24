import { useState, useEffect, useRef } from "react";

interface BulkTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (selectedTagIds: string[]) => void;
  availableTags: any[];
  isLoading?: boolean;
  selectedBookmarkCount: number;
  selectAllMatching?: boolean;
}

export const BulkTagModal: React.FC<BulkTagModalProps> = ({
  isOpen,
  onClose,
  onApply,
  availableTags,
  isLoading = false,
  selectedBookmarkCount,
  selectAllMatching = false
}) => {
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter tags based on search query
  const filteredTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedTagIds([]);
      setSearchQuery("");
      // Focus search input after modal is rendered
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleApply = () => {
    onApply(selectedTagIds);
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
  }, [isOpen, selectedTagIds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-base-100 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-base-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Add Tags to Bookmarks</h2>
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
              ? "Adding tags to all matching bookmarks"
              : `Adding tags to ${selectedBookmarkCount} selected bookmark${selectedBookmarkCount > 1 ? 's' : ''}`
            }
          </div>
          
          {/* Search Input */}
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full"
            disabled={isLoading}
          />
        </div>

        {/* Tag List */}
        <div className="p-6 overflow-y-auto max-h-96">
          {filteredTags.length === 0 ? (
            <div className="text-center py-8 text-base-content/50">
              {searchQuery ? 'No tags found matching your search' : 'No tags available'}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTags.map((tag) => (
                <label
                  key={tag.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedTagIds.includes(tag.id)}
                    onChange={() => handleTagToggle(tag.id)}
                    className="checkbox checkbox-primary"
                    disabled={isLoading}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{tag.name}</div>
                    {tag.bookmarkCount && (
                      <div className="text-sm text-base-content/50">
                        {tag.bookmarkCount} bookmarks
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
            {selectedTagIds.length > 0 && `${selectedTagIds.length} tag${selectedTagIds.length > 1 ? 's' : ''} selected`}
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
              disabled={isLoading || selectedTagIds.length === 0}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                `Add ${selectedTagIds.length} Tag${selectedTagIds.length > 1 ? 's' : ''}`
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