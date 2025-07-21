import {
  Create,
  SimpleForm,
  TextInput,
  required,
  useNotify,
  useRedirect,
} from 'react-admin';
import { Box, Card, CardContent } from '@mui/material';
import { ChromePicker } from 'react-color';
import { useState } from 'react';

export const TagCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState('#4CAF50');

  const onSuccess = () => {
    notify('Tag created successfully');
    redirect('list', 'tags');
  };

  return (
    <Create mutationOptions={{ onSuccess }}>
      <SimpleForm>
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <TextInput source="name" validate={required()} fullWidth />
            
            <Box mt={2}>
              <TextInput
                source="color"
                fullWidth
                defaultValue={color}
                InputProps={{
                  endAdornment: (
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '4px',
                        backgroundColor: color,
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
                    color={color}
                    onChange={(newColor) => {
                      setColor(newColor.hex);
                      const input = document.querySelector('input[name="color"]') as HTMLInputElement;
                      if (input) {
                        input.value = newColor.hex;
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
    </Create>
  );
};