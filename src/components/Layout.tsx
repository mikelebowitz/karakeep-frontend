import { type ReactNode } from "react";
import { useLogout, useGetIdentity } from "@refinedev/core";
import type { User } from "../types";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { mutate: logout } = useLogout();
  const { data: user } = useGetIdentity<User>();

  const handleLogout = () => {
    logout();
  };
  return (
    <div className="drawer lg:drawer-open" data-theme="dark">
      <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />
      
      {/* Main content */}
      <div className="drawer-content flex flex-col">
        {/* Header */}
        <header className="navbar bg-base-100 shadow-sm">
          <div className="flex-none">
            <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost btn-md lg:hidden">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
          </div>
          
          <div className="flex-1">
          </div>
          
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-md avatar">
                <div className="w-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li className="menu-title">
                  <span>{user?.name || 'User'}</span>
                </li>
                <li><a href="/profile">Profile</a></li>
                <li><a href="/settings">Settings</a></li>
                <li>
                  <button onClick={handleLogout} className="text-left w-full">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
      
      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="drawer-toggle" aria-label="close sidebar" className="drawer-overlay"></label>
        <aside className="min-h-full w-48 bg-base-200">
          <div className="p-4">
            <h1 className="text-xl font-bold mb-6">Karakeep</h1>
            <ul className="menu">
              <li>
                <a href="/bookmarks" className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Bookmarks
                </a>
              </li>
              <li>
                <a href="/bulk" className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Bulk
                </a>
              </li>
              <li>
                <a href="/triage" className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Triage
                </a>
              </li>
              <li>
                <a href="/lists" className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Lists
                </a>
              </li>
              <li>
                <a href="/tags" className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Tags
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};