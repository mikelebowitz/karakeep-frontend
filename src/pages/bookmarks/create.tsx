import { useForm } from "@refinedev/react-hook-form";

export const BookmarkCreate: React.FC = () => {
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      resource: "bookmarks",
      action: "create",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Create New Bookmark</h1>
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
                <span className="label-text-alt text-error">*</span>
              </label>
              <input
                {...register("title", { 
                  required: "Title is required",
                })}
                type="text"
                placeholder="Enter bookmark title"
                className={`input input-bordered ${errors.title ? "input-error" : ""}`}
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
              />
            </div>

            <div className="alert alert-info">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>New bookmarks will be automatically added to your Inbox list.</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <a href="/bookmarks" className="btn btn-ghost">
            Cancel
          </a>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={formLoading}
          >
            {formLoading && <span className="loading loading-spinner loading-sm"></span>}
            Create Bookmark
          </button>
        </div>
      </form>
    </div>
  );
};