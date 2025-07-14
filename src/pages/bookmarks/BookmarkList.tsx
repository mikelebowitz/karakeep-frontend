import { memo } from 'react';
import {
  List,
  Datagrid,
  BooleanField,
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
import { Box, Avatar } from '@mui/material';
import { Bookmark } from '@mui/icons-material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { BookmarkBulkActions } from '../../components/BatchActions';

const BookmarkFilters = [
  <TextInput source="q" label="Search" alwaysOn />,
  <BooleanInput source="is_archived" label="Archived" />,
  <BooleanInput source="untagged" label="Untagged (Triage)" />,
];

const BookmarkActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
  </TopToolbar>
);


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
      bulkActionButtons={<BookmarkBulkActions />}
    >
      <FunctionField
        label="Favicon"
        render={(record: any) => (
          <Avatar src={record.content?.favicon} sx={{ width: 24, height: 24 }}>
            <Bookmark fontSize="small" />
          </Avatar>
        )}
      />
      <FunctionField
        label="Title"
        render={(record: any) => (
          <Box>
            <p className="text-sm font-medium truncate">
              {record.title || record.content?.title || 'No title'}
            </p>
            <p className="text-xs text-base-content/70 truncate">
              {record.content?.url}
            </p>
          </Box>
        )}
      />
      <FunctionField
        label="Tags"
        render={(record: any) => (
          <Box display="flex" gap={0.5} flexWrap="wrap">
            {record.tags?.slice(0, 3).map((tag: any) => (
              <span
                key={tag.id}
                className={`badge badge-xs ${
                  tag.attachedBy === 'ai' ? 'badge-primary' : 'badge-outline'
                }`}
              >
                {tag.name}
              </span>
            ))}
            {record.tags?.length > 3 && (
              <span className="badge badge-xs badge-outline">
                +{record.tags.length - 3}
              </span>
            )}
          </Box>
        )}
      />
      <BooleanField source="archived" />
      <DateField source="createdAt" showTime />
      <EditButton />
      <DeleteButton />
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