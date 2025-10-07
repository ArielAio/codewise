import { useEffect, useState } from "react";
import StarRating from "../../components/StarRating";
import FeedbackForm from "../../components/FeedbackForm";
import ExpandableDescription from "../../components/ExpandableDescription";
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
import { FaPlay, FaCheck, FaClock, FaBookOpen, FaHeart } from "react-icons/fa";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";

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
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [canGiveFeedback, setCanGiveFeedback] = useState(false);
  const [showFeedbackNotification, setShowFeedbackNotification] = useState(false);
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
    router.push("/courses");
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

  // Verificar se o usuário pode dar feedback (após assistir pelo menos 50% do curso)
  useEffect(() => {
    const wasEligibleBefore = canGiveFeedback;
    if (progressPercentage >= 50 && !wasEligibleBefore) {
      setCanGiveFeedback(true);
      // Mostrar notificação apenas na primeira vez que atinge 50%
      const hasSeenNotification = localStorage.getItem(`feedback_notification_${id}`);
      if (!hasSeenNotification) {
        setShowFeedbackNotification(true);
        localStorage.setItem(`feedback_notification_${id}`, 'true');
        // Auto-hide notification after 5 seconds
        setTimeout(() => setShowFeedbackNotification(false), 5000);
      }
    }
  }, [progressPercentage, canGiveFeedback, id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Head>
          <title>{course.title} - CodeWise</title>
          <meta name="description" content={`Aprenda ${course.title} com projetos práticos e mentoria especializada.`} />
        </Head>

        <main className="container mx-auto px-4 py-8 lg:py-16 relative">
          {/* Back Button */}
          <motion.button
            onClick={handleBackButtonClick}
            className="absolute top-4 left-4 z-10 codewise-button-primary p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="Voltar para Cursos"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <IoArrowBackCircle className="h-6 w-6" />
          </motion.button>

          {/* Course Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 lg:mb-8"
          >
            <Badge variant="outline" className="mb-3 bg-[#00FA9A]/10 border-[#00FA9A]/30 text-black font-semibold">
              📚 Curso Completo
            </Badge>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3 text-readable">
              {course.title}
            </h1>
            
            {/* Descrição Compacta */}
            {course.description && (
              <ExpandableDescription 
                description={course.description}
                maxLength={200}
                maxHeight="80px"
                className="max-w-4xl mx-auto"
                showBorder={true}
              />
            )}
          </motion.div>

          {/* Progress Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <Card className="codewise-card overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-[#00FA9A]/10 to-[#00FA9A]/5 p-4 lg:p-6">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
                    <div className="flex items-center space-x-3 lg:space-x-4">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-[#00FA9A] to-[#33FBB1] rounded-xl flex items-center justify-center shadow-lg">
                        <FaBookOpen className="h-6 w-6 lg:h-8 lg:w-8 text-[#001a2c]" />
                      </div>
                      <div>
                        <h3 className="text-lg lg:text-2xl font-bold text-readable">Seu Progresso</h3>
                        <p className="text-readable-muted text-sm lg:text-lg">
                          {completedVideos} de {totalVideos} aulas concluídas
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center lg:text-right space-y-2 lg:space-y-3 w-full lg:w-auto">
                      <div className="flex items-center justify-center lg:justify-end space-x-3">
                        <Badge className="codewise-button-primary font-bold text-sm lg:text-lg px-3 lg:px-4 py-1 lg:py-2">
                          {progressPercentage.toFixed(0)}% Completo
                        </Badge>
                        {progressPercentage === 100 && (
                          <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold px-3 lg:px-4 py-1 lg:py-2">
                            <FaCheck className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                            Concluído!
                          </Badge>
                        )}
                      </div>
                      
                      {/* Barra de Progresso Melhorada */}
                      <div className="w-full lg:w-80">
                        <div className="flex justify-between text-xs lg:text-sm text-readable-muted mb-1 lg:mb-2">
                          <span>Progresso</span>
                          <span>{progressPercentage.toFixed(0)}%</span>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-slate-200 rounded-full h-3 lg:h-4 shadow-inner">
                            <motion.div
                              className="bg-gradient-to-r from-[#00FA9A] to-[#33FBB1] h-3 lg:h-4 rounded-full shadow-md relative overflow-hidden"
                              style={{ width: `${progressPercentage}%` }}
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPercentage}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            >
                              {/* Animação de brilho */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                              
                              {/* Efeito de ondulação */}
                              {progressPercentage > 0 && (
                                <div className="absolute right-0 top-0 h-full w-1 lg:w-2 bg-white/30 rounded-full" />
                              )}
                            </motion.div>
                          </div>
                          
                          {/* Marcadores de progresso */}
                          <div className="flex justify-between mt-1 lg:mt-2">
                            {[0, 25, 50, 75, 100].map((mark) => (
                              <div
                                key={mark}
                                className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${
                                  progressPercentage >= mark
                                    ? 'bg-[#00FA9A]'
                                    : 'bg-slate-300'
                                } transition-colors duration-300`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player Section */}
            <motion.section 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="codewise-gradient shadow-2xl border-2 border-[#00FA9A]/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-white font-bold flex items-center space-x-2">
                    <FaPlay className="h-5 w-5 text-[#00FA9A]" />
                    <span>
                      {course.youtubeLinks.find((link) =>
                        link.url.includes(selectedVideo)
                      )?.title || "Selecione uma aula"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {selectedVideo ? (
                    <div className="space-y-4">
                      <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg border-2 border-[#00FA9A]/50">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=0`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                          allowFullScreen
                          className="absolute inset-0"
                        />
                      </div>
                      
                      {course.youtubeLinks.findIndex((link) =>
                        link.url.includes(selectedVideo)
                      ) < course.youtubeLinks.length - 1 && (
                        <Button
                          onClick={handleNextVideo}
                          className="codewise-button-primary font-semibold"
                        >
                          <FaPlay className="mr-2 h-4 w-4" />
                          Próximo Vídeo
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center">
                      <p className="text-slate-600 text-lg">Selecione uma aula para assistir</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.section>

            {/* Lessons Sidebar */}
            <motion.aside 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="h-full max-h-[700px] flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl text-readable flex items-center space-x-2">
                    <FaBookOpen className="h-5 w-5 text-[#00FA9A]" />
                    <span>Aulas do Curso</span>
                  </CardTitle>
                  <CardDescription className="text-readable-muted">
                    {totalVideos} aulas disponíveis
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-6">
                  {course.youtubeLinks && course.youtubeLinks.length > 0 ? (
                    <div className="h-full overflow-y-auto space-y-3 pr-2">
                      {course.youtubeLinks.map((link, index) => {
                        const isSelected = selectedVideo === new URL(link.url).searchParams.get("v");
                        const isCompleted = watchedVideos[index];
                        
                        return (
                          <motion.div
                            key={index}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? "border-[#00FA9A] bg-[#00FA9A]/10"
                                : "border-slate-200 hover:border-[#00FA9A]/50 hover:bg-slate-50"
                            }`}
                            onClick={(event) => handleVideoClick(link.url, index, event)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    Aula {index + 1}
                                  </Badge>
                                  {isCompleted && (
                                    <Badge className="bg-green-500 text-white text-xs">
                                      <FaCheck className="h-3 w-3 mr-1" />
                                      Concluída
                                    </Badge>
                                  )}
                                </div>
                                <h4 className="font-medium text-readable text-sm leading-tight mb-1">
                                  {link.title}
                                </h4>
                                <div className="flex items-center space-x-1 text-xs text-readable-muted">
                                  <FaClock className="h-3 w-3" />
                                  <span>Vídeo</span>
                                </div>
                              </div>
                              <div className="ml-3">
                                <input
                                  type="checkbox"
                                  checked={isCompleted || false}
                                  onChange={(event) => handleCheckboxToggle(index, event)}
                                  className="w-5 h-5 accent-[#00FA9A] rounded"
                                  onClick={(event) => event.stopPropagation()}
                                />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-readable-muted text-center">
                        Não há aulas disponíveis para este curso.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.aside>
          </div>

          {/* Feedback Form */}
          {showFeedbackForm && user && (
            <FeedbackForm
              courseId={id}
              userId={user.uid}
              userName={user.name || "Anônimo"}
              userEmail={user.email || "Email não fornecido"}
              courseTitle={course.title}
              onClose={() => setShowFeedbackForm(false)}
            />
          )}

          {/* Notificação de Feedback Disponível */}
          {showFeedbackNotification && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: 50 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 50, x: 50 }}
              className="fixed bottom-20 right-6 z-50"
            >
              <Card className="bg-white border-2 border-[#00FA9A]/50 shadow-xl max-w-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#00FA9A] rounded-full flex items-center justify-center">
                      <FaHeart className="h-5 w-5 text-[#001a2c]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-readable text-sm">🎉 Ótimo progresso!</h4>
                      <p className="text-readable-muted text-xs">
                        Você já pode compartilhar sua experiência conosco
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFeedbackNotification(false)}
                      className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
                    >
                      ×
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Botão Flutuante de Feedback */}
          {canGiveFeedback && user && !showFeedbackForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="fixed bottom-6 right-6 z-40"
            >
              <div className="relative group">
                <Button
                  onClick={() => setShowFeedbackForm(true)}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  <FaHeart className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  {progressPercentage === 100 ? 'Avaliar' : 'Feedback'}
                </Button>
                
                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  {progressPercentage === 100 
                    ? 'Parabéns! Avalie sua experiência' 
                    : 'Compartilhe sua experiência até agora'}
                </div>
              </div>
            </motion.div>
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
