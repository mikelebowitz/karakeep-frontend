import React, { useState, useEffect } from 'react';
import { 
  useRecordContext, 
  useDataProvider, 
  useNotify,
  useRefresh,
} from 'react-admin';
import { 
  Box, 
  Chip, 
  Autocomplete, 
  TextField, 
  Typography,
  CircularProgress 
} from '@mui/material';

interface List {
  id: string;
  name: string;
  description?: string;
  icon: string;
  parentId?: string;
  type: 'manual' | 'smart';
  query?: string;
  public?: boolean;
}

interface ListSelectorProps {
  source: string;
  label?: string;
}

export const ListSelector: React.FC<ListSelectorProps> = ({ 
  source, 
  label = "Lists" 
}) => {
  const record = useRecordContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  
  const [availableLists, setAvailableLists] = useState<List[]>([]);
  const [selectedLists, setSelectedLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load available lists on component mount
  useEffect(() => {
    const loadLists = async () => {
      setLoading(true);
      try {
        const response = await dataProvider.getList('lists', {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: 'name', order: 'ASC' },
          filter: {},
        });
        setAvailableLists(response.data);
      } catch (error) {
        console.error('Error loading lists:', error);
        notify('Error loading lists', { type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadLists();
  }, [dataProvider, notify]);

  // Set selected lists when record changes
  useEffect(() => {
    if (record && record[source]) {
      const recordLists = Array.isArray(record[source]) ? record[source] : [];
      setSelectedLists(recordLists);
    }
  }, [record, source]);

  const handleListChange = async (newLists: List[]) => {
    if (!record?.id) return;
    
    setSaving(true);
    try {
      // Get current list IDs
      const currentListIds = selectedLists.map(list => list.id);
      const newListIds = newLists.map(list => list.id);
      
      // Find lists to add and remove
      const toAdd = newListIds.filter(id => !currentListIds.includes(id));
      const toRemove = currentListIds.filter(id => !newListIds.includes(id));
      
      // Add bookmark to new lists
      for (const listId of toAdd) {
        try {
          // Use the custom attachment method from dataProvider
          await (dataProvider as any).attachLists(record.id, [listId]);
        } catch (error) {
          console.error(`Error adding bookmark to list ${listId}:`, error);
          notify(`Error adding bookmark to list`, { type: 'error' });
        }
      }
      
      // Remove bookmark from removed lists
      for (const listId of toRemove) {
        try {
          // Note: The API documentation doesn't show a remove endpoint
          // This would need to be implemented based on the actual API
          console.log('Remove bookmark from list:', listId);
          // TODO: Implement remove functionality when API supports it
        } catch (error) {
          console.error(`Error removing bookmark from list ${listId}:`, error);
          notify(`Error removing bookmark from list`, { type: 'error' });
        }
      }
      
      setSelectedLists(newLists);
      notify('Lists updated successfully');
      refresh();
    } catch (error) {
      console.error('Error updating lists:', error);
      notify('Error updating lists', { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <CircularProgress size={20} />
        <Typography>Loading lists...</Typography>
      </Box>
    );
  }

  return (
    <Box mt={2}>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>
      
      <Autocomplete
        multiple
        options={availableLists}
        value={selectedLists}
        onChange={(_, newValue) => handleListChange(newValue)}
        getOptionLabel={(option) => `${option.icon} ${option.name}`}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        disabled={saving}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option.id}
              label={`${option.icon} ${option.name}`}
              size="small"
              variant="outlined"
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Select lists..."
            variant="outlined"
            fullWidth
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <span style={{ marginRight: '8px' }}>{option.icon}</span>
            <Box>
              <Typography variant="body2">{option.name}</Typography>
              {option.description && (
                <Typography variant="caption" color="text.secondary">
                  {option.description}
                </Typography>
              )}
            </Box>
          </Box>
        )}
      />
      
      {saving && (
        <Box display="flex" alignItems="center" gap={1} mt={1}>
          <CircularProgress size={16} />
          <Typography variant="caption">Saving...</Typography>
        </Box>
      )}
    </Box>
  );
};