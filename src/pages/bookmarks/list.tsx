import { useList } from "@refinedev/core";

export const BookmarkList: React.FC = () => {
  const { data, isLoading, error } = useList({
    resource: "bookmarks",
  });

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
        <a href="/bookmarks/create" className="btn btn-primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Bookmark
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.data?.map((bookmark: any) => (
          <div key={bookmark.id} className="bookmark-card">
            <div className="card-body">
              <h3 className="card-title text-sm">
                {bookmark.title || bookmark.content?.title || "Untitled"}
              </h3>
              
              {bookmark.content?.url && (
                <p className="text-xs text-base-content/70 truncate">
                  {bookmark.content.url}
                </p>
              )}
              
              {bookmark.content?.description && (
                <p className="text-sm text-base-content/80 line-clamp-2">
                  {bookmark.content.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-1 mt-2">
                {bookmark.tags?.slice(0, 3).map((tag: string, index: number) => (
                  <span key={index} className="tag-badge">
                    {tag}
                  </span>
                ))}
                {bookmark.tags?.length > 3 && (
                  <span className="tag-badge">+{bookmark.tags.length - 3}</span>
                )}
              </div>
              
              <div className="card-actions justify-end mt-4">
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
            </div>
          </div>
        ))}
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
          <a href="/bookmarks/create" className="btn btn-primary">
            Create Bookmark
          </a>
        </div>
      )}
    </div>
  );
};