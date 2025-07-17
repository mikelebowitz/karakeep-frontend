import type { ReactNode } from 'react';
import { KeyboardShortcuts } from './KeyboardShortcuts';

export const AdminWithKeyboardShortcuts = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <KeyboardShortcuts />
      {children}
    </>
  );
};