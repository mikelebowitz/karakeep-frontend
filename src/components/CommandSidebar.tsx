// No Material-UI imports needed for DaisyUI components
import { type SmartKeyBinding, getReasonText } from '../utils/smartKeyBinding';

interface CommandSidebarProps {
  lists: any[];
  selectedLists: string[];
  onListToggle: (index: number) => void;
  smartKeyBindings?: SmartKeyBinding[];
}

export const CommandSidebar = ({ 
  lists, 
  selectedLists, 
  onListToggle,
  smartKeyBindings 
}: CommandSidebarProps) => {
  // Use smart key bindings if available, otherwise show all lists
  const useSmartKeys = smartKeyBindings && smartKeyBindings.length > 0;
  const availableLists = useSmartKeys 
    ? smartKeyBindings.map(binding => lists.find(list => list.id === binding.listId)).filter(Boolean)
    : lists;
  
  return (
    <div className="card bg-base-100 border border-base-300 h-full">
      <div className="card-body flex-1 overflow-auto">
        {/* Available Lists Section */}
        <div className="flex-1">
          <h3 className="text-base font-bold mb-4 text-base-content">Available Lists</h3>
          
          {availableLists.length === 0 ? (
            <p className="text-base-content/60 text-xs">No lists available</p>
          ) : (
            <div className="space-y-2">
              {availableLists.map((list, index) => {
                // Use smart key bindings if available, otherwise use index as key
                const keyBinding = useSmartKeys 
                  ? smartKeyBindings[index]
                  : { key: (index + 1).toString() };
                
                if (!keyBinding) return null;
                
                const isSelected = selectedLists.includes(list.id);
                
                return (
                  <div
                    key={list.id}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg cursor-pointer
                      transition-all duration-200
                      ${isSelected 
                        ? 'bg-primary text-primary-content border border-primary' 
                        : 'bg-base-200 hover:bg-base-300 border border-base-300'
                      }
                    `}
                    onClick={() => onListToggle(index)}
                  >
                    <div className="flex items-center gap-1">
                      <kbd className="kbd kbd-xs min-w-[1.75rem] text-center">
                        {keyBinding.key}
                      </kbd>
                      {useSmartKeys && 'reason' in keyBinding && (
                        <span className="text-xs text-base-content/40">
                          {getReasonText(keyBinding.reason)}
                        </span>
                      )}
                    </div>
                    <span className="text-xl" role="img" aria-label={list.name}>
                      {list.icon || '📁'}
                    </span>
                    <span className={`flex-1 text-sm ${isSelected ? 'font-semibold text-primary-content' : 'text-base-content/80'}`}>
                      {list.name}
                    </span>
                    {isSelected && (
                      <span className="text-primary-content text-xs">✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Show selected lists summary */}
          {selectedLists.length > 0 && (
            <div className="mt-6 p-3 bg-primary/10 rounded-lg">
              <p className="text-sm font-semibold text-primary">
                Selected: {selectedLists.length} list{selectedLists.length !== 1 ? 's' : ''}
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {selectedLists.map(listId => {
                  const list = lists.find(l => l.id === listId);
                  return list ? (
                    <span key={listId} className="badge badge-primary badge-sm">
                      {list.icon} {list.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Keyboard Layout Info */}
        <div className="mt-auto pt-4 border-t border-base-300">
          <p className="text-xs text-base-content/60">
            Keyboard layout can be changed in settings
          </p>
        </div>
      </div>
    </div>
  );
};