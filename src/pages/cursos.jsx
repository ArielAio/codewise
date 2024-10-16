import Head from 'next/head'; // Importar o componente Head do Next.js
import CourseList from '../components/CourseList'; // Importar o componente CourseList

export default function Cursos() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-blue-900">
      <Head>
        <title>Cursos - CodeWise</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-blue-600">Cursos Disponíveis</h1>
        </header>

        <CourseList /> {/* Renderizar a lista de cursos */}
      </main>

      <footer className="text-center py-8 bg-blue-600 text-white mt-16">
        <p>&copy; 2023 CodeWise. Transformando vidas através da programação.</p>
      </footer>
    </div>
  );
}
