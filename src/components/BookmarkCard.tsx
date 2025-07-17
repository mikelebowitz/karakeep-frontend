import { Avatar } from '@mui/material';
import { Bookmark } from '@mui/icons-material';

interface BookmarkCardProps {
  bookmark: any;
  isProcessing?: boolean;
}

// Utility function to extract domain from URL (reuse from BookmarkList)
const extractDomain = (url: string): string => {
  if (!url) return '';
  
  try {
    // Remove protocol if present
    const cleanUrl = url.replace(/^https?:\/\//, '');
    // Remove www. if present
    const withoutWww = cleanUrl.replace(/^www\./, '');
    // Extract domain (everything before the first slash)
    const domain = withoutWww.split('/')[0];
    // Remove port if present
    return domain.split(':')[0];
  } catch {
    // If URL parsing fails, return the original URL truncated
    return url.substring(0, 30) + (url.length > 30 ? '...' : '');
  }
};

export const BookmarkCard = ({ bookmark, isProcessing }: BookmarkCardProps) => {
  const domain = extractDomain(bookmark.content?.url || '');
  
  const handleCardClick = () => {
    if (bookmark.content?.url && !isProcessing) {
      window.open(bookmark.content.url, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <div 
      className={`card bg-base-100 border border-base-300 transition-all duration-300 ${
        isProcessing 
          ? 'opacity-50' 
          : 'cursor-pointer hover:bg-base-50 hover:border-base-400'
      }`}
      style={{ width: '100%', maxWidth: 600 }}
      onClick={handleCardClick}
    >
      <div className="card-body">
        {/* Header with favicon and domain */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar 
            src={bookmark.content?.favicon} 
            sx={{ width: 48, height: 48 }}
            className="mt-1"
          >
            <Bookmark />
          </Avatar>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-base-content leading-6 mb-1">
              {bookmark.content?.title || bookmark.title || 'Untitled'}
            </h2>
            <p className="text-sm text-base-content/60 font-normal">
              {domain}
            </p>
          </div>
        </div>
        
        {/* Description */}
        {bookmark.content?.description && (
          <div className="mb-4">
            <p className="text-sm text-base-content/70 leading-relaxed font-normal">
              {bookmark.content.description}
            </p>
          </div>
        )}
        
        {/* Note */}
        {bookmark.note && (
          <div className="alert alert-info mb-4">
            <div>
              <span className="font-semibold">Note:</span> {bookmark.note}
            </div>
          </div>
        )}
        
        {/* Summary */}
        {bookmark.summary && (
          <div className="mb-4 p-3 bg-base-200 rounded-lg">
            <p className="text-sm">
              <span className="font-semibold">Summary:</span> {bookmark.summary}
            </p>
          </div>
        )}
        
        {/* Tags */}
        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-base-content/70 uppercase tracking-wide">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {bookmark.tags.map((tag: any) => (
                <span
                  key={tag.id}
                  className={`badge badge-sm ${
                    tag.attachedBy === 'ai' 
                      ? 'badge-primary' 
                      : 'badge-outline'
                  }`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Current Lists (if any) */}
        {bookmark.lists && bookmark.lists.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold">Currently in:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {bookmark.lists.map((list: any) => (
                <div key={list.id} className="badge badge-neutral gap-1">
                  {list.icon && <span>{list.icon}</span>}
                  {list.name}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Metadata */}
        <div className="mt-6 pt-4 border-t border-base-300">
          <div className="flex justify-between text-sm text-base-content/60">
            <span>Created: {new Date(bookmark.createdAt).toLocaleDateString()}</span>
            {bookmark.updatedAt && (
              <span>Updated: {new Date(bookmark.updatedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};