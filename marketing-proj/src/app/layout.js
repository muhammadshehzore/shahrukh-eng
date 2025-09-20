// src/app/layout.js
import './globals.css';
import ClientLayoutWrapper from './ClientWrapper';
import SEOHead from '@/components/SEOHead';

export default function RootLayout({ children, seo }) {
  // Default SEO values
  const defaultSEO = {
    title: "MSHAHRUKH",
    description: "Premium industrial engineering solutions in Pakistan",
    image: "/default-image.png",
  };

  const seoProps = { ...defaultSEO, ...seo };

  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <SEOHead {...seoProps} />
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        <div id="mobile-menu-root"></div>
      </body>
    </html>
  );
}
