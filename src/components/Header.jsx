import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-[#001a33] shadow-md relative z-10">
      <div classNacme="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-[#00FA9A]">
          CodeWise
        </Link>
        <nav className="hidden md:flex space-x-4 items-center">
          <Link href="/" className="text-[#00FA9A] hover:text-[#33FBB1] font-medium" onClick={handleLinkClick}>
            Início
          </Link>
          <Link href="/cursos" className="text-[#00FA9A] hover:text-[#33FBB1] font-medium" onClick={handleLinkClick}>
            Cursos
          </Link>
          <Link href="/criar-curso" className="bg-[#00FA9A] text-[#001a33] px-4 py-2 rounded hover:bg-[#33FBB1] font-medium">
            Criar Curso
          </Link>
        </nav>
        <button
          className="md:hidden text-[#00FA9A] hover:text-[#33FBB1]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {isMenuOpen &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <nav ref={menuRef} className="absolute top-16 right-4 bg-[#001a33] shadow-lg rounded-md px-6 py-4 flex flex-col space-y-4 items-center">
              <Link href="/" className="text-[#00FA9A] hover:text-[#33FBB1] font-medium" onClick={handleLinkClick}>

                Início
              </Link>
              <Link href="/cursos" className="text-[#00FA9A] hover:text-[#33FBB1] font-medium" onClick={handleLinkClick}>
                Cursos
              </Link>
              <Link href="/criar-curso" className="bg-[#00FA9A] text-[#001a33] px-4 py-2 rounded hover:bg-[#33FBB1] font-medium">
                Criar Curso
              </Link>
            </nav>
          </div>,
          document.body
        )}
    </header>
  );
}
