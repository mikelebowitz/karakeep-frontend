import { useList, useCreate } from "@refinedev/core";
import { useState, useEffect } from "react";

interface ListPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLists: (listIds: string[]) => void;
  selectedListIds?: string[];
  title?: string;
}

export const ListPickerModal: React.FC<ListPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectLists,
  selectedListIds = [],
  title = "Select Lists"
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newListName, setNewListName] = useState("");
  const [localSelected, setLocalSelected] = useState<string[]>(selectedListIds);
  const [isCreating, setIsCreating] = useState(false);

  const { data: listsData, isLoading, refetch } = useList({
    resource: "lists",
    pagination: { pageSize: 100 }
  });

  const { mutate: createList } = useCreate();

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelected(selectedListIds);
      setSearchQuery("");
      setNewListName("");
    }
  }, [isOpen, selectedListIds]);

  const lists = listsData?.data || [];
  
  // Filter lists based on search query
  const filteredLists = lists.filter(list =>
    list.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleList = (listId: string) => {
    setLocalSelected(prev => 
      prev.includes(listId)
        ? prev.filter(id => id !== listId)
        : [...prev, listId]
    );
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    
    setIsCreating(true);
    try {
      createList({
        resource: "lists",
        values: { 
          name: newListName.trim(),
          icon: "📁" // Default icon for new lists
        }
      }, {
        onSuccess: (data) => {
          // Add the new list to selection
          const newListId = String(data.data.id);
          setLocalSelected(prev => [...prev, newListId]);
          setNewListName("");
          refetch(); // Refresh the lists list
        },
        onError: (error) => {
          console.error("Failed to create list:", error);
        }
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSave = () => {
    onSelectLists(localSelected);
    onClose();
  };

  const handleCancel = () => {
    setLocalSelected(selectedListIds); // Reset to original selection
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
              placeholder="Search lists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered input-sm"
            />
          </div>

          {/* Create New List */}
          <div className="bg-base-200 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-sm">Create New List</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter list name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="input input-bordered input-sm flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCreateList();
                  }
                }}
              />
              <button
                onClick={handleCreateList}
                disabled={!newListName.trim() || isCreating}
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

          {/* Existing Lists */}
          <div>
            <h4 className="font-medium text-sm mb-3">Existing Lists</h4>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <span className="loading loading-spinner loading-sm"></span>
              </div>
            ) : filteredLists.length === 0 ? (
              <div className="text-center py-4 text-base-content/50">
                {searchQuery ? "No lists found" : "No lists available"}
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredLists.map((list) => (
                  <label key={list.id} className="flex items-center gap-3 cursor-pointer hover:bg-base-200 p-2 rounded">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={localSelected.includes(String(list.id))}
                      onChange={() => handleToggleList(String(list.id))}
                    />
                    <span className="text-lg">{list.icon || "📁"}</span>
                    <span className="text-sm">{list.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Selected Count */}
          {localSelected.length > 0 && (
            <div className="text-sm text-base-content/70">
              {localSelected.length} list{localSelected.length !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-base-300 flex justify-end gap-2">
          <button onClick={handleCancel} className="btn btn-ghost">
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            Apply Lists
          </button>
        </div>
      </div>
    </div>
  );
};