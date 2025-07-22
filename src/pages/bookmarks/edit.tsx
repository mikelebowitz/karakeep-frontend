import { useForm } from "@refinedev/react-hook-form";
import { useParams } from "react-router-dom";

export const BookmarkEdit: React.FC = () => {
  const { id } = useParams();
  
  const {
    refineCore: { onFinish, formLoading, queryResult },
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      resource: "bookmarks",
      action: "edit",
      id,
    },
  });

  const bookmark = queryResult?.data?.data;

  if (formLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Bookmark</h1>
        <a href="/bookmarks" className="btn btn-ghost">
          Back to List
        </a>
      </div>

      <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Title</span>
              </label>
              <input
                {...register("title", { 
                  required: "Title is required",
                })}
                type="text"
                placeholder="Enter bookmark title"
                className={`input input-bordered ${errors.title ? "input-error" : ""}`}
                defaultValue={bookmark?.title || bookmark?.content?.title}
              />
              {errors.title && (
                <label className="label">
                  <span className="label-text-alt text-error">{String(errors.title.message)}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">URL</span>
              </label>
              <input
                {...register("content.url")}
                type="url"
                placeholder="https://example.com"
                className="input input-bordered"
                defaultValue={bookmark?.content?.url}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Description</span>
              </label>
              <textarea
                {...register("content.description")}
                placeholder="Enter bookmark description"
                className="textarea textarea-bordered h-24"
                defaultValue={bookmark?.content?.description}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Tags</span>
                <span className="label-text-alt">Comma-separated</span>
              </label>
              <input
                {...register("tags")}
                type="text"
                placeholder="tag1, tag2, tag3"
                className="input input-bordered"
                defaultValue={bookmark?.tags?.join(", ")}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <a href={`/bookmarks/show/${id}`} className="btn btn-ghost">
            Cancel
          </a>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={formLoading}
          >
            {formLoading && <span className="loading loading-spinner loading-sm"></span>}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};