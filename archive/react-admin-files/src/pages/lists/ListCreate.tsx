import {
  Create,
  SimpleForm,
  TextInput,
  required,
  useNotify,
  useRedirect,
} from 'react-admin';
import { Card, CardContent } from '@mui/material';

export const ListCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = () => {
    notify('List created successfully');
    redirect('list', 'lists');
  };

  return (
    <Create mutationOptions={{ onSuccess }}>
      <SimpleForm>
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <TextInput source="name" validate={required()} fullWidth />
            <TextInput source="description" multiline rows={3} fullWidth />
            <TextInput source="icon" fullWidth helperText="Enter an emoji or leave empty" />
          </CardContent>
        </Card>
      </SimpleForm>
    </Create>
  );
};