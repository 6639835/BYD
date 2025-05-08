'use client';

import { useState, useEffect } from 'react';
import { scrollToSection } from '@/utils/helpers';

interface NavDot {
  id: string;
  dataLabel: string;
  targetSection: string;
}

const navDots: NavDot[] = [
  { id: 'nav-hero', dataLabel: '概览', targetSection: '#hero-section' },
  { id: 'nav-dashboard', dataLabel: '销量数据', targetSection: '#dashboard' },
  { id: 'nav-detail', dataLabel: '详细数据', targetSection: '#detail-section' },
  { id: 'nav-compare', dataLabel: '对比分析', targetSection: '#compare-section' },
];

export default function NavigationDots() {
  const [activeSection, setActiveSection] = useState('nav-hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      const sections = [
        { id: 'nav-hero', element: document.querySelector('#hero-section') },
        { id: 'nav-dashboard', element: document.querySelector('#dashboard') },
        { id: 'nav-detail', element: document.querySelector('#detail-section') },
        { id: 'nav-compare', element: document.querySelector('#compare-section') },
      ];
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && scrollPosition >= section.element.getBoundingClientRect().top + window.scrollY) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on mount
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className="floating-nav" aria-label="页面导航">
      {navDots.map((dot) => (
        <div
          key={dot.id}
          className={`nav-dot ${activeSection === dot.id ? 'active' : ''}`}
          id={dot.id}
          data-label={dot.dataLabel}
          onClick={() => scrollToSection(dot.targetSection)}
          role="button"
          aria-label={`跳转到${dot.dataLabel}部分`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              scrollToSection(dot.targetSection);
            }
          }}
        />
      ))}
    </nav>
  );
} 