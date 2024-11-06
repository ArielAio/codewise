import { useEffect, useState } from "react";
import { db } from "../../lib/firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import Head from "next/head";
import AdminRoute from "../../components/AdminRoute";
import LoadingSkeleton from "../../components/LoadingSkeleton"; // Importando o componente de loading skeleton

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const feedbacksCollection = collection(db, "feedbacks");
        const feedbacksSnapshot = await getDocs(feedbacksCollection);
        const feedbacksData = feedbacksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeedbacks(feedbacksData);
      } catch (error) {
        console.error("Erro ao buscar feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await deleteDoc(doc(db, "feedbacks", feedbackId));
      setFeedbacks(feedbacks.filter((feedback) => feedback.id !== feedbackId));
    } catch (error) {
      console.error("Erro ao deletar feedback:", error);
    }
  };

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearchTerm = feedback.userName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse
      ? feedback.courseName === selectedCourse
      : true;
    return matchesSearchTerm && matchesCourse;
  });

  const uniqueCourses = [
    ...new Set(feedbacks.map((feedback) => feedback.courseName)),
  ];

  if (loading) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-white text-[#001a33]">
          <main className="container mx-auto px-4 py-16">
            <h2 className="text-4xl font-bold mb-8 text-center text-[#001a33]">
              Feedbacks dos Cursos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <LoadingSkeleton key={index} />
              ))}
            </div>
          </main>
        </div>
      </AdminRoute>
    );
  }

  const groupedFeedbacks = filteredFeedbacks.reduce((acc, feedback) => {
    if (!acc[feedback.courseId]) {
      acc[feedback.courseId] = [];
    }
    acc[feedback.courseId].push(feedback);
    return acc;
  }, {});

  return (
    <AdminRoute>
      <div className="min-h-screen bg-white text-[#001a33]">
        <Head>
          <title>Feedback - CodeWise</title>
        </Head>

        <main className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center text-[#001a33]">
            Feedbacks dos Cursos
          </h1>
          <div className="mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <input
              type="text"
              placeholder="Buscar por nome de usuário"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full md:w-auto"
            />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full md:w-auto"
            >
              <option value="">Todos os cursos</option>
              {uniqueCourses.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>
          <div className="bg-[#001a33] p-8 rounded-lg shadow-lg">
            {filteredFeedbacks.length === 0 ? (
              <p className="text-center text-lg text-[#00FA9A]">
                Nenhum feedback disponível no momento.
              </p>
            ) : (
              Object.keys(groupedFeedbacks).map((courseId) => (
                <div key={courseId} className="mb-8">
                  <h2 className="text-3xl font-semibold mb-4 text-[#00FA9A]">
                    Curso: {groupedFeedbacks[courseId][0].courseName}
                  </h2>
                  <ul>
                    {groupedFeedbacks[courseId].map((feedback, index) => (
                      <li
                        key={index}
                        className="mb-4 p-4 bg-white text-[#001a33] rounded-lg shadow-lg"
                      >
                        <p>
                          <strong>Usuário:</strong> {feedback.userName}
                        </p>
                        <p>
                          <strong>Email:</strong> {feedback.userEmail}
                        </p>
                        <p>
                          <strong>Nota:</strong> {feedback.rating} estrelas
                        </p>
                        <p>
                          <strong>Comentário:</strong> {feedback.comment}
                        </p>
                        <button
                          onClick={() => handleDeleteFeedback(feedback.id)}
                          className="mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-200"
                        >
                          Remover
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </AdminRoute>
  );
};

export default Feedbacks;
