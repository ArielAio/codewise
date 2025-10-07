import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/router";
import { FaHome, FaBook, FaPlus, FaComments, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaChartBar, FaBars } from "react-icons/fa";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export default function Header() {
  const { user, signOut } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsSheetOpen(false);
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Evitar renderizar o Header se a rota for /login ou /register
  if (router.pathname === "/login" || router.pathname === "/register") {
    return null;
  }

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const navigationItems = [
    { href: "/", icon: FaHome, label: "Início" },
    { href: "/courses", icon: FaBook, label: "Cursos" },
  ];

  const adminItems = [
    { href: "/create-course", icon: FaPlus, label: "Criar Curso" },
    { href: "/admin/feedback", icon: FaComments, label: "Feedbacks" },
    { href: "/admin/monitoring", icon: FaChartBar, label: "Monitoramento" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-[#00FA9A]/20 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <img
            src="/icon-logo.png"
            alt="CodeWise Icon"
            className="h-8 w-auto"
          />
          <img
            src="/name-logo.png"
            alt="CodeWise"
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-readable hover:text-[#00FA9A] transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
          
          {user?.permission === "admin" && (
            <>
              {adminItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-readable hover:text-[#00FA9A] transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* User Menu & Mobile Menu */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Desktop User Menu */}
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-[#001a2c] text-[#00FA9A]">
                          {getUserInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-slate-800">{user.name}</p>
                        <p className="text-xs leading-none text-slate-600">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                      <FaSignOutAlt className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Sheet Menu */}
              <div className="md:hidden">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-[#00FA9A]/10 hover:text-[#00FA9A] text-slate-700">
                      <FaBars className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white">
                    <SheetHeader>
                      <SheetTitle className="text-slate-900">Menu</SheetTitle>
                      <SheetDescription className="text-slate-600">
                        Navegue pela plataforma CodeWise
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                      {/* User Info */}
                      <div className="flex items-center space-x-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-[#001a2c] text-[#00FA9A]">
                            {getUserInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{user.name}</p>
                          <p className="text-xs text-slate-600">{user.email}</p>
                        </div>
                      </div>
                      
                      {/* Navigation */}
                      <div className="space-y-2">
                        {navigationItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsSheetOpen(false)}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 transition-colors text-slate-700 hover:text-[#00FA9A] font-medium"
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        ))}
                        
                        {user?.permission === "admin" && (
                          <>
                            <div className="border-t border-slate-200 my-2"></div>
                            <p className="text-xs font-semibold text-slate-700 px-3 uppercase tracking-wide">Admin</p>
                            {adminItems.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSheetOpen(false)}
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 transition-colors text-slate-700 hover:text-[#00FA9A] font-medium"
                              >
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                              </Link>
                            ))}
                          </>
                        )}
                        
                        <div className="border-t border-slate-200 my-2"></div>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-red-600 hover:text-red-700 w-full text-left font-medium"
                        >
                          <FaSignOutAlt className="h-4 w-4" />
                          <span>Sair</span>
                        </button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          ) : (
            <>
              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild className="text-readable hover:text-[#00FA9A]">
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button asChild className="codewise-button-primary font-medium">
                  <Link href="/register">Cadastrar</Link>
                </Button>
              </div>

              {/* Mobile Auth Sheet */}
              <div className="md:hidden">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-[#00FA9A]/10 hover:text-[#00FA9A] text-slate-700">
                      <FaBars className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white">
                    <SheetHeader>
                      <SheetTitle className="text-slate-900">Bem-vindo!</SheetTitle>
                      <SheetDescription className="text-slate-600">
                        Entre ou cadastre-se para acessar os cursos
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                      <Button asChild onClick={() => setIsSheetOpen(false)} className="codewise-button-primary font-medium">
                        <Link href="/login" className="flex items-center justify-center">
                          <FaSignInAlt className="mr-2 h-4 w-4" />
                          Entrar
                        </Link>
                      </Button>
                      <Button variant="outline" asChild onClick={() => setIsSheetOpen(false)} className="border-slate-300 text-slate-700 hover:border-[#00FA9A] hover:text-[#00FA9A] font-medium">
                        <Link href="/register" className="flex items-center justify-center">
                          <FaUserPlus className="mr-2 h-4 w-4" />
                          Cadastrar
                        </Link>
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}