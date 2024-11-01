import "@/styles/globals.css";
import Header from "../components/Header";
import { AuthProvider } from "../lib/AuthContext"; // Importe o AuthProvider

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider> {/* Envolva o conteúdo com o AuthProvider */}
      <Header />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
