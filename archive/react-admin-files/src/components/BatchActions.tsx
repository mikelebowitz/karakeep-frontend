import { 
  BulkDeleteButton, 
  Button, 
  useListContext, 
  useNotify, 
  useRefresh,
  useUnselectAll,
  useDataProvider
} from 'react-admin';
import { Archive, Unarchive, Label, FolderOutlined } from '@mui/icons-material';
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  TextField,
  Chip,
  Box,
} from '@mui/material';

export const BookmarkBulkActions = () => {
  const { selectedIds } = useListContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const unselectAll = useUnselectAll('bookmarks');
  const dataProvider = useDataProvider();
  
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [listDialogOpen, setListDialogOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedLists, setSelectedLists] = useState<string[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [lists, setLists] = useState<any[]>([]);

  const handleArchive = async (archive: boolean) => {
    try {
      await dataProvider.updateMany('bookmarks', {
        ids: selectedIds,
        data: { is_archived: archive }
      });
      notify(`Bookmarks ${archive ? 'archived' : 'unarchived'} successfully`);
      refresh();
      unselectAll();
    } catch (error) {
      notify('Error updating bookmarks', { type: 'error' });
    }
  };

  const loadTags = async () => {
    const { data } = await dataProvider.getList('tags', {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'name', order: 'ASC' },
      filter: {},
    });
    setTags(data);
  };

  const loadLists = async () => {
    const { data } = await dataProvider.getList('lists', {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'name', order: 'ASC' },
      filter: {},
    });
    setLists(data);
  };

  const handleAddTags = async () => {
    try {
      for (const bookmarkId of selectedIds) {
        await (dataProvider as any).attachTags(bookmarkId, selectedTags);
      }
      notify('Tags added successfully');
      refresh();
      unselectAll();
      setTagDialogOpen(false);
      setSelectedTags([]);
    } catch (error) {
      notify('Error adding tags', { type: 'error' });
    }
  };

  const handleAddLists = async () => {
    try {
      for (const bookmarkId of selectedIds) {
        await (dataProvider as any).attachLists(bookmarkId, selectedLists);
      }
      notify('Lists added successfully');
      refresh();
      unselectAll();
      setListDialogOpen(false);
      setSelectedLists([]);
    } catch (error) {
      notify('Error adding to lists', { type: 'error' });
    }
  };

  return (
    <>
      <Button
        onClick={() => handleArchive(true)}
        label="Archive"
        startIcon={<Archive />}
      />
      <Button
        onClick={() => handleArchive(false)}
        label="Unarchive"
        startIcon={<Unarchive />}
      />
      <Button
        onClick={() => {
          loadTags();
          setTagDialogOpen(true);
        }}
        label="Add Tags"
        startIcon={<Label />}
      />
      <Button
        onClick={() => {
          loadLists();
          setListDialogOpen(true);
        }}
        label="Add to Lists"
        startIcon={<FolderOutlined />}
      />
      <BulkDeleteButton />

      <Dialog open={tagDialogOpen} onClose={() => setTagDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Tags to Selected Bookmarks</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Autocomplete
              multiple
              options={tags}
              getOptionLabel={(option) => option.name}
              value={tags.filter(tag => selectedTags.includes(tag.id))}
              onChange={(_, newValue) => {
                setSelectedTags(newValue.map(v => v.id));
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    {...getTagProps({ index })}
                    style={{ backgroundColor: option.color }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Select tags" placeholder="Search tags" />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTagDialogOpen(false)} label="Cancel" />
          <Button onClick={handleAddTags} label="Add Tags" disabled={selectedTags.length === 0} />
        </DialogActions>
      </Dialog>

      <Dialog open={listDialogOpen} onClose={() => setListDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Selected Bookmarks to Lists</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Autocomplete
              multiple
              options={lists}
              getOptionLabel={(option) => option.name}
              value={lists.filter(list => selectedLists.includes(list.id))}
              onChange={(_, newValue) => {
                setSelectedLists(newValue.map(v => v.id));
              }}
              renderInput={(params) => (
                <TextField {...params} label="Select lists" placeholder="Search lists" />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setListDialogOpen(false)} label="Cancel" />
          <Button onClick={handleAddLists} label="Add to Lists" disabled={selectedLists.length === 0} />
        </DialogActions>
      </Dialog>
    </>
  );
};