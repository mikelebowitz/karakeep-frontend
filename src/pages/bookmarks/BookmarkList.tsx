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
import { Card, CardContent, Box, Typography, Chip, Avatar, Button, Toolbar } from '@mui/material';
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
      <Card sx={{ marginTop: 1, marginBottom: 1 }}>
        <CardContent>
          <Typography>Loading bookmark details...</Typography>
        </CardContent>
      </Card>
    );
  }

  const title = record.title || record.content?.title || 'No title';
  const url = record.content?.url || 'No URL';
  const description = record.content?.description;
  
  return (
    <Card sx={{ marginTop: 1, marginBottom: 1 }}>
      <CardContent>
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Avatar src={record.content?.favicon} sx={{ width: 32, height: 32 }}>
            <Bookmark fontSize="small" />
          </Avatar>
          <Box flex={1}>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {url}
            </Typography>
            {description && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                {description}
              </Typography>
            )}
            {record.summary && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Summary:</strong> {record.summary}
              </Typography>
            )}
            {record.note && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Note:</strong> {record.note}
              </Typography>
            )}
            <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
              {record.tags?.map((tag: any) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  size="small"
                  color={tag.attachedBy === 'ai' ? 'primary' : 'default'}
                  variant={tag.attachedBy === 'ai' ? 'filled' : 'outlined'}
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
      </CardContent>
    </Card>
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
    <Toolbar sx={{ justifyContent: 'center', mt: 2 }}>
      {hasPreviousPage && (
        <Button 
          key="previous"
          onClick={() => handlePageChange(page - 1)}
          startIcon={<ChevronLeft />}
          variant="outlined"
          sx={{ mr: 1 }}
        >
          Previous
        </Button>
      )}
      {hasNextPage && (
        <Button 
          key="next"
          onClick={() => handlePageChange(page + 1)}
          endIcon={<ChevronRight />}
          variant="outlined"
          sx={{ ml: 1 }}
        >
          Next                    
        </Button>
      )}
    </Toolbar>
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
            <Typography variant="body2" noWrap>
              {record.title || record.content?.title || 'No title'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {record.content?.url}
            </Typography>
          </Box>
        )}
      />
      <FunctionField
        label="Tags"
        render={(record: any) => (
          <Box display="flex" gap={0.5} flexWrap="wrap">
            {record.tags?.slice(0, 3).map((tag: any) => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                color={tag.attachedBy === 'ai' ? 'primary' : 'default'}
              />
            ))}
            {record.tags?.length > 3 && (
              <Chip
                label={`+${record.tags.length - 3}`}
                size="small"
                variant="outlined"
              />
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