import { useEffect, useState } from "react";
import StarRating from "../../components/StarRating";
import FeedbackForm from "../../components/FeedbackForm";
import { db } from "../../lib/firebaseConfig";
import { doc, getDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import Head from "next/head";
import { motion } from "framer-motion";
import ProtectedRoute from "../../components/ProtectedRoute";
import LoadingSpinner from "../../components/LoadingSpinner";
import { updateUserProgress } from "../../lib/progress";
import { useAuth } from "../../lib/AuthContext";

const CourseDetail = ({ course }) => {
  const router = useRouter();
  const { id } = router.query;
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [watchedVideos, setWatchedVideos] = useState({});
  const [loading, setLoading] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    console.log("nome do user é: ", user);
    const fetchCourse = async () => {
      try {
        const courseDoc = doc(db, "cursos", id);
        const courseSnapshot = await getDoc(courseDoc);
        if (courseSnapshot.exists()) {
          setSelectedVideo(courseSnapshot.data());
        }
      } catch (error) {
        console.error("Erro ao buscar curso:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  useEffect(() => {
    if (course && course.youtubeLinks && course.youtubeLinks.length > 0) {
      setSelectedVideo(
        new URL(course.youtubeLinks[0].url).searchParams.get("v")
      );
    }
  }, [course]);

  useEffect(() => {
    const savedProgress = localStorage.getItem(`watchedVideos_${id}`);
    if (savedProgress) {
      setWatchedVideos(JSON.parse(savedProgress));
    }

    const savedVideoIndex = localStorage.getItem(`selectedVideo_${id}`);
    if (savedVideoIndex) {
      const videoIndex = parseInt(savedVideoIndex, 10);
      if (course.youtubeLinks && course.youtubeLinks[videoIndex]) {
        setSelectedVideo(
          new URL(course.youtubeLinks[videoIndex].url).searchParams.get("v")
        );
      }
    } else if (
      course &&
      course.youtubeLinks &&
      course.youtubeLinks.length > 0
    ) {
      setSelectedVideo(
        new URL(course.youtubeLinks[0].url).searchParams.get("v")
      );
    }
  }, [id, course]);

  const handleVideoClick = async (url, index, event) => {
    if (event) event.stopPropagation();
  
    // Atualiza o estado de watchedVideos imediatamente
    setWatchedVideos((prevWatchedVideos) => {
      const updatedWatchedVideos = { ...prevWatchedVideos, [index]: true };
      localStorage.setItem(
        `watchedVideos_${id}`,
        JSON.stringify(updatedWatchedVideos)
      );
  
      // Calcula o progresso imediatamente após atualizar o estado
      const totalWatched = Object.keys(updatedWatchedVideos).filter(
        (key) => updatedWatchedVideos[key]
      ).length;
      const validCompletedLessons = Math.min(
        totalWatched,
        course.youtubeLinks.length
      );
  
      // Atualiza o progresso do usuário
      updateUserProgress(
        user.uid,
        id,
        validCompletedLessons,
        course.youtubeLinks.length
      ).then(() => {
        if (validCompletedLessons === course.youtubeLinks.length) {
          setShowFeedbackForm(true);
        }
      }).catch((error) => {
        console.error("Erro ao atualizar o progresso do usuário:", error);
      });
  
      return updatedWatchedVideos;
    });
  
    setSelectedVideo(new URL(url).searchParams.get("v"));
    localStorage.setItem(`selectedVideo_${id}`, index);
  };

  const handleCheckboxToggle = (index, event) => {
    event.stopPropagation();

    setWatchedVideos((prevWatchedVideos) => {
      const isWatched = !prevWatchedVideos[index];
      const updatedWatchedVideos = { ...prevWatchedVideos, [index]: isWatched };
      localStorage.setItem(
        `watchedVideos_${id}`,
        JSON.stringify(updatedWatchedVideos)
      );
      return updatedWatchedVideos;
    });
  };

  const handleNextVideo = () => {
    const currentIndex = course.youtubeLinks.findIndex((link) =>
      link.url.includes(selectedVideo)
    );
    if (currentIndex < course.youtubeLinks.length - 1) {
      handleVideoClick(
        course.youtubeLinks[currentIndex + 1].url,
        currentIndex + 1
      );
    }
  };

  const handleSubmitFeedback = async (event) => {
    event.preventDefault();
    try {
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const userName = user.name || "Anônimo";
      const userEmail = user.email || "Email não fornecido";

      await addDoc(collection(db, "feedbacks"), {
        userId: user.uid,
        userName, // Ensure user name is captured
        userEmail, // Capture user email
        courseId: id,
        courseName: course.title,
        rating,
        comment,
      });
      setShowFeedbackForm(false);
      alert("Feedback enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
    }
  };

  if (!course || !course.youtubeLinks) {
    return (
      <p className="text-center text-red-500">
        Curso não encontrado ou sem aulas disponíveis.
      </p>
    );
  }

  const totalVideos = course.youtubeLinks.length;
  const completedVideos = Object.keys(watchedVideos).filter(
    (key) => watchedVideos[key]
  ).length;
  const progressPercentage =
    totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white text-[#001a33]">
        <Head>
          <title>{course.title}</title>
        </Head>

        <main className="container mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold mb-8 text-center text-[#001a33]">
            {course.title}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 bg-[#001a33] rounded-lg p-6 shadow-lg border border-[#00FA9A]">
              {selectedVideo ? (
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-[#00FA9A]">
                    {course.youtubeLinks.find((link) =>
                      link.url.includes(selectedVideo)
                    )?.title || "Título não encontrado"}
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
                  {course.youtubeLinks.findIndex((link) =>
                    link.url.includes(selectedVideo)
                  ) <
                    course.youtubeLinks.length - 1 && (
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
            <aside className="lg:col-span-1 bg-[#001a33] rounded-lg p-6 shadow-lg border border-[#00FA9A] relative">
              <h3 className="text-2xl font-semibold mb-4 text-[#00FA9A]">
                Aulas do Curso
              </h3>

              {course.youtubeLinks && course.youtubeLinks.length > 0 ? (
                <div className="space-y-4 h-[480px] overflow-y-auto overflow-x-hidden">
                  <ul>
                    {course.youtubeLinks.map((link, index) => (
                      <motion.li
                        key={index}
                        className={`bg-[#001a33] shadow-lg p-4 rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer flex items-center justify-between ${
                          selectedVideo ===
                          new URL(link.url).searchParams.get("v")
                            ? "border-2 border-[#00FA9A]"
                            : ""
                        }`}
                        onClick={(event) =>
                          handleVideoClick(link.url, index, event)
                        }
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="text-lg font-bold text-white w-full flex items-center justify-between">
                          {link.title}
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={watchedVideos[index] || false}
                              onChange={(event) =>
                                handleCheckboxToggle(index, event)
                              }
                              className="ml-4 w-6 h-6 accent-[#00FA9A]"
                              onClick={(event) => event.stopPropagation()}
                            />
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-white">
                  Não há links de aulas disponíveis para este curso.
                </p>
              )}

              <div className="absolute bottom-4 left-0 right-0 px-6">
                <div className="bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-[#00FA9A] h-4 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-center text-white mt-2">
                  {completedVideos} de {totalVideos} aulas concluídas (
                  {progressPercentage.toFixed(0)}%)
                </p>
              </div>
            </aside>
          </div>
          {showFeedbackForm && (
            <FeedbackForm
              courseId={id}
              userId={user.uid}
              userName={user.name || "Anônimo"}
              userEmail={user.email || "Email não fornecido"}
              courseTitle={course.title}
              onClose={() => setShowFeedbackForm(false)}
            />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export async function getStaticPaths() {
  const coursesCollection = collection(db, "cursos");
  const coursesSnapshot = await getDocs(coursesCollection);
  const paths = coursesSnapshot.docs.map((doc) => ({
    params: { id: doc.id },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const courseDoc = doc(db, "cursos", params.id);
  const courseSnapshot = await getDoc(courseDoc);
  const courseData = courseSnapshot.exists() ? courseSnapshot.data() : null;

  if (
    !courseData ||
    !courseData.youtubeLinks ||
    !Array.isArray(courseData.youtubeLinks)
  ) {
    return {
      notFound: true,
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
