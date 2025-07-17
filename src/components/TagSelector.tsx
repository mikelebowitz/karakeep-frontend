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

interface Tag {
  id: string;
  name: string;
  numBookmarks?: number;
  numBookmarksByAttachedType?: {
    ai: number;
    human: number;
  };
}

interface TagSelectorProps {
  source: string;
  label?: string;
}

export const TagSelector: React.FC<TagSelectorProps> = ({ 
  source, 
  label = "Tags" 
}) => {
  const record = useRecordContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load available tags on component mount
  useEffect(() => {
    const loadTags = async () => {
      setLoading(true);
      try {
        const response = await dataProvider.getList('tags', {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: 'name', order: 'ASC' },
          filter: {},
        });
        setAvailableTags(response.data);
      } catch (error) {
        console.error('Error loading tags:', error);
        notify('Error loading tags', { type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadTags();
  }, [dataProvider, notify]);

  // Set selected tags when record changes
  useEffect(() => {
    if (record && record[source]) {
      const recordTags = Array.isArray(record[source]) ? record[source] : [];
      setSelectedTags(recordTags);
    }
  }, [record, source]);

  const handleTagChange = async (newTags: Tag[]) => {
    if (!record?.id) return;
    
    setSaving(true);
    try {
      // Get current tag IDs
      const currentTagIds = selectedTags.map(tag => tag.id);
      const newTagIds = newTags.map(tag => tag.id);
      
      // Find tags to attach and detach
      const toAttach = newTagIds.filter(id => !currentTagIds.includes(id));
      const toDetach = currentTagIds.filter(id => !newTagIds.includes(id));
      
      // Attach new tags
      if (toAttach.length > 0) {
        // Use the custom attachment method from dataProvider
        await (dataProvider as any).attachTags(record.id, toAttach);
      }
      
      // Detach removed tags (if API supports it)
      if (toDetach.length > 0) {
        // Note: The API documentation doesn't show a detach endpoint
        // This would need to be implemented based on the actual API
        console.log('Tags to detach:', toDetach);
        // TODO: Implement detach functionality when API supports it
      }
      
      setSelectedTags(newTags);
      notify('Tags updated successfully');
      refresh();
    } catch (error) {
      console.error('Error updating tags:', error);
      notify('Error updating tags', { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <CircularProgress size={20} />
        <Typography>Loading tags...</Typography>
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
        options={availableTags}
        value={selectedTags}
        onChange={(_, newValue) => handleTagChange(newValue)}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        disabled={saving}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option.id}
              label={option.name}
              size="small"
              variant="outlined"
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Select tags..."
            variant="outlined"
            fullWidth
          />
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