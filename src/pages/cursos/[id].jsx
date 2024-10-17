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
        event.stopPropagation();
        const currentIndex = course.youtubeLinks.findIndex(link => link.url.includes(selectedVideo));
        if (currentIndex !== -1) {
          setWatchedVideos((prev) => ({
            ...prev,
            [currentIndex]: true,
          }));
        }
        setSelectedVideo(new URL(url).searchParams.get('v'));
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
                  src={`https://www.youtube.com/embed/${selectedVideo}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg shadow-lg"
                ></iframe>
                <button onClick={handleNextVideo} className="mt-4 bg-[#00FA9A] hover:bg-opacity-80 text-[#001a33] font-bold px-6 py-2 rounded transition duration-300">
                  Próximo Vídeo
                </button>
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
                  <li
                    key={index}
                    className={`bg-[#001a33] shadow-lg p-4 rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer flex items-center justify-between ${
                      selectedVideo === new URL(link.url).searchParams.get('v') ? 'border-2 border-[#00FA9A]' : ''
                    }`}
                  >
                    <button
                      onClick={(event) => handleVideoClick(link.url, index, event)}
                      className="text-lg font-bold text-white w-full text-left"
                    >
                      {link.title}
                    </button>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={watchedVideos[index] || false}
                        onChange={(event) => handleCheckboxToggle(index, event)}
                        className="ml-4 w-6 h-6 accent-[#00FA9A]"
                        onClick={(event) => event.stopPropagation()}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white">Não há links de aulas disponíveis para este curso.</p>
            )}
          </aside>
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

  return {
    props: {
      course: courseData,
    },
    revalidate: 10,
  };
}

export default CourseDetail;
