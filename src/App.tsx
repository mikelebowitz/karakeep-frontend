import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import { Layout } from "./components/Layout";
import { BookmarkList } from "./pages/bookmarks/list";
import { BookmarkShow } from "./pages/bookmarks/show";
import { BookmarkEdit } from "./pages/bookmarks/edit";
import { BookmarkCreate } from "./pages/bookmarks/create";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <Refine
          routerProvider={routerProvider}
          dataProvider={dataProvider(API_URL)}
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
            <Route
              element={
                <Layout>
                  <Outlet />
                </Layout>
              }
            >
              <Route path="/bookmarks" element={<BookmarkList />} />
              <Route path="/bookmarks/show/:id" element={<BookmarkShow />} />
              <Route path="/bookmarks/edit/:id" element={<BookmarkEdit />} />
              <Route path="/bookmarks/create" element={<BookmarkCreate />} />
            </Route>
          </Routes>
          <RefineKbar />
        </Refine>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;