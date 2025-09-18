// src/app/layout.js

import './globals.css';
import ClientLayoutWrapper from './ClientWrapper';

export const metadata = {
  title: 'My App',
  description: 'Next.js + Django Chat',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        <div id="mobile-menu-root"></div>
      </body>
    </html>
  );
}