// app/page.jsx
import HeroSlider from '@/components/HeroSlider';
import ServicesSection from '@/components/ServicesSection';
import AboutMSEW from '@/components/AboutMSEW';
import ContactInfo from '@/components/ContactInfo';
import CallToActionSection from '@/components/CallToActionSection';
import PartnersSection from '@/components/PartnersSection';
import Products from '@/components/Products';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSlider />

      {/* Services Section */}
      <ServicesSection />

      {/* Projects Gallery */}
      <Products />

  

      {/* About MSEW / Company Story */}
      <AboutMSEW />



      {/* Trusted Partners / Brands */}
      <PartnersSection />

      {/* Contact Info / Mini Contact Form */}
      <ContactInfo />

      {/* Call-to-Action */}
      <CallToActionSection />
    </>
  );
}
