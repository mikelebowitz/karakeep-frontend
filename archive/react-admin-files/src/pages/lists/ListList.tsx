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
} from 'react-admin';
import { Avatar } from '@mui/material';
import { FolderOutlined } from '@mui/icons-material';

const ListFilters = [
  <TextInput source="q" label="Search" alwaysOn />,
];

const ListActions = () => (
  <TopToolbar>
    <CreateButton />
  </TopToolbar>
);

const ListBulkActions = () => (
  <>
    <BulkDeleteButton />
  </>
);

export const ListList = () => (
  <List
    filters={ListFilters}
    actions={<ListActions />}
    perPage={25}
  >
    <Datagrid bulkActionButtons={<ListBulkActions />}>
      <FunctionField
        label="Icon"
        render={(record: any) => (
          <Avatar sx={{ width: 32, height: 32 }}>
            {record.icon || <FolderOutlined />}
          </Avatar>
        )}
      />
      <TextField source="name" />
      <TextField source="description" />
      <TextField source="bookmark_count" label="Bookmarks" />
      <DateField source="created_at" showTime />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);