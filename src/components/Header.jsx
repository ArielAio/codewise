import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const menuRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-[#001a33] shadow-md relative z-10">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-[#00FA9A]">
          CodeWise
        </Link>
        <nav className="flex items-center space-x-6">
          <div 
            className="relative" 
            ref={menuRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className="text-[#00FA9A] hover:text-[#33FBB1] font-medium text-2xl"
              aria-label="Menu"
              onClick={handleClick}
            >
              ☰
            </button>
            {(isMenuOpen || isHovering) && (
              <div className="absolute right-0 mt-2 w-48 bg-[#002b4d] rounded-lg shadow-xl py-2 z-20">
                <Link href="/" className="block px-4 py-2 text-[#00FA9A] hover:bg-[#003a66] flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Início
                </Link>
                <Link href="/cursos" className="block px-4 py-2 text-[#00FA9A] hover:bg-[#003a66] flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Cursos
                </Link>
                <Link href="/criar-curso" className="block px-4 py-2 text-[#00FA9A] hover:bg-[#003a66] flex items-center">
                  <span className="font-bold text-xl mr-2">+</span>
                  Criar Curso
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
//tmj