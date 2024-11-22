import { useEffect, useState } from "react";
import StarRating from "../../components/StarRating";
import FeedbackForm from "../../components/FeedbackForm";
import { db } from "../../lib/firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import Head from "next/head";
import { motion } from "framer-motion";
import ProtectedRoute from "../../components/ProtectedRoute";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../lib/AuthContext";
import { IoArrowBackCircle } from "react-icons/io5";

export const updateUserProgress = async (
  userId,
  courseId,
  courseName,
  completedLessons,
  totalLessons,
  userName,
  userEmail,
  feedbackGiven
) => {
  try {
    const progressPercentage = (completedLessons / totalLessons) * 100;
    const userProgressDoc = doc(db, "userProgress", userId);
    await setDoc(
      userProgressDoc,
      {
        courseId,
        courseName, // Salve o nome do curso
        completedLessons,
        totalLessons,
        userName, // Salve o nome do usuário
        userEmail, // Salve o email do usuário
        progressPercentage, // Salve o progresso percentual
        feedbackGiven, // Salve o estado do feedback
      },
      { merge: true }
    );

    // Salve o estado de conclusão do curso no localStorage
    if (progressPercentage === 100) {
      const completedCourses =
        JSON.parse(localStorage.getItem("completedCourses")) || [];
      if (!completedCourses.includes(courseId)) {
        completedCourses.push(courseId);
        localStorage.setItem(
          `completedCourses_${courseId}`,
          JSON.stringify(completedCourses)
        );
      }
    }
  } catch (error) {
    console.error("Erro ao atualizar o progresso do usuário:", error);
  }
};

// Supondo que você tenha uma função para verificar se o usuário é admin
const isAdmin = (user) => {
  // lógica para verificar se o usuário é admin
  return user && user.permission === "admin";
};

const CourseDetail = ({ course, initialSelectedVideo }) => {
  const router = useRouter();
  const { id } = router.query;
  const [selectedVideo, setSelectedVideo] = useState(initialSelectedVideo);
  const [watchedVideos, setWatchedVideos] = useState({});
  const [loading, setLoading] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { user } = useAuth();

  const checkAllLessonsCompleted = (courseData) => {
    return courseData.youtubeLinks.every((link) => link.completed);
  };

  const saveCompletionState = (courseId, state) => {
    localStorage.setItem(`course_${courseId}_completed`, JSON.stringify(state));
  };

  const getCompletionState = (courseId) => {
    return JSON.parse(localStorage.getItem(`course_${courseId}_completed`));
  };

  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      try {
        const courseDoc = doc(db, "cursos", id);
        const courseSnapshot = await getDoc(courseDoc);
        if (courseSnapshot.exists()) {
          setSelectedVideo(courseSnapshot.data());
        }

        const savedProgress = localStorage.getItem(`watchedVideos_${id}`);
        let initialWatchedVideos = savedProgress
          ? JSON.parse(savedProgress)
          : {};

        // Mark first video as watched if no saved progress
        if (
          !savedProgress &&
          course &&
          course.youtubeLinks &&
          course.youtubeLinks.length > 0
        ) {
          initialWatchedVideos = { 0: true }; // Mark first video as watched
          localStorage.setItem(
            `watchedVideos_${id}`,
            JSON.stringify(initialWatchedVideos)
          );

          // Update progress in Firebase
          const userName = user?.name || "Anônimo";
          const userEmail = user?.email || "Email não fornecido";

          if (user) {
            await updateUserProgress(
              user.uid,
              id,
              course.title,
              1, // One lesson completed
              course.youtubeLinks.length,
              userName,
              userEmail,
              false
            );
          }
        }

        setWatchedVideos(initialWatchedVideos);

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

        // Rest of the existing code...
      } catch (error) {
        console.error("Erro ao buscar curso:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndProgress();
  }, [id, course, user]);

  const handleBackButtonClick = () => {
    if (isAdmin(user)) {
      router.push("/admin/cursos");
    } else {
      router.push("/cursos");
    }
  };

  const handleVideoClick = async (url, index, event) => {
    if (event) event.preventDefault();

    // Only mark the clicked video as watched
    setWatchedVideos((prevWatchedVideos) => {
      const updatedWatchedVideos = {
        ...prevWatchedVideos,
        [index]: true,
      };

      const totalWatched =
        Object.values(updatedWatchedVideos).filter(Boolean).length;
      const validCompletedLessons = Math.min(
        totalWatched,
        course.youtubeLinks.length
      );

      localStorage.setItem(
        `watchedVideos_${id}`,
        JSON.stringify(updatedWatchedVideos)
      );

      const userName = user.name || "Anônimo";
      const userEmail = user.email || "Email não fornecido";

      updateUserProgress(
        user.uid,
        id,
        course.title,
        validCompletedLessons,
        course.youtubeLinks.length,
        userName,
        userEmail,
        showFeedbackForm
      ).catch((error) => {
        console.error("Erro ao atualizar o progresso:", error);
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

  useEffect(() => {
    const courseId = course.id;
    const completionState = getCompletionState(courseId);

    if (!completionState) {
      const allCompleted = checkAllLessonsCompleted(course);
      saveCompletionState(courseId, allCompleted);
    }

    if (completionState) {
      alert("Parabéns! Você concluiu todas as aulas.");
    }
  }, [course]);

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

        <main className="container mx-auto px-4 py-16 relative">
          <button
            onClick={handleBackButtonClick}
            className="absolute top-4 left-4 bg-[#00FA9A] hover:bg-[#00FA7A] text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="Voltar para Cursos"
          >
            <IoArrowBackCircle className="h-6 w-6" />
          </button>
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
            <aside className="lg:col-span-1 bg-[#001a33] rounded-lg p-6 shadow-lg border border-[#00FA9A] flex flex-col h-[600px]">
              <h3 className="text-2xl font-semibold mb-4 text-[#00FA9A]">
                Aulas do Curso
              </h3>

              {course.youtubeLinks && course.youtubeLinks.length > 0 ? (
                <div className="flex-1 overflow-y-auto overflow-x-hidden mb-16">
                  <ul className="space-y-4">
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

              <div className="mt-auto pt-4">
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
          {showFeedbackForm && user && (
            <FeedbackForm
              courseId={id}
              userId={user.uid}
              userName={user.name || "Anônimo"}
              userEmail={user.email || "Email não fornecido"}
              courseTitle={course.title}
              onClose={() => {
                setShowFeedbackForm(false);
              }}
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

  const initialSelectedVideo = new URL(
    courseData.youtubeLinks[0].url
  ).searchParams.get("v");

  return {
    props: {
      course: courseData,
      initialSelectedVideo,
    },
    revalidate: 10,
  };
}

export default CourseDetail;
