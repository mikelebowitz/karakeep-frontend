import { XMarkIcon } from '@heroicons/react/24/outline';

interface TriageHeaderProps {
  current: number;
  total: number;
  completed: number;
  onQuit: () => void;
}

export const TriageHeader = ({ current, total, completed, onQuit }: TriageHeaderProps) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <div className="mb-6">
        <div className="flex justify-between items-center">
          {/* Title and Status */}
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-base-content">Triage Mode</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm font-normal text-base-content">
                {current} of {total} remaining
              </span>
              {completed > 0 && (
                <span className="badge badge-success badge-sm">
                  {completed} processed
                </span>
              )}
            </div>
          </div>
          
          {/* Progress bar and quit button */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <div className="w-40">
                <progress 
                  className="progress progress-primary w-full" 
                  value={completed} 
                  max={total}
                ></progress>
              </div>
              <div className="text-xs text-base-content/60 mt-1 font-normal">
                {percentage}% complete
              </div>
            </div>
            
            <button 
              onClick={onQuit}
              className="btn btn-outline btn-sm hover:btn-error"
              title="Back to bookmarks"
            >
              <XMarkIcon className="w-4 h-4" />
              <span className="ml-1">Back</span>
            </button>
          </div>
        </div>
    </div>
  );
};