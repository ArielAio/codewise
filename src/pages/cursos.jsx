import Head from 'next/head';
import CourseList from '../components/CourseList';

export default function Cursos() {
  return (
    <div className="min-h-screen bg-white text-[#001a33]">
      <Head>
        <title>Cursos - CodeWise</title>
      </Head>

      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-16 bg-[#001a33] py-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-4 text-[#00FA9A]">Cursos Disponíveis</h1>
          <p className="text-xl text-white">Explore nossa seleção de cursos e comece sua jornada de aprendizado</p>
        </header>

        <section className="mb-16">
          <CourseList />
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-[#001a33]">Não encontrou o que procura?</h2>
          <p className="text-lg mb-8 text-[#001a33]">Entre em contato conosco e sugira novos cursos!</p>
          <a href="/contato" className="bg-[#00FA9A] text-[#001a33] px-8 py-4 rounded-full text-xl font-bold inline-block transition-all duration-300 hover:bg-[#33FBB1] hover:shadow-lg transform hover:-translate-y-1 hover:scale-105">
            Fale Conosco
          </a>
        </section>

      </main>

      <footer className="text-center py-8 bg-[#001a33] text-white mt-16">
        <p>&copy; 2023 CodeWise. Transformando vidas através da programação.</p>
      </footer>
    </div>
  );
}
