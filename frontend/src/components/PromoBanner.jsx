import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { IoSparklesSharp } from 'react-icons/io5';
import { MdClose } from 'react-icons/md';

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div 
      style={{ 
        background: 'linear-gradient(90deg, #b30000 0%, #ff6600 50%, #b30000 100%)',
        color: '#ffffff',
        padding: '10px 0',
        fontSize: '14px',
        fontWeight: '700',
        letterSpacing: '1px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
        position: 'relative',
        zIndex: '1050',
        transition: 'all 0.3s ease'
      }}
      className="text-center d-flex align-items-center justify-content-center"
    >
      <Container className="d-flex align-items-center justify-content-center position-relative">
        <div className="d-flex align-items-center gap-2 text-uppercase">
          <IoSparklesSharp className="text-warning" size={18} style={{ animation: 'bounce 2s infinite' }} />
          <span>🪔 Shubh Deepavali Festive Bonanza! 🪔</span>
          <span className="bg-white text-danger px-2 py-0.5 rounded-3 ms-2 small fw-black">
            Flat 25% OFF
          </span>
          <span className="d-none d-md-inline ms-1 text-warning-light">
            — Use Code: <strong className="text-warning">Deepavali2026</strong>
          </span>
          <IoSparklesSharp className="text-warning" size={18} style={{ animation: 'bounce 2s infinite' }} />
        </div>

        {/* ❌ Dismiss Button to let users close the advertisement */}
        <button 
          onClick={() => setIsVisible(false)}
          style={{
            position: 'absolute',
            right: '10px',
            background: 'none',
            border: 'none',
            color: '#ffffff',
            opacity: '0.8',
            cursor: 'pointer',
            padding: '5px'
          }}
          className="d-flex align-items-center justify-content-center hover-opacity-100"
          title="Dismiss banner"
        >
          <MdClose size={18} />
        </button>
      </Container>
    </div>
  );
};

export default PromoBanner;