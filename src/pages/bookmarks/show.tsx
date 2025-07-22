import { useShow } from "@refinedev/core";
import { useParams } from "react-router-dom";

export const BookmarkShow: React.FC = () => {
  const { id } = useParams();
  const { queryResult } = useShow({
    resource: "bookmarks",
    id,
  });

  const { data, isLoading, error } = queryResult;

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
        <span>Error loading bookmark: {error.message}</span>
      </div>
    );
  }

  const bookmark = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">
            {bookmark?.title || bookmark?.content?.title || "Untitled Bookmark"}
          </h1>
          {bookmark?.content?.url && (
            <p className="text-base-content/70 mt-1">
              <a 
                href={bookmark.content.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="link link-primary"
              >
                {bookmark.content.url}
              </a>
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <a 
            href={`/bookmarks/edit/${bookmark?.id}`}
            className="btn btn-primary btn-sm"
          >
            Edit
          </a>
          <a href="/bookmarks" className="btn btn-ghost btn-sm">
            Back to List
          </a>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {bookmark?.content?.description && (
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-lg">Description</h3>
                <p className="whitespace-pre-wrap">{bookmark.content.description}</p>
              </div>
            </div>
          )}
          
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-lg">Details</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {bookmark?.created_at ? new Date(bookmark.created_at).toLocaleDateString() : "Unknown"}
                </div>
                <div>
                  <span className="font-medium">Updated:</span>{" "}
                  {bookmark?.updated_at ? new Date(bookmark.updated_at).toLocaleDateString() : "Unknown"}
                </div>
                {bookmark?.content?.url && (
                  <div>
                    <span className="font-medium">URL:</span>{" "}
                    <a 
                      href={bookmark.content.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="link link-primary break-all"
                    >
                      {bookmark.content.url}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-lg">Tags</h3>
              {bookmark?.tags && bookmark.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {bookmark.tags.map((tag: string, index: number) => (
                    <span key={index} className="tag-badge">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-base-content/50">No tags assigned</p>
              )}
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-lg">Lists</h3>
              {bookmark?.lists && bookmark.lists.length > 0 ? (
                <div className="space-y-2">
                  {bookmark.lists.map((list: string, index: number) => (
                    <span key={index} className="list-badge">
                      {list}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-base-content/50">Not in any lists</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};