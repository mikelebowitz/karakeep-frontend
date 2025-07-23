import { useList, useCreate } from "@refinedev/core";
import { useState, useEffect } from "react";

interface TagPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTags: (tagIds: string[]) => void;
  selectedTagIds?: string[];
  title?: string;
}

export const TagPickerModal: React.FC<TagPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectTags,
  selectedTagIds = [],
  title = "Select Tags"
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [localSelected, setLocalSelected] = useState<string[]>(selectedTagIds);
  const [isCreating, setIsCreating] = useState(false);

  const { data: tagsData, isLoading, refetch } = useList({
    resource: "tags",
    pagination: { pageSize: 100 }
  });

  const { mutate: createTag } = useCreate();

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelected(selectedTagIds);
      setSearchQuery("");
      setNewTagName("");
    }
  }, [isOpen, selectedTagIds]);

  const tags = tagsData?.data || [];
  
  // Filter tags based on search query
  const filteredTags = tags.filter(tag =>
    tag.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleTag = (tagId: string) => {
    setLocalSelected(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    
    setIsCreating(true);
    try {
      createTag({
        resource: "tags",
        values: { name: newTagName.trim() }
      }, {
        onSuccess: (data) => {
          // Add the new tag to selection
          const newTagId = String(data.data.id);
          setLocalSelected(prev => [...prev, newTagId]);
          setNewTagName("");
          refetch(); // Refresh the tags list
        },
        onError: (error) => {
          console.error("Failed to create tag:", error);
        }
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSave = () => {
    onSelectTags(localSelected);
    onClose();
  };

  const handleCancel = () => {
    setLocalSelected(selectedTagIds); // Reset to original selection
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={handleCancel}></div>
      <div className="relative bg-base-100 rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-base-300">
          <h3 className="font-bold text-lg">{title}</h3>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Search */}
          <div className="form-control">
            <input
              type="text"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered input-sm"
            />
          </div>

          {/* Create New Tag */}
          <div className="bg-base-200 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-sm">Create New Tag</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="input input-bordered input-sm flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCreateTag();
                  }
                }}
              />
              <button
                onClick={handleCreateTag}
                disabled={!newTagName.trim() || isCreating}
                className="btn btn-primary btn-sm"
              >
                {isCreating ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </div>

          {/* Existing Tags */}
          <div>
            <h4 className="font-medium text-sm mb-3">Existing Tags</h4>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <span className="loading loading-spinner loading-sm"></span>
              </div>
            ) : filteredTags.length === 0 ? (
              <div className="text-center py-4 text-base-content/50">
                {searchQuery ? "No tags found" : "No tags available"}
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredTags.map((tag) => (
                  <label key={tag.id} className="flex items-center gap-3 cursor-pointer hover:bg-base-200 p-2 rounded">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={localSelected.includes(String(tag.id))}
                      onChange={() => handleToggleTag(String(tag.id))}
                    />
                    <span className="text-sm">{tag.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Selected Count */}
          {localSelected.length > 0 && (
            <div className="text-sm text-base-content/70">
              {localSelected.length} tag{localSelected.length !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-base-300 flex justify-end gap-2">
          <button onClick={handleCancel} className="btn btn-ghost">
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            Apply Tags
          </button>
        </div>
      </div>
    </div>
  );
};