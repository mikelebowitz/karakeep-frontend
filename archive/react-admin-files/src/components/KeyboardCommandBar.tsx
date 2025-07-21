// No Material-UI imports needed for DaisyUI components
import { 
  formatKeyCombo, 
  type TriageKeyboardConfig
} from '../config/triageKeyboardConfig';

interface KeyboardCommandBarProps {
  keyboardConfig: TriageKeyboardConfig;
}

export const KeyboardCommandBar = ({ keyboardConfig }: KeyboardCommandBarProps) => {
  return (
    <div className="mb-4">
      <div className="py-3">
        <div className="flex items-center gap-6 w-full">
          <h3 className="text-sm font-semibold text-base-content/70 min-w-fit">
            Keyboard Commands:
          </h3>
        
        <div className="flex items-center gap-6 flex-wrap">
          {/* Core commands */}
          <div className="flex items-center gap-2">
            <kbd className="kbd kbd-xs">{formatKeyCombo(keyboardConfig.APPLY_AND_NEXT)}</kbd>
            <span className="text-xs text-base-content/60">{keyboardConfig.APPLY_AND_NEXT.description}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <kbd className="kbd kbd-xs">{formatKeyCombo(keyboardConfig.SKIP_TO_NEXT)}</kbd>
            <span className="text-xs text-base-content/60">{keyboardConfig.SKIP_TO_NEXT.description}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <kbd className="kbd kbd-xs">{formatKeyCombo(keyboardConfig.QUIT)}</kbd>
            <span className="text-xs text-base-content/60">{keyboardConfig.QUIT.description}</span>
          </div>
          
          {/* Navigation commands if available */}
          {keyboardConfig.NEXT && (
            <div className="flex items-center gap-2">
              <kbd className="kbd kbd-xs">{formatKeyCombo(keyboardConfig.NEXT)}</kbd>
              <span className="text-xs text-base-content/60">{keyboardConfig.NEXT.description}</span>
            </div>
          )}
          
          {keyboardConfig.PREVIOUS && (
            <div className="flex items-center gap-2">
              <kbd className="kbd kbd-xs">{formatKeyCombo(keyboardConfig.PREVIOUS)}</kbd>
              <span className="text-xs text-base-content/60">{keyboardConfig.PREVIOUS.description}</span>
            </div>
          )}
          
          {keyboardConfig.APPLY_AND_PREV && (
            <div className="flex items-center gap-2">
              <kbd className="kbd kbd-xs">{formatKeyCombo(keyboardConfig.APPLY_AND_PREV)}</kbd>
              <span className="text-xs text-base-content/60">{keyboardConfig.APPLY_AND_PREV.description}</span>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};