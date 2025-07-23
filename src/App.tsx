import { Refine, Authenticated } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerBindings, {
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router-v6";
import { karakeepDataProvider } from "./providers/dataProvider";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import { authProvider } from "./providers/authProvider";
import { Layout } from "./components/Layout";
import { BookmarkList } from "./pages/bookmarks/list";
import { BookmarkShow } from "./pages/bookmarks/show";
import { BookmarkEdit } from "./pages/bookmarks/edit";
import { BookmarkCreate } from "./pages/bookmarks/create";
import { Login } from "./pages/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <Refine
          routerProvider={routerBindings}
          dataProvider={karakeepDataProvider(API_URL)}
          authProvider={authProvider}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
          }}
          resources={[
            {
              name: "bookmarks",
              list: "/bookmarks",
              show: "/bookmarks/show/:id",
              edit: "/bookmarks/edit/:id",
              create: "/bookmarks/create",
              meta: {
                canDelete: true,
              },
            },
          ]}
        >
          <Routes>
            {/* Login Route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route
              element={
                <Authenticated key="authenticated-layout" fallback={<Login />}>
                  <Layout>
                    <Outlet />
                  </Layout>
                </Authenticated>
              }
            >
              <Route index element={<NavigateToResource resource="bookmarks" />} />
              <Route path="/bookmarks" element={<BookmarkList />} />
              <Route path="/bookmarks/show/:id" element={<BookmarkShow />} />
              <Route path="/bookmarks/edit/:id" element={<BookmarkEdit />} />
              <Route path="/bookmarks/create" element={<BookmarkCreate />} />
            </Route>
            
            {/* Catch all - redirect to bookmarks */}
            <Route path="*" element={<NavigateToResource resource="bookmarks" />} />
          </Routes>
          <RefineKbar />
          <UnsavedChangesNotifier />
          <DocumentTitleHandler />
        </Refine>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;