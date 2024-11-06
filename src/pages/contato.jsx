import Head from 'next/head';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa'; // Importando o ícone de perfil

const profiles = [
  { name: 'Ariel Aio', link: 'https://www.linkedin.com/in/ariel-aio/' },
  { name: 'Gabriel Nossa', link: 'https://www.instagram.com/gaba.nss/' },
  { name: 'Leonardo Sanga', link: 'https://www.linkedin.com/in/leonardo-minguini-sanga-386336224/' },
  { name: 'Lucas Siconeli', link: '/perfil/lucas-siconeli' },
  { name: 'Matheus Coltro', link: 'https://www.linkedin.com/in/matheus-coltro-36a307280/' },
  { name: 'Vinicius Bruno', link: 'https://www.linkedin.com/in/vinicius-leandro-bruno-07aab1281/' },
];

export default function Contato() {
  return (
    <div className="min-h-screen bg-white text-[#001a33]">
      <Head>
        <title>Fale Conosco - CodeWise</title>
      </Head>

      <main className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-[#00FA9A]">Fale Conosco</h1>
          <p className="text-xl text-[#001a33]">Entre em contato com um de nossos especialistas</p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {profiles.map((profile, index) => (
            <Link href={profile.link} key={index}>
              <div className="flex flex-col items-center bg-[#001a33] text-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 cursor-pointer">
                <FaUserCircle className="text-6xl mb-4" />
                <h2 className="text-2xl font-semibold">{profile.name}</h2>
              </div>
            </Link>
          ))}
        </section>
      </main>

      <footer className="text-center py-8 bg-[#001a33] text-white mt-16">
        <p>&copy; 2024 CodeWise. Transformando vidas através da programação.</p>
      </footer>
    </div>
  );
}