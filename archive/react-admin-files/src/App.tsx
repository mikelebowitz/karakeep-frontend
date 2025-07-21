import { Admin, Resource, Layout, CustomRoutes } from 'react-admin';
import type { LayoutProps } from 'react-admin';
import { Route } from 'react-router-dom';
import { BookmarkBorder } from '@mui/icons-material';
import daisyuiTheme from './theme/daisyuiTheme';
import { dataProvider } from './providers/dataProvider';
import { authProvider } from './providers/authProvider';
import { LoginPage } from './pages/Login';
import { BookmarkList, BookmarkEdit, BookmarkCreate } from './pages/bookmarks';
import { TriageMode } from './pages/triage';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';

const MyLayout = (props: LayoutProps) => {
  return (
    <>
      <KeyboardShortcuts />
      <Layout {...props} sidebar={() => null} />
    </>
  );
};

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
      theme={daisyuiTheme}
    >
      <Resource
        name="bookmarks"
        list={BookmarkList}
        edit={BookmarkEdit}
        create={BookmarkCreate}
        icon={BookmarkBorder}
      />
      {/* Temporarily disabled while focusing on bookmarks display */}
      {/* <Resource
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
      /> */}
      
      <CustomRoutes>
        <Route path="/triage" element={<TriageMode />} />
      </CustomRoutes>
    </Admin>
  );
}

export default App;