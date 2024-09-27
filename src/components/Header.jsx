import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          CodeWise
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="/" className="text-blue-800 hover:text-blue-600">
            Início
          </Link>
          <Link href="/cursos" className="text-blue-800 hover:text-blue-600">
            Cursos
          </Link>
          <Link href="/sobre" className="text-blue-800 hover:text-blue-600">
            Sobre
          </Link>
          <Link href="/contato" className="text-blue-800 hover:text-blue-600">
            Contato
          </Link>
        </nav>
        <button
          className="md:hidden text-blue-800 hover:text-blue-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden bg-white px-4 py-2 flex flex-col space-y-2">
          <Link href="/" className="text-blue-800 hover:text-blue-600">
            Início
          </Link>
          <Link href="/cursos" className="text-blue-800 hover:text-blue-600">
            Cursos
          </Link>
          <Link href="/sobre" className="text-blue-800 hover:text-blue-600">
            Sobre
          </Link>
          <Link href="/contato" className="text-blue-800 hover:text-blue-600">
            Contato
          </Link>
        </nav>
      )}
    </header>
  );
}
