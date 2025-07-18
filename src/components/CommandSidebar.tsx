// No Material-UI imports needed for DaisyUI components
import { type SmartKeyBinding } from '../utils/smartKeyBinding';

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
  // Filter out smart lists (Inbox and other system lists)
  const smartListNames = ['Inbox', 'All', 'Unread', 'Starred', 'Archive'];
  const userLists = lists.filter(list => !smartListNames.includes(list.name));
  
  // Filter smart key bindings to only include user lists
  const filteredSmartKeyBindings = smartKeyBindings 
    ? smartKeyBindings.filter(binding => {
        const list = lists.find(l => l.id === binding.listId);
        return list && !smartListNames.includes(list.name);
      })
    : [];
  
  // Use filtered smart key bindings if available, otherwise show user lists with sequential keys
  const useSmartKeys = filteredSmartKeyBindings && filteredSmartKeyBindings.length > 0;
  const availableLists = useSmartKeys 
    ? filteredSmartKeyBindings.map(binding => userLists.find(list => list.id === binding.listId)).filter(Boolean)
    : userLists;
  
  return (
    <div className="CommandSidebar bg-base-100 h-full">
      <div className="p-6 flex-1 overflow-auto">
        {/* Lists Section */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-base-content/70 mb-4">Lists</h3>
          
          {availableLists.length === 0 ? (
            <p className="text-base-content/60 text-xs">No lists available</p>
          ) : (
            <div className="space-y-3">
              {availableLists.map((list, index) => {
                // Use filtered smart key bindings if available, otherwise use index as key
                const keyBinding = useSmartKeys 
                  ? filteredSmartKeyBindings[index]
                  : { key: (index + 1).toString() };
                
                if (!keyBinding) return null;
                
                const isSelected = selectedLists.includes(list.id);
                
                return (
                  <div
                    key={list.id}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => onListToggle(index)}
                  >
                    <kbd className="kbd kbd-xs w-8 flex-shrink-0">{keyBinding.key}</kbd>
                    <span className={`text-base flex-1 ${
                      isSelected 
                        ? 'text-primary font-semibold' 
                        : 'text-base-content/60'
                    }`}>
                      {list.icon || '📁'} {list.name}
                    </span>
                    {isSelected && (
                      <span className="text-primary text-xs">✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};