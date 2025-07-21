import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  useNotify,
  useRefresh,
  useRedirect,
  Toolbar,
  SaveButton,
  DeleteButton,
} from 'react-admin';
import { Box, Card, CardContent } from '@mui/material';
import { TagSelector } from '../../components/TagSelector';
import { ListSelector } from '../../components/ListSelector';

const BookmarkEditToolbar = () => (
  <Toolbar>
    <SaveButton />
    <DeleteButton />
  </Toolbar>
);


export const BookmarkEdit = () => {
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();

  const onSuccess = () => {
    notify('Bookmark updated successfully');
    redirect('list', 'bookmarks');
    refresh();
  };

  return (
    <Edit mutationOptions={{ onSuccess }} title="Edit Bookmark">
      <SimpleForm toolbar={<BookmarkEditToolbar />}>
        <Card sx={{ width: '100%' }}>
          <CardContent>
            {/* Basic bookmark fields - using correct nested structure from API */}
            <TextInput source="content.url" label="URL" fullWidth />
            <TextInput source="content.title" label="Title" fullWidth />
            <TextInput source="content.description" label="Description" multiline rows={3} fullWidth />
            <TextInput source="note" label="Note" multiline rows={2} fullWidth />
            <TextInput source="summary" label="Summary" multiline rows={2} fullWidth />
            
            {/* Boolean fields - on same line */}
            <Box mt={2} display="flex" gap={3}>
              <BooleanInput source="archived" label="Archived" />
              <BooleanInput source="favourited" label="Favourited" />
            </Box>
            
            {/* Tags and Lists - using custom components */}
            <TagSelector source="tags" label="Tags" />
            <ListSelector source="lists" label="Lists" />
          </CardContent>
        </Card>
      </SimpleForm>
    </Edit>
  );
};