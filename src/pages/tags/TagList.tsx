import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  DeleteButton,
  BulkDeleteButton,
  TopToolbar,
  CreateButton,
  TextInput,
  FunctionField,
  useRecordContext,
} from 'react-admin';
import { Chip, Box } from '@mui/material';

const TagFilters = [
  <TextInput source="q" label="Search" alwaysOn />,
];

const TagActions = () => (
  <TopToolbar>
    <CreateButton />
  </TopToolbar>
);

const TagBulkActions = () => (
  <>
    <BulkDeleteButton />
  </>
);

const ColorField = ({ source }: { source: string }) => {
  const record = useRecordContext();
  const color = record?.[source];
  
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: color || '#ccc',
          border: '1px solid #ddd',
        }}
      />
      <span>{color || 'No color'}</span>
    </Box>
  );
};

export const TagList = () => (
  <List
    filters={TagFilters}
    actions={<TagActions />}
    perPage={25}
  >
    <Datagrid bulkActionButtons={<TagBulkActions />}>
      <TextField source="name" />
      <ColorField source="color" />
      <FunctionField
        label="Preview"
        render={(record: any) => (
          <Chip
            label={record.name}
            size="small"
            style={{ backgroundColor: record.color }}
          />
        )}
      />
      <TextField source="bookmark_count" label="Bookmarks" />
      <DateField source="created_at" showTime />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);