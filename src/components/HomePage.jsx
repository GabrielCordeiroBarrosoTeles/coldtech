import React, { useState } from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import ServicesSection from './ServicesSection';
import CTASection from './CTASection';
import Footer from './Footer';
import SchedulingModal from './SchedulingModal';

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="home-page">
      <Navbar />
      <HeroSection />
      <div style={{marginBottom: '-200px'}}>
        <ServicesSection />
      </div>
      <CTASection openModal={openModal} />
      <div style={{marginTop: '50px'}}>
        <Footer />
      </div>
      
      {isModalOpen && <SchedulingModal closeModal={closeModal} />}
    </div>
  );
}

export default HomePage;