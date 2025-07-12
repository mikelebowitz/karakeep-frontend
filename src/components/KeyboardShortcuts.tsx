import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotify } from 'react-admin';

export const KeyboardShortcuts = () => {
  const navigate = useNavigate();
  const notify = useNotify();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      const activeElement = document.activeElement;
      if (
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      // Cmd/Ctrl + K for quick search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[name="q"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      // Cmd/Ctrl + N for new bookmark
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        navigate('/bookmarks/create');
      }

      // G then B for go to bookmarks
      if (e.key === 'g') {
        const listener = (event: KeyboardEvent) => {
          if (event.key === 'b') {
            navigate('/bookmarks');
            window.removeEventListener('keydown', listener);
          } else if (event.key === 't') {
            navigate('/tags');
            window.removeEventListener('keydown', listener);
          } else if (event.key === 'l') {
            navigate('/lists');
            window.removeEventListener('keydown', listener);
          }
        };
        window.addEventListener('keydown', listener);
        
        // Remove listener after 2 seconds
        setTimeout(() => {
          window.removeEventListener('keydown', listener);
        }, 2000);
      }

      // ? for help
      if (e.key === '?' && !e.shiftKey) {
        e.preventDefault();
        notify(
          `Keyboard Shortcuts:
          • Cmd/Ctrl + K: Quick search
          • Cmd/Ctrl + N: New bookmark
          • G then B: Go to bookmarks
          • G then T: Go to tags
          • G then L: Go to lists
          • ?: Show this help`,
          { type: 'info', multiLine: true }
        );
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [navigate, notify]);

  return null;
};