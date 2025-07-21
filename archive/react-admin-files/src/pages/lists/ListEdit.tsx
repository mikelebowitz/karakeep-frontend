import {
  Edit,
  SimpleForm,
  TextInput,
  required,
  useNotify,
  useRefresh,
  useRedirect,
  Toolbar,
  SaveButton,
  DeleteButton,
} from 'react-admin';
import { Card, CardContent } from '@mui/material';

const ListEditToolbar = () => (
  <Toolbar>
    <SaveButton />
    <DeleteButton />
  </Toolbar>
);

export const ListEdit = () => {
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();

  const onSuccess = () => {
    notify('List updated successfully');
    redirect('list', 'lists');
    refresh();
  };

  return (
    <Edit mutationOptions={{ onSuccess }}>
      <SimpleForm toolbar={<ListEditToolbar />}>
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <TextInput source="name" validate={required()} fullWidth />
            <TextInput source="description" multiline rows={3} fullWidth />
            <TextInput source="icon" fullWidth helperText="Enter an emoji or leave empty" />
          </CardContent>
        </Card>
      </SimpleForm>
    </Edit>
  );
};