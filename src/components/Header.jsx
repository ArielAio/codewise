import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/router";
import { FaHome, FaBook, FaPlus, FaComments, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaChartBar } from "react-icons/fa";

export default function Header() {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  const handleClick = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Evitar renderizar o Header se a rota for /login ou /register
  if (router.pathname === "/login" || router.pathname === "/register") {
    return null;
  }

  const showMenu = isMenuOpen || isHovering;

  return (
    <header className="bg-[#001a33] shadow-md relative z-10">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-[#00FA9A]">
          <div className="flex items-center space-x-2">
            <img
              src="/icon-logo.png"
              alt="CodeWise Icon Logo"
              className="h-10 w-auto"
            />
            <img
              src="/name-logo.png"
              alt="CodeWise Name Logo"
              className="h-10 w-auto"
            />
          </div>
        </Link>
        <nav className="flex items-center space-x-6">
          <div
            className="relative"
            ref={menuRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`text-[#00FA9A] hover:text-[#33FBB1] font-medium text-2xl transition-transform duration-200 ${
                isMenuOpen ? "scale-110" : "scale-100"
              }`}
              aria-label="Menu"
              onClick={handleClick}
            >
              ☰
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#002b4d] rounded-lg shadow-xl py-2 z-20">
                {user ? (
                  <>
                    <Link
                      href="/"
                      className="block px-4 py-2 text-[#00FA9A] hover:bg-[#003a66] flex items-center transition-transform duration-200 transform"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaHome className="mr-2" /> Início
                    </Link>
                    <Link
                      href="/courses"
                      className="block px-4 py-2 text-[#00FA9A] hover:bg-[#003a66] flex items-center transition-transform duration-200 transform"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaBook className="mr-2" /> Cursos
                    </Link>
                    {user?.permission === "admin" && (
                      <>
                        <Link
                          href="/create-course"
                          className="block px-4 py-2 text-[#00FA9A] hover:bg-[#003a66] flex items-center transition-transform duration-200 transform"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FaPlus className="mr-2" /> Criar Curso
                        </Link>
                        <Link
                          href="/admin/feedback"
                          className="block px-4 py-2 text-[#00FA9A] hover:bg-[#003a66] flex items-center transition-transform duration-200 transform"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FaComments className="mr-2" /> Feedbacks
                        </Link>
                        <Link
                          href="/admin/monitoring"
                          className="block px-4 py-2 text-[#00FA9A] hover:bg-[#003a66] flex items-center transition-transform duration-200 transform"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FaChartBar className="mr-2" /> Monitoramento
                        </Link>
                      </>
                    )}
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="block px-4 py-2 text-red-500 hover:bg-[#003a66] flex items-center transition-transform duration-200 transform"
                    >
                      <FaSignOutAlt className="mr-2" /> Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-[#00FA9A] hover:bg-[#003a66] flex items-center transition-transform duration-200 transform"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaSignInAlt className="mr-2" /> Entrar
                    </Link>
                    <Link
                      href="/register"
                      className="block px-4 py-2 text-[#00FA9A] hover:bg-[#003a66] flex items-center transition-transform duration-200 transform"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaUserPlus className="mr-2" /> Cadastrar
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}