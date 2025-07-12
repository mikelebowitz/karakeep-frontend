import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  required,
  useNotify,
  useRefresh,
  useRedirect,
  Toolbar,
  SaveButton,
  DeleteButton,
} from 'react-admin';
import { Box, Card, CardContent } from '@mui/material';

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
    <Edit mutationOptions={{ onSuccess }}>
      <SimpleForm toolbar={<BookmarkEditToolbar />}>
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <TextInput source="url" validate={required()} fullWidth />
            <TextInput source="title" validate={required()} fullWidth />
            <TextInput source="description" multiline rows={3} fullWidth />
            
            <Box mt={2}>
              <ReferenceArrayInput source="tags" reference="tags">
                <AutocompleteArrayInput
                  optionText="name"
                  fullWidth
                />
              </ReferenceArrayInput>
            </Box>

            <Box mt={2}>
              <ReferenceArrayInput source="lists" reference="lists">
                <AutocompleteArrayInput
                  optionText="name"
                  fullWidth
                />
              </ReferenceArrayInput>
            </Box>

            <Box mt={2}>
              <BooleanInput source="is_archived" />
            </Box>
          </CardContent>
        </Card>
      </SimpleForm>
    </Edit>
  );
};