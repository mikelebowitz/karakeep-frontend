import React from 'react';
import { Admin, Resource, Layout, LayoutProps } from 'react-admin';
import { BookmarkBorder, Label, FolderOutlined } from '@mui/icons-material';
import { dataProvider } from './providers/dataProvider';
import { authProvider } from './providers/authProvider';
import { LoginPage } from './pages/Login';
import { BookmarkList, BookmarkEdit, BookmarkCreate } from './pages/bookmarks';
import { TagList, TagEdit, TagCreate } from './pages/tags';
import { ListList, ListEdit, ListCreate } from './pages/lists';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';

const MyLayout = (props: LayoutProps) => (
  <React.Fragment>
    <KeyboardShortcuts />
    <Layout {...props} />
  </React.Fragment>
);

function App() {
  console.log('App component rendering...');
  console.log('Environment variables:', {
    API_URL: import.meta.env.VITE_API_URL,
    API_TOKEN: import.meta.env.VITE_API_TOKEN ? 'Present' : 'Missing'
  });

  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={LoginPage}
      requireAuth
      layout={MyLayout}
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