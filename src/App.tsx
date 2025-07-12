import { Admin, Resource } from 'react-admin';
import { BookmarkBorder, Label, FolderOutlined } from '@mui/icons-material';
import { dataProvider } from './providers/dataProvider';
import { authProvider } from './providers/authProvider';
import { LoginPage } from './pages/Login';
import { BookmarkList, BookmarkEdit, BookmarkCreate } from './pages/bookmarks';
import { TagList, TagEdit, TagCreate } from './pages/tags';
import { ListList, ListEdit, ListCreate } from './pages/lists';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';

function App() {
  return (
    <>
      <KeyboardShortcuts />
      <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        loginPage={LoginPage}
        requireAuth
      >
      <Resource
        name="bookmarks"
        list={BookmarkList}
        edit={BookmarkEdit}
        create={BookmarkCreate}
        icon={BookmarkBorder}
      />
      <Resource
        name="tags"
        list={TagList}
        edit={TagEdit}
        create={TagCreate}
        icon={Label}
      />
      <Resource
        name="lists"
        list={ListList}
        edit={ListEdit}
        create={ListCreate}
        icon={FolderOutlined}
      />
      </Admin>
    </>
  );
}

export default App;