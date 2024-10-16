import { useEffect, useState } from 'react';
import { db } from '../../lib/firebaseConfig';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Skeleton from 'react-loading-skeleton';

const CourseDetail = ({ course }) => {
  const router = useRouter();
  const { id } = router.query;
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [watchedVideos, setWatchedVideos] = useState({});

  useEffect(() => {
    if (course && course.youtubeLinks && course.youtubeLinks.length > 0) {
      setSelectedVideo(new URL(course.youtubeLinks[0].url).searchParams.get('v'));
    }
  }, [course]);

  if (!course)
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-blue-900">
        <Skeleton height={50} count={3} />
      </div>
    );

    const handleVideoClick = (url, index, event) => {
        event.stopPropagation(); // Impede que o clique no nome do vídeo afete o checkbox
      
        const currentIndex = course.youtubeLinks.findIndex(link => link.url.includes(selectedVideo));
        
        // Se o vídeo clicado for diferente do vídeo selecionado, marca o atual como assistido
        if (currentIndex !== -1) {
          setWatchedVideos((prev) => ({
            ...prev,
            [currentIndex]: true, // Marca a aula atual como assistida
          }));
        }
      
        // Atualiza o vídeo selecionado
        setSelectedVideo(new URL(url).searchParams.get('v'));
      };
      
      // Checkbox permanece inalterado
      const handleCheckboxToggle = (index, event) => {
        event.stopPropagation(); // Impede que o clique no checkbox afete o vídeo
        setWatchedVideos((prev) => ({
          ...prev,
          [index]: !prev[index], // Alterna o estado de visualização do vídeo
        }));
      };
      
      const handleNextVideo = () => {
        const currentIndex = course.youtubeLinks.findIndex(link => link.url.includes(selectedVideo));
        if (currentIndex < course.youtubeLinks.length - 1) {
          handleVideoClick(course.youtubeLinks[currentIndex + 1].url, currentIndex + 1);
        }
      };
      

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-blue-900">
      <Head>
        <title>{course.title} - CodeWise</title>
      </Head>

      <main className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-6">{course.title}</h1>

          {selectedVideo ? (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {course.youtubeLinks.find((link) => link.url.includes(selectedVideo)).title}
              </h2>
              <iframe
                width="100%"
                height="450"
                src={`https://www.youtube.com/embed/${selectedVideo}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg shadow-lg"
              ></iframe>
              <button onClick={handleNextVideo} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                Próximo Vídeo
              </button>
            </div>
          ) : (
            <p>Selecione uma aula para assistir.</p>
          )}
        </section>

        <aside className="lg:col-span-1">
          <h2 className="text-2xl font-semibold mb-4">Aulas do Curso</h2>

          {course.youtubeLinks && course.youtubeLinks.length > 0 ? (
           <ul className="space-y-4">
           {course.youtubeLinks.map((link, index) => (
             <li
               key={index}
               className={`bg-white shadow-lg p-4 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer flex items-center justify-between ${selectedVideo === new URL(link.url).searchParams.get('v') ? 'bg-blue-200 border-2 border-blue-500' : ''}`} // Adiciona classe se o vídeo estiver selecionado
             >
               <button
                 onClick={(event) => handleVideoClick(link.url, index, event)} // Separa o clique do vídeo
                 className="text-lg font-medium text-blue-900 w-full text-left"
               >
                 {link.title}
               </button>
               <div className="flex items-center">
                 <input
                   type="checkbox"
                   checked={watchedVideos[index] || false}
                   onChange={(event) => handleCheckboxToggle(index, event)} // Checkbox separado
                   className="ml-4 w-6 h-6"
                   onClick={(event) => event.stopPropagation()} // Garante que o checkbox não afete o clique no item da lista
                 />
               </div>
             </li>
           ))}
         </ul>
         
          ) : (
            <p>Não há links de aulas disponíveis para este curso.</p>
          )}
        </aside>
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

  return {
    props: {
      course: courseData,
    },
    revalidate: 10,
  };
}

export default CourseDetail;
