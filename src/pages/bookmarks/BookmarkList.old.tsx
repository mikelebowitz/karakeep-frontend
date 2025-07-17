import { memo } from 'react';
import {
  List,
  Datagrid,
  DateField,
  EditButton,
  DeleteButton,
  TopToolbar,
  CreateButton,
  FilterButton,
  TextInput,
  BooleanInput,
  FunctionField,
  useRecordContext,
  useListContext,
} from 'react-admin';
import { Box, Avatar, Stack, Button, Chip } from '@mui/material';
import { Bookmark, Speed } from '@mui/icons-material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';

// Utility function to extract domain from URL
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

// Combined Actions component for Edit/Delete buttons (stacked vertically)
const ActionsColumn = () => (
  <Stack direction="column" spacing={0.1} justifyContent="center" alignItems="center">
    <EditButton 
      size="small" 
      sx={{ 
        minHeight: '20px', 
        padding: '2px 6px', 
        fontSize: '0.7rem',
      }} 
    />
    <DeleteButton 
      size="small" 
      sx={{ 
        minHeight: '20px', 
        padding: '2px 6px', 
        fontSize: '0.7rem',
      }} 
    />
  </Stack>
);

const BookmarkFilters = [
  <TextInput source="q" label="Search" alwaysOn />,
  <BooleanInput source="is_archived" label="Archived" />,
  <BooleanInput source="untagged" label="Untagged (Triage)" />,
];

const BookmarkActions = () => {
  const navigate = useNavigate();
  
  const handleTriageMode = () => {
    navigate('/triage');
  };
  
  return (
    <TopToolbar>
      <FilterButton />
      <CreateButton />
      <Button
        variant="contained"
        color="primary"
        startIcon={<Speed />}
        onClick={handleTriageMode}
        sx={{ ml: 1 }}
      >
        Enter Triage Mode
      </Button>
    </TopToolbar>
  );
};


const BookmarkPanel = memo(() => {
  const record = useRecordContext();
  
  if (!record) {
    return (
      <div className="card bg-base-100 shadow-lg my-2">
        <div className="card-body">
          <p>Loading bookmark details...</p>
        </div>
      </div>
    );
  }

  const title = record.title || record.content?.title || 'No title';
  const url = record.content?.url || 'No URL';
  const description = record.content?.description;
  
  return (
    <div className="card bg-base-100 shadow-lg my-2">
      <div className="card-body">
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Avatar src={record.content?.favicon} sx={{ width: 32, height: 32 }}>
            <Bookmark fontSize="small" />
          </Avatar>
          <Box flex={1}>
            <h3 className="card-title text-lg font-semibold mb-2">
              {title}
            </h3>
            <p className="text-sm text-base-content/70 mb-2">
              {url}
            </p>
            {description && (
              <p className="text-sm mb-2">
                {description}
              </p>
            )}
            {record.summary && (
              <p className="text-sm mb-2">
                <strong>Summary:</strong> {record.summary}
              </p>
            )}
            {record.note && (
              <p className="text-sm mb-2">
                <strong>Note:</strong> {record.note}
              </p>
            )}
            <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
              {record.tags?.map((tag: any) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  size="small"
                  variant={tag.attachedBy === 'ai' ? 'filled' : 'outlined'}
                  sx={{ 
                    backgroundColor: tag.attachedBy === 'ai' ? '#570df8' : 'transparent',
                    color: tag.attachedBy === 'ai' ? '#ffffff' : '#570df8',
                    borderColor: '#570df8',
                    borderRadius: '1rem',
                    fontWeight: tag.attachedBy === 'ai' ? 600 : 400,
                    '&:hover': {
                      backgroundColor: tag.attachedBy === 'ai' ? '#4c1d95' : 'rgba(87, 13, 248, 0.1)'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
          {record.content?.imageUrl && (
            <Box
              component="img"
              src={record.content.imageUrl}
              alt={title}
              onError={(e) => {
                // Hide image if it fails to load
                (e.target as HTMLElement).style.display = 'none';
              }}
              sx={{
                width: 120,
                height: 90,
                objectFit: 'cover',
                borderRadius: 1,
              }}
            />
          )}
        </Box>
      </div>
    </div>
  );
});

// Custom pagination component for cursor-based pagination
const CursorPagination = () => {
  // This component needs to be rendered inside the List component to access useListContext
  const listContext = useListContext();
  
  if (!listContext) {
    return null; // Not inside a List context
  }
  
  const { page, hasPreviousPage, hasNextPage, setPage, refetch } = listContext;
  
  if (!hasPreviousPage && !hasNextPage) return null;
  
  const handlePageChange = (newPage: number) => {
    console.log(`🔄 Changing from page ${page} to page ${newPage}`);
    
    // Update page first
    setPage(newPage);
    
    // Force data refresh using React-Admin's refetch function
    setTimeout(() => {
      refetch();
    }, 100);
  };
  
  return (
    <div className="flex justify-center mt-4">
      {hasPreviousPage && (
        <button 
          key="previous"
          onClick={() => handlePageChange(page - 1)}
          className="btn btn-outline btn-sm mr-2"
        >
          <ChevronLeft />
          Previous
        </button>
      )}
      {hasNextPage && (
        <button 
          key="next"
          onClick={() => handlePageChange(page + 1)}
          className="btn btn-outline btn-sm ml-2"
        >
          Next                    
          <ChevronRight />
        </button>
      )}
    </div>
  );
};

// Inner component that has access to ListContext
const BookmarkDatagrid = () => {
  const { page } = useListContext();
  
  return (
    <Datagrid
      key={`datagrid-page-${page}-${Date.now()}`} // Force re-render on page change
      expand={BookmarkPanel}
      rowClick="expand"
      bulkActionButtons={false} // Remove bulk actions to fix spacing
      sx={{
        width: '100%',
        tableLayout: 'auto', // Changed from 'fixed' to 'auto' for better flex behavior
        '& .RaDatagrid-tableWrapper': {
          overflowX: 'auto',
        },
        '& table': {
          width: '100%',
          minWidth: '600px', // Ensure minimum usable width
        },
        // React-Admin responsive column hiding using auto-generated column classes
        '& .column-tags': {
          display: { xs: 'none', md: 'table-cell' },
        },
        '& .column-createdAt': {
          display: { xs: 'none', sm: 'table-cell' },
        },
      }}
    >
      <FunctionField
        label="Favicon"
        sx={{
          width: '8%',
          minWidth: '50px',
          maxWidth: '60px',
          padding: '8px 4px',
        }}
        render={(record: any) => (
          <Avatar src={record.content?.favicon} sx={{ width: 24, height: 24 }}>
            <Bookmark fontSize="small" />
          </Avatar>
        )}
      />
      <FunctionField
        label="Title"
        sx={{
          width: '50%', // Use percentage for flexible width
          minWidth: '200px',
          padding: '8px 12px',
          '& .MuiTableCell-root': {
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflow: 'hidden',
          },
        }}
        render={(record: any) => (
          <Box>
            <p style={{ 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              margin: 0, 
              lineHeight: '1.4',
              color: '#111827'
            }}>
              {record.title || record.content?.title || 'No title'}
            </p>
            <p style={{ 
              fontSize: '0.75rem', 
              margin: 0, 
              marginTop: '2px',
              lineHeight: '1.3',
              color: '#6b7280',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}>
              {extractDomain(record.content?.url || '')}
            </p>
          </Box>
        )}
      />
      <FunctionField
        label="Tags"
        source="tags"
        sx={{
          width: '20%',
          minWidth: '100px',
          maxWidth: '180px',
          padding: '8px 12px',
        }}
        render={(record: any) => (
          <Box display="flex" gap={0.5} flexWrap="wrap">
            {record.tags?.slice(0, 2).map((tag: any) => (
              <span
                key={tag.id}
                className={`badge badge-xs ${
                  tag.attachedBy === 'ai' ? 'badge-primary' : 'badge-outline'
                }`}
                style={{ fontSize: '0.7rem' }}
              >
                {tag.name}
              </span>
            ))}
            {record.tags?.length > 2 && (
              <span className="badge badge-xs badge-outline" style={{ fontSize: '0.7rem' }}>
                +{record.tags.length - 2}
              </span>
            )}
          </Box>
        )}
      />
      <DateField 
        source="createdAt" 
        showTime 
        sx={{
          width: '12%',
          minWidth: '100px',
          maxWidth: '120px',
          padding: '8px 8px',
          fontSize: '0.75rem',
        }}
      />
      <FunctionField
        label="Actions"
        render={() => <ActionsColumn />}
        sx={{
          width: '80px',
          minWidth: '80px',
          maxWidth: '80px',
          padding: '4px',
        }}
      />
    </Datagrid>
  );
};

export const BookmarkList = () => {
  return (
    <List
      filters={BookmarkFilters}
      actions={<BookmarkActions />}
      perPage={10}
      pagination={<CursorPagination />}
      disableSyncWithLocation={false}
      exporter={false}
      queryOptions={{ 
        staleTime: 0,                    // Always consider data stale
        gcTime: 1000,                    // Keep in cache briefly (1 second)
        refetchOnWindowFocus: false,     // Don't refetch on window focus
        retry: false                     // Don't retry failed requests
      }}
    >
      <BookmarkDatagrid />
    </List>
  );
};