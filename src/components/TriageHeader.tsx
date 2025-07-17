import { Close } from '@mui/icons-material';

interface TriageHeaderProps {
  current: number;
  total: number;
  completed: number;
  onQuit: () => void;
}

export const TriageHeader = ({ current, total, completed, onQuit }: TriageHeaderProps) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  
  return (
    <div className="card bg-base-100 border border-base-300 mb-4">
      <div className="card-body py-3">
        <div className="flex justify-between items-center">
          {/* Title and Status */}
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-base-content">Triage Mode</h1>
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
              <div className="text-xs text-base-content/60 mb-1 font-normal">
                {percentage}% complete
              </div>
              <div className="w-40">
                <progress 
                  className="progress progress-primary w-full h-2" 
                  value={completed} 
                  max={total}
                ></progress>
              </div>
            </div>
            
            <button 
              onClick={onQuit}
              className="btn btn-ghost btn-sm btn-circle"
              title="Quit triage mode"
            >
              <Close fontSize="small" />
            </button>
          </div>
        </div>
        
        {/* Quick instructions */}
        <div className="mt-3 text-xs text-base-content/50 font-normal">
          Use smart keys to select lists, <kbd className="kbd kbd-xs">⌘↩</kbd> to apply, 
          <kbd className="kbd kbd-xs">esc</kbd> to skip, <kbd className="kbd kbd-xs">q</kbd> to quit
        </div>
      </div>
    </div>
  );
};