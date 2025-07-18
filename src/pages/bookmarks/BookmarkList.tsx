import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotify, useDataProvider } from 'react-admin';
import { Avatar } from '@mui/material';
import { Bookmark, Speed, Edit, Delete } from '@mui/icons-material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';

// Utility function to extract domain from URL
const extractDomain = (url: string): string => {
  if (!url) return '';
  
  try {
    const cleanUrl = url.replace(/^https?:\/\//, '');
    const withoutWww = cleanUrl.replace(/^www\./, '');
    const domain = withoutWww.split('/')[0];
    return domain.split(':')[0];
  } catch {
    return url.substring(0, 30) + (url.length > 30 ? '...' : '');
  }
};

interface BookmarkListState {
  bookmarks: any[];
  loading: boolean;
  error: string | null;
  page: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  total: number;
}

export const BookmarkList = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  
  const [state, setState] = useState<BookmarkListState>({
    bookmarks: [],
    loading: true,
    error: null,
    page: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    total: 0
  });

  const loadBookmarks = async (page: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await dataProvider.getList('bookmarks', {
        pagination: { page, perPage: 20 },
        sort: { field: 'createdAt', order: 'DESC' },
        filter: {}
      });
      
      setState(prev => ({
        ...prev,
        bookmarks: result.data,
        loading: false,
        page,
        hasNextPage: result.pageInfo?.hasNextPage || false,
        hasPreviousPage: result.pageInfo?.hasPreviousPage || false,
        total: result.total || result.data.length
      }));
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load bookmarks'
      }));
      notify('Failed to load bookmarks', { type: 'error' });
    }
  };

  useEffect(() => {
    loadBookmarks(1);
  }, [dataProvider]);

  const handlePageChange = (newPage: number) => {
    loadBookmarks(newPage);
  };

  const handleEdit = (id: string) => {
    navigate(`/bookmarks/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bookmark?')) return;
    
    try {
      await dataProvider.delete('bookmarks', { id, previousData: { id } });
      notify('Bookmark deleted', { type: 'success' });
      loadBookmarks(state.page);
    } catch (error) {
      notify('Failed to delete bookmark', { type: 'error' });
    }
  };

  if (state.loading && state.bookmarks.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="alert alert-error">
        <span>{state.error}</span>
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-base-content">Bookmarks</h1>
          <p className="text-sm text-base-content/70 mt-1">
            {state.total > 0 ? `${state.total} total bookmarks` : 'No bookmarks found'}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-outline btn-sm">
            Add filter
          </button>
          <button className="btn btn-primary btn-sm">
            Create
          </button>
          <button 
            onClick={() => navigate('/triage')}
            className="btn btn-secondary btn-sm"
          >
            <Speed className="w-4 h-4 mr-2" />
            Enter Triage Mode
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input 
            type="text" 
            placeholder="Search bookmarks..." 
            className="input input-bordered input-lg w-full pl-4 pr-4 shadow-sm focus:shadow-md transition-shadow"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full min-w-full hover:table-hover">
          <thead>
            <tr className="bg-base-200">
              <th className="w-16 py-3 px-3"></th>
              <th className="text-xs font-medium text-base-content/80 py-3 px-3 text-left uppercase tracking-wide">Title</th>
              <th className="w-48 text-xs font-medium text-base-content/80 py-3 px-3 text-left uppercase tracking-wide">Tags</th>
              <th className="w-32 text-xs font-medium text-base-content/80 py-3 px-3 text-left uppercase tracking-wide">Created</th>
              <th className="w-24 text-xs font-medium text-base-content/80 py-3 px-3 text-left uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.bookmarks.map((bookmark) => (
              <tr key={bookmark.id} className="hover">
                {/* Favicon */}
                <td className="py-5 px-3 align-top">
                  <div className="mt-1">
                    <Avatar 
                      src={bookmark.content?.favicon} 
                      sx={{ width: 24, height: 24 }}
                      className="rounded"
                    >
                      <Bookmark fontSize="small" />
                    </Avatar>
                  </div>
                </td>
                
                {/* Title */}
                <td className="py-5 px-3 align-top">
                  <div>
                    <div className="font-bold text-sm leading-5 text-base-content">
                      {bookmark.title || bookmark.content?.title || 'No title'}
                    </div>
                    <div className="text-xs text-base-content/60 mt-1 font-normal">
                      {extractDomain(bookmark.content?.url || '')}
                    </div>
                    {bookmark.content?.description && (
                      <div className="text-xs text-base-content/50 mt-1 line-clamp-2 leading-4 font-normal">
                        {bookmark.content.description}
                      </div>
                    )}
                  </div>
                </td>
                
                {/* Tags */}
                <td className="py-5 px-3 align-middle">
                  <div className="flex flex-wrap gap-1">
                    {(() => {
                      console.log('🏷️ BOOKMARK TAGS DEBUG:', {
                        bookmarkId: bookmark.id,
                        tags: bookmark.tags,
                        tagsType: typeof bookmark.tags,
                        tagsLength: bookmark.tags?.length,
                        firstTag: bookmark.tags?.[0],
                        firstTagType: typeof bookmark.tags?.[0]
                      });
                      
                      return bookmark.tags?.slice(0, 3).map((tag: any, index: number) => {
                        // Handle both object tags and string tags
                        const tagName = typeof tag === 'string' ? tag : (tag.name || tag);
                        const isAI = typeof tag === 'object' && tag.attachedBy === 'ai';
                        
                        console.log(`🏷️ TAG ${index}:`, {
                          tag,
                          tagName,
                          isAI,
                          classes: `badge badge-sm ${isAI ? 'badge-primary' : 'badge-outline'}`
                        });
                        
                        return (
                          <span
                            key={tag.id || `tag-${index}`}
                            className={`badge badge-sm ${
                              isAI ? 'badge-primary' : 'badge-outline'
                            }`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              backgroundColor: isAI ? '#570df8' : 'transparent',
                              color: isAI ? 'white' : '#d1d5db',
                              border: `1px solid ${isAI ? '#570df8' : '#6b7280'}`
                            }}
                          >
                            {tagName}
                          </span>
                        );
                      });
                    })()}
                    {bookmark.tags?.length > 3 && (
                      <span className="badge badge-xs badge-ghost">
                        +{bookmark.tags.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                
                {/* Created Date */}
                <td className="py-5 px-3 align-middle">
                  <div className="text-xs text-base-content/60 font-normal">
                    {new Date(bookmark.createdAt).toLocaleDateString()}
                  </div>
                </td>
                
                {/* Actions */}
                <td className="py-5 px-3 align-middle">
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleEdit(bookmark.id)}
                      className="btn btn-xs btn-outline hover:btn-primary"
                      title="Edit bookmark"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => handleDelete(bookmark.id)}
                      className="btn btn-xs btn-error btn-outline hover:btn-error"
                      title="Delete bookmark"
                    >
                      <Delete className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loading overlay for subsequent pages */}
      {state.loading && (
        <div className="flex justify-center py-4">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button 
          onClick={() => handlePageChange(state.page - 1)}
          disabled={!state.hasPreviousPage}
          className="btn btn-outline btn-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        
        <span className="text-sm text-base-content/70">
          Page {state.page}
        </span>
        
        <button 
          onClick={() => handlePageChange(state.page + 1)}
          disabled={!state.hasNextPage}
          className="btn btn-outline btn-sm"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};