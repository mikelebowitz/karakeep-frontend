import { useList } from "@refinedev/core";
import { useState, useEffect, useRef } from "react";

export const BookmarkList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = useList({
    resource: "bookmarks",
    pagination: {
      current: currentPage,
      pageSize: 20,
    },
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [focusedRowIndex, setFocusedRowIndex] = useState<number>(-1);
  const [triageBookmark, setTriageBookmark] = useState<any>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      const activeElement = document.activeElement;
      if (
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        (activeElement as HTMLElement)?.contentEditable === 'true'
      ) {
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
              prev.includes(bookmarkId) 
                ? prev.filter(id => id !== bookmarkId)
                : [...prev, bookmarkId]
            );
          }
          break;
        case "Enter":
          e.preventDefault();
          if (focusedRowIndex >= 0 && focusedRowIndex <= maxIndex) {
            const bookmark = bookmarks[focusedRowIndex];
            setTriageBookmark(bookmark);
            modalRef.current?.showModal();
          }
          break;
        case "Escape":
          e.preventDefault();
          // Close modal if open
          if (modalRef.current?.open) {
            modalRef.current.close();
            setTriageBookmark(null);
          } else {
            // Clear all selections and focus if modal is not open
            setSelectedIds([]);
            setFocusedRowIndex(-1);
          }
          break;
      }
    };

    // Add global keyboard listener
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [data, focusedRowIndex]);

  // Reset focus when page changes
  useEffect(() => {
    setFocusedRowIndex(-1);
    setSelectedIds([]);
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

      <div className="overflow-x-auto">
        <table className="table table-zebra" ref={tableRef}>
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-sm"
                  checked={selectedIds.length === data?.data?.length && data.data.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
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
      {selectedIds.length > 0 && (
        <div className="toast toast-center toast-bottom">
          <div className="alert shadow-lg">
            <div>
              <span>{selectedIds.length} items selected</span>
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
      <dialog ref={modalRef} className="modal">
        <div className="modal-box max-w-5xl max-h-[90vh] overflow-y-auto p-0">
          {triageBookmark && (
            <>
              {/* Header */}
              <div className="p-6 pb-4">
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
                        className="link link-primary text-sm break-all"
                      >
                        {triageBookmark.content.url}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-3 space-y-4">
                    {triageBookmark.content?.image && (
                      <div>
                        <img 
                          src={triageBookmark.content.image} 
                          alt="Bookmark preview"
                          className="w-full max-h-80 object-cover rounded-lg"
                          onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                      </div>
                    )}
                    
                    {triageBookmark.content?.description && (
                      <div>
                        <h4 className="font-semibold text-base mb-3">Description</h4>
                        <p className="text-sm leading-relaxed text-base-content/90">{triageBookmark.content.description}</p>
                      </div>
                    )}

                    {triageBookmark.content?.text && (
                      <div>
                        <h4 className="font-semibold text-base mb-3">Content</h4>
                        <div className="prose prose-sm max-w-none">
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-base-content/90">{triageBookmark.content.text}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sidebar */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Current Tags */}
                    <div>
                      <h4 className="font-semibold text-base mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {triageBookmark.tags && triageBookmark.tags.length > 0 ? (
                          triageBookmark.tags.map((tag: any, index: number) => (
                            <span 
                              key={index} 
                              className="badge badge-outline"
                            >
                              {typeof tag === 'string' ? tag : tag.name || tag.id}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-base-content/50">No tags</span>
                        )}
                      </div>
                    </div>

                    {/* Current Lists */}
                    <div>
                      <h4 className="font-semibold text-base mb-3">Lists</h4>
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
                          <span className="text-sm text-base-content/50">No lists</span>
                        )}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div>
                      <h4 className="font-semibold text-base mb-3">Details</h4>
                      <div className="text-sm space-y-2">
                        {triageBookmark.createdAt && (
                          <div>
                            <span className="text-base-content/60">Created:</span>{" "}
                            <span className="text-base-content">{new Date(triageBookmark.createdAt).toLocaleDateString()}</span>
                          </div>
                        )}
                        {triageBookmark.updatedAt && (
                          <div>
                            <span className="text-base-content/60">Updated:</span>{" "}
                            <span className="text-base-content">{new Date(triageBookmark.updatedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h4 className="font-semibold text-base mb-3">Quick Actions</h4>
                      <div className="flex flex-col gap-2">
                        <button className="btn btn-outline btn-sm">Add Tags</button>
                        <button className="btn btn-outline btn-sm">Add to List</button>
                        <button className="btn btn-outline btn-sm">Archive</button>
                        <a 
                          href={`/bookmarks/edit/${triageBookmark.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          Edit
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-action px-6 pb-6 pt-0">
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>
              </div>
            </>
          )}
        </div>
        <div className="modal-backdrop backdrop-blur-md">
          <button onClick={() => modalRef.current?.close()}>close</button>
        </div>
      </dialog>
    </div>
  );
};