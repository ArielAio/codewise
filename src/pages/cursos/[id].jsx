import { useEffect, useState } from 'react';
import { db } from '../../lib/firebaseConfig';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Skeleton from 'react-loading-skeleton';
import { motion } from 'framer-motion'; // Importando a biblioteca framer-motion

const CourseDetail = ({ course }) => {
  const router = useRouter();
  const { id } = router.query;
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [watchedVideos, setWatchedVideos] = useState({});

  useEffect(() => {
    // Recupera o progresso do usuário do localStorage
    const savedProgress = localStorage.getItem(`watchedVideos_${id}`);
    if (savedProgress) {
      setWatchedVideos(JSON.parse(savedProgress));
    }

    // Recupera o vídeo selecionado do localStorage
    const savedVideoIndex = localStorage.getItem(`selectedVideo_${id}`);
    if (savedVideoIndex) {
      const videoIndex = parseInt(savedVideoIndex, 10);
      if (course.youtubeLinks && course.youtubeLinks[videoIndex]) {
        setSelectedVideo(new URL(course.youtubeLinks[videoIndex].url).searchParams.get('v'));
      }
    } else if (course && course.youtubeLinks && course.youtubeLinks.length > 0) {
      setSelectedVideo(new URL(course.youtubeLinks[0].url).searchParams.get('v'));
    }
  }, [id, course]);

  const updateLocalProgress = (index) => {
    const updatedWatchedVideos = { ...watchedVideos, [index]: true };
    setWatchedVideos(updatedWatchedVideos);
    localStorage.setItem(`watchedVideos_${id}`, JSON.stringify(updatedWatchedVideos)); // Salva no localStorage
  };

  const handleVideoClick = (url, index, event) => {
    if (event) { // Verifica se o evento está definido
      event.stopPropagation();
    }
    const currentIndex = course.youtubeLinks.findIndex(link => link.url.includes(selectedVideo));
    if (currentIndex !== -1) {
      updateLocalProgress(currentIndex); // Atualiza o progresso localmente
    }
    setSelectedVideo(new URL(url).searchParams.get('v'));
    localStorage.setItem(`selectedVideo_${id}`, index); // Salva o índice do vídeo selecionado
  };
  
  const handleCheckboxToggle = (index, event) => {
    event.stopPropagation();
    setWatchedVideos((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  
  const handleNextVideo = () => {
    const currentIndex = course.youtubeLinks.findIndex(link => link.url.includes(selectedVideo));
    if (currentIndex < course.youtubeLinks.length - 1) {
      handleVideoClick(course.youtubeLinks[currentIndex + 1].url, currentIndex + 1);
    }
  };
  

  // Cálculo da porcentagem de vídeos assistidos
  if (!course || !course.youtubeLinks) { // Verifica se course e youtubeLinks estão definidos
    return <p className="text-center text-red-500">Curso não encontrado ou sem aulas disponíveis.</p>; // Mensagem de erro
  }
  
  const totalVideos = course.youtubeLinks.length;
  const completedVideos = Object.keys(watchedVideos).filter(key => watchedVideos[key]).length;
  const progressPercentage = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

  return (
    <div className="min-h-screen bg-white text-[#001a33]">
      <Head>
        <title>{course.title} - CodeWise</title>
      </Head>

      <main className="container mx-auto px-4 py-16">
        <div className="flex justify-center mb-8">
          <div className="inline-block bg-[#001a33] rounded-lg px-6 py-3">
            <h1 className="text-6xl font-bold text-center text-[#00FA9A]">CodeWise</h1>
          </div>
        </div>
        <p className="text-xl text-center mb-12 text-[#001a33]">Aprenda programação no seu ritmo, com serenidade e sabedoria</p>

        <h2 className="text-4xl font-bold mb-8 text-center text-[#001a33]">{course.title}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-[#001a33] rounded-lg p-6 shadow-lg border border-[#00FA9A]">
            {selectedVideo ? (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-[#00FA9A]">
                  {course.youtubeLinks.find((link) => link.url.includes(selectedVideo)).title}
                </h3>
                <iframe
                  width="100%"
                  height="450"
                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="rounded-lg shadow-lg border-2 border-[#00FA9A]"
                ></iframe>
                {course.youtubeLinks.findIndex(link => link.url.includes(selectedVideo)) < course.youtubeLinks.length - 1 && ( // Verifica se há próximo vídeo
                  <button 
                    onClick={handleNextVideo} 
                    className="mt-4 bg-[#00FA9A] text-white py-2 px-4 rounded hover:bg-[#00FA7A]"
                  >
                    Próximo Vídeo
                  </button>
                )}
              </div>
            ) : (
              <p className="text-white">Selecione uma aula para assistir.</p>
            )}
          </section>

          <aside className="lg:col-span-1 bg-[#001a33] rounded-lg p-6 shadow-lg border border-[#00FA9A]">
            <h3 className="text-2xl font-semibold mb-4 text-[#00FA9A]">Aulas do Curso</h3>

            {course.youtubeLinks && course.youtubeLinks.length > 0 ? (
              <ul className="space-y-4">
                {course.youtubeLinks.map((link, index) => (
                  <motion.li
                    key={index}
                    className={`bg-[#001a33] shadow-lg p-4 rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer flex items-center justify-between ${
                      selectedVideo === new URL(link.url).searchParams.get('v') ? 'border-2 border-[#00FA9A]' : ''
                    }`}
                    onClick={(event) => handleVideoClick(link.url, index, event)}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-lg font-bold text-white w-full flex items-center justify-between">
                      {link.title}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={watchedVideos[index] || false}
                          onChange={(event) => handleCheckboxToggle(index, event)}
                          className="ml-4 w-6 h-6 accent-[#00FA9A]"
                          onClick={(event) => event.stopPropagation()}
                        />
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-white">Não há links de aulas disponíveis para este curso.</p>
            )}
          </aside>
        </div>

        {/* Barra de Progresso */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-4 text-[#00FA9A]">Progresso do Curso</h3>
          <div className="bg-gray-200 rounded-full h-4">
            <div
              className="bg-[#00FA9A] h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-center text-[#001a33] mt-2">
            {completedVideos} de {totalVideos} aulas concluídas ({progressPercentage.toFixed(0)}%)
          </p>
        </div>
      </main>
    </div>
  );
};

export async function getStaticPaths() {
  const coursesCollection = collection(db, 'cursos');
  const coursesSnapshot = await getDocs(coursesCollection);
  const paths = coursesSnapshot.docs.map((doc) => ({
    params: { id: doc.id },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const courseDoc = doc(db, 'cursos', params.id);
  const courseSnapshot = await getDoc(courseDoc);
  const courseData = courseSnapshot.exists() ? courseSnapshot.data() : null;

  // Adicionando verificação para courseData
  if (!courseData || !courseData.youtubeLinks || !Array.isArray(courseData.youtubeLinks)) { // Verifique se youtubeLinks existe e é um array
    return {
      notFound: true, // Retorna uma página 404 se o curso não for encontrado
    };
  }

  return {
    props: {
      course: courseData,
    },
    revalidate: 10,
  };
}

export default CourseDetail;
