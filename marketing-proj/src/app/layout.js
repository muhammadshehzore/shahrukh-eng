// src/app/layout.js (server component, no "use client")

import './globals.css';
import ClientLayoutWrapper from './ClientWrapper'; // we'll create this

export const metadata = {
  title: 'My App',
  description: 'Next.js + Django Chat',
};

// src/app/layout.js


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
1