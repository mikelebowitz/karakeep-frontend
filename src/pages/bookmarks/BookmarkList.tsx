import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  DateField,
  EditButton,
  DeleteButton,
  TopToolbar,
  CreateButton,
  FilterButton,
  TextInput,
  BooleanInput,
  FunctionField,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
} from 'react-admin';
import { Card, CardContent, Box, Typography, Chip, Avatar } from '@mui/material';
import { Bookmark } from '@mui/icons-material';
import { BookmarkBulkActions } from '../../components/BatchActions';

const BookmarkFilters = [
  <TextInput source="q" label="Search" alwaysOn />,
  <BooleanInput source="is_archived" label="Archived" />,
];

const BookmarkActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
  </TopToolbar>
);


const BookmarkPanel = ({ record }: { record?: any }) => (
  <Card sx={{ marginTop: 1, marginBottom: 1 }}>
    <CardContent>
      <Box display="flex" alignItems="flex-start" gap={2}>
        <Avatar src={record?.favicon} sx={{ width: 24, height: 24 }}>
          <Bookmark fontSize="small" />
        </Avatar>
        <Box flex={1}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {record?.url}
          </Typography>
          {record?.description && (
            <Typography variant="body2" paragraph>
              {record.description}
            </Typography>
          )}
          <Box display="flex" gap={1} flexWrap="wrap">
            <ReferenceArrayField
              source="tags"
              reference="tags"
              record={record}
            >
              <SingleFieldList>
                <ChipField source="name" size="small" />
              </SingleFieldList>
            </ReferenceArrayField>
          </Box>
        </Box>
        {record?.screenshot && (
          <Box
            component="img"
            src={record.screenshot}
            alt={record.title}
            sx={{
              width: 120,
              height: 90,
              objectFit: 'cover',
              borderRadius: 1,
            }}
          />
        )}
      </Box>
    </CardContent>
  </Card>
);

export const BookmarkList = () => (
  <List
    filters={BookmarkFilters}
    actions={<BookmarkActions />}
    perPage={25}
  >
    <Datagrid
      expand={BookmarkPanel}
      rowClick="expand"
      bulkActionButtons={<BookmarkBulkActions />}
    >
      <FunctionField
        label="Favicon"
        render={(record: any) => (
          <Avatar src={record.favicon} sx={{ width: 24, height: 24 }}>
            <Bookmark fontSize="small" />
          </Avatar>
        )}
      />
      <TextField source="title" />
      <FunctionField
        label="Tags"
        render={(record: any) => (
          <Box display="flex" gap={0.5} flexWrap="wrap">
            {record.tags?.slice(0, 3).map((tag: any) => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                style={{ backgroundColor: tag.color }}
              />
            ))}
            {record.tags?.length > 3 && (
              <Chip
                label={`+${record.tags.length - 3}`}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        )}
      />
      <BooleanField source="is_archived" />
      <DateField source="created_at" showTime />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);