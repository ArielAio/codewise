//imports
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { db } from '../lib/firebaseConfig'; // Importar a configuração do Firebase
import { collection, getDocs } from 'firebase/firestore'; // Importar funções do Firestore
import Slider from 'react-slick'; // Importa o componente Slider
import 'slick-carousel/slick/slick.css'; // Importa os estilos do slick
import 'slick-carousel/slick/slick-theme.css'; // Importa os temas do slick

export default function Home() {
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0); // Estado para controlar o curso atual
  const [cursos, setCursos] = useState([]); // Estado para armazenar os cursos
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const cursosCollection = collection(db, 'cursos'); // Nome da coleção no Firestore
        const cursosSnapshot = await getDocs(cursosCollection);
        const cursosList = cursosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCursos(cursosList); // Atualiza o estado com a lista de cursos
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
      } finally {
        setLoading(false); // Define loading como false após a busca
      }
    };

    fetchCursos(); // Chama a função para buscar os cursos

    // Adiciona um intervalo para mudar automaticamente os cursos
    const interval = setInterval(() => {
      nextCourse(); // Chama a função para ir para o próximo curso
    }, 3000); // Muda a cada 3 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [cursos.length]); // Adiciona cursos.length como dependência

  const nextCourse = () => {
    if (cursos.length > 0) { // Verifica se há cursos
      setCurrentCourseIndex((prevIndex) => (prevIndex + 1) % cursos.length); // Atualiza o índice do curso
    }
  };

  const prevCourse = () => {
    if (cursos.length > 0) { // Verifica se há cursos
      setCurrentCourseIndex((prevIndex) => (prevIndex - 1 + cursos.length) % cursos.length); // Atualiza o índice do curso
    }
  };

  const usedEmojis = new Set(); // Conjunto para rastrear emojis usados

  const getRandomEmoji = () => {
    const emojis = ['💻', '👨‍💻', '👩‍💻', '🖥️', '📱', '🧑‍💻', '🔧', '🛠️', '📊', '📈', '💡', '🧩'];
    const availableEmojis = emojis.filter(emoji => !usedEmojis.has(emoji)); // Filtra emojis já usados

    if (availableEmojis.length === 0) {
      return null; // Retorna null se todos os emojis foram usados
    }

    const randomIndex = Math.floor(Math.random() * availableEmojis.length);
    const selectedEmoji = availableEmojis[randomIndex];
    usedEmojis.add(selectedEmoji); // Adiciona o emoji selecionado ao conjunto de usados
    return selectedEmoji;
  };

  const settings = {
    dots: true, // Exibe os pontos de navegação
    infinite: true, // Permite rolar infinitamente
    speed: 500, // Velocidade da transição
    slidesToShow: 1, // Número de slides a serem exibidos
    slidesToScroll: 1, // Número de slides a serem rolados
    autoplay: true, // Ativa o autoplay
    autoplaySpeed: 3000, // Tempo em milissegundos entre as transições
  };

  return (
    <div className="min-h-screen bg-white text-[#001a33]">
      <Head>
        <title>CodeWise - Aprenda programação com tranquilidade</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-16 bg-[#001a33] py-8 rounded-lg">
          <h1 className="text-6xl font-bold mb-4 text-[#00FA9A] transition-transform duration-300 transform hover:scale-105">CodeWise</h1>
          <p className="text-xl text-white">Aprenda programação no seu ritmo, com serenidade e sabedoria</p>
        </header>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-[#001a33]">Cursos em Destaque</h2>

          {loading ? (
            <div className="bg-gray-300 h-32 rounded-lg animate-pulse"></div>
          ) : cursos.length > 0 ? (
            <div className="text-center mb-4">
              <span className="text-6xl mb-4 inline-block transition-all duration-500 ease-in-out transform hover:scale-110">
                {getRandomEmoji()}
              </span>
              <h3 className="text-2xl font-semibold text-[#001a33]">
                <Link href={`/cursos/${cursos[currentCourseIndex]?.id}`}>
                  {cursos.length > 0 ? cursos[currentCourseIndex]?.title : 'Curso Indisponível'}
                </Link>
              </h3>
            </div>
          ) : (
            <p className="text-lg text-[#001a33]">Nenhum curso disponível no momento.</p>
          )}
        </section>

        <section className="text-center mb-16 bg-[#001a33] py-12 px-4 rounded-lg">
          <h2 className="text-4xl font-semibold mb-10 text-[#00FA9A]">Por que escolher a CodeWise?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { title: 'Aprendizado Tranquilo', description: 'Ambiente sereno para melhor absorção do conteúdo', icon: '🧘' },
              { title: 'Suporte Personalizado', description: 'Mentoria individual para seu progresso', icon: '👨‍🏫' },
              { title: 'Projetos Práticos', description: 'Aplique seus conhecimentos em casos reais', icon: '🛠️' },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 flex flex-col items-center">
                <span className="text-5xl mb-4 inline-block">{feature.icon}</span>
                <h3 className="text-xl font-semibold mb-3 text-[#001a33]">{feature.title}</h3>
                <p className="text-[#001a33] text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-[#001a33]">Comece sua jornada de aprendizado</h2>
          <p className="text-lg mb-8 text-[#001a33]">Descubra seu potencial e transforme sua carreira com a CodeWise</p>
          <a href="/cursos" className="bg-[#00FA9A] text-[#001a33] px-8 py-4 rounded-full text-xl font-bold inline-block transition-all duration-300 hover:bg-[#33FBB1] hover:shadow-lg transform hover:-translate-y-1 hover:scale-105">
            Explorar Cursos
          </a>
        </section>

        <section className="bg-[#001a33] rounded-lg p-8 shadow-lg text-white">
          <h2 className="text-3xl font-semibold mb-6 text-center text-[#00FA9A]">Depoimentos de Alunos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'Ana Silva', comment: 'A CodeWise mudou minha vida. O ambiente tranquilo de aprendizado me ajudou a focar e progredir rapidamente.' },
              { name: 'Carlos Oliveira', comment: 'Os projetos práticos da CodeWise me deram confiança para iniciar minha carreira como desenvolvedor.' },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <p className="italic mb-2 text-[#001a33]">"{testimonial.comment}"</p>
                <p className="font-semibold text-[#00FA9A]">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="text-center py-8 bg-[#001a33] text-white mt-16">
        <p>&copy; 2023 CodeWise. Transformando vidas através da programação.</p>
      </footer>
    </div>
  );
}
