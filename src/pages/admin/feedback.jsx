import { useEffect, useState } from "react";
import { db } from "../../lib/firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import Head from "next/head";
import AdminRoute from "../../components/AdminRoute";
import LoadingSpinner from "../../components/LoadingSpinner";

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <LoadingSpinner />;
  }

  const groupedFeedbacks = feedbacks.reduce((acc, feedback) => {
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
          {feedbacks.length === 0 ? (
            <p className="text-center text-lg text-[#001a33]">
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
                      className="mb-4 p-4 bg-[#001a33] text-white rounded-lg shadow-lg"
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
        </main>
      </div>
    </AdminRoute>
  );
};

export default Feedbacks;
