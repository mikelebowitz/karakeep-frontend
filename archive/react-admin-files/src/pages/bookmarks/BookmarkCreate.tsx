import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  required,
  useNotify,
  useRedirect,
} from 'react-admin';
import { Box, Card, CardContent } from '@mui/material';

export const BookmarkCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = () => {
    notify('Bookmark created successfully');
    redirect('list', 'bookmarks');
  };

  return (
    <Create mutationOptions={{ onSuccess }}>
      <SimpleForm>
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
              <BooleanInput source="is_archived" defaultValue={false} />
            </Box>
          </CardContent>
        </Card>
      </SimpleForm>
    </Create>
  );
};