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
import { Box, Card, CardContent } from '@mui/material';
import { ChromePicker } from 'react-color';
import { useState } from 'react';

const TagEditToolbar = () => (
  <Toolbar>
    <SaveButton />
    <DeleteButton />
  </Toolbar>
);

export const TagEdit = () => {
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();
  const [showColorPicker, setShowColorPicker] = useState(false);

  const onSuccess = () => {
    notify('Tag updated successfully');
    redirect('list', 'tags');
    refresh();
  };

  return (
    <Edit mutationOptions={{ onSuccess }}>
      <SimpleForm toolbar={<TagEditToolbar />}>
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <TextInput source="name" validate={required()} fullWidth />
            
            <Box mt={2}>
              <TextInput
                source="color"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '4px',
                        backgroundColor: 'currentColor',
                        cursor: 'pointer',
                        border: '1px solid #ddd',
                      }}
                      onClick={() => setShowColorPicker(!showColorPicker)}
                    />
                  ),
                }}
              />
              
              {showColorPicker && (
                <Box sx={{ position: 'absolute', zIndex: 2, mt: 1 }}>
                  <Box
                    sx={{
                      position: 'fixed',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                    }}
                    onClick={() => setShowColorPicker(false)}
                  />
                  <ChromePicker
                    color={'#000'}
                    onChange={(color) => {
                      const input = document.querySelector('input[name="color"]') as HTMLInputElement;
                      if (input) {
                        input.value = color.hex;
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                      }
                    }}
                  />
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </SimpleForm>
    </Edit>
  );
};