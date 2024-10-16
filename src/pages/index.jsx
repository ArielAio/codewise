//imports
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [currentCourse, setCurrentCourse] = useState(0);
  const courses = [
    { name: 'Fundamentos de Programação', icon: '🖥️' },
    { name: 'Desenvolvimento Web', icon: '🌐' },
    { name: 'Ciência de Dados', icon: '📊' },
    { name: 'Inteligência Artificial', icon: '🤖' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCourse((prev) => (prev + 1) % courses.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-blue-900">
      <Head>
        <title>CodeWise - Aprenda programação com tranquilidade</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 text-blue-600 transition-transform duration-300 transform hover:scale-105">CodeWise</h1>
          <p className="text-xl text-blue-700">Aprenda programação no seu ritmo, com serenidade e sabedoria</p>
        </header>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-blue-800">Cursos em Destaque</h2>
          <div className="bg-white rounded-lg p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-blue-50">
            <div className="text-center">
              <span className="text-6xl mb-4 inline-block transition-all duration-500 ease-in-out transform hover:scale-110">
                {courses[currentCourse].icon}
              </span>
              <h3 className="text-2xl font-semibold text-blue-700">{courses[currentCourse].name}</h3>
            </div>
          </div>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-blue-800">Por que escolher a CodeWise?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Aprendizado Tranquilo', description: 'Ambiente sereno para melhor absorção do conteúdo', icon: '🧘' },
              { title: 'Suporte Personalizado', description: 'Mentoria individual para seu progresso', icon: '👨‍🏫' },
              { title: 'Projetos Práticos', description: 'Aplique seus conhecimentos em casos reais', icon: '🛠️' },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
                <span className="text-4xl mb-4 inline-block">{feature.icon}</span>
                <h3 className="text-xl font-semibold mb-2 text-blue-600">{feature.title}</h3>
                <p className="text-blue-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-blue-800">Comece sua jornada de aprendizado</h2>
          <p className="text-lg mb-8 text-blue-700">Descubra seu potencial e transforme sua carreira com a CodeWise</p>
          <a href="/cursos" className="bg-blue-600 text-white px-8 py-4 rounded-full text-xl font-bold inline-block transition-all duration-300 hover:bg-blue-500 hover:shadow-lg transform hover:-translate-y-1 hover:scale-105">
            Explorar Cursos
          </a>
        </section>

        <section className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-6 text-center text-blue-800">Depoimentos de Alunos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'Ana Silva', comment: 'A CodeWise mudou minha vida. O ambiente tranquilo de aprendizado me ajudou a focar e progredir rapidamente.' },
              { name: 'Carlos Oliveira', comment: 'Os projetos práticos da CodeWise me deram confiança para iniciar minha carreira como desenvolvedor.' },
            ].map((testimonial, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg">
                <p className="italic mb-2">"{testimonial.comment}"</p>
                <p className="font-semibold text-blue-600">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="text-center py-8 bg-blue-600 text-white mt-16">
        <p>&copy; 2023 CodeWise. Transformando vidas através da programação.</p>
      </footer>
    </div>
  );
}
