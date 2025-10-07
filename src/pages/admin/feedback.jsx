import { useEffect, useState } from "react";
import { db } from "../../lib/firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import Head from "next/head";
import AdminRoute from "../../components/AdminRoute";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import ReactPaginate from 'react-paginate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { FaComments, FaStar, FaTrash, FaGraduationCap, FaUser, FaEnvelope } from "react-icons/fa";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

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

  const groupByFeedbacks = (feedbacks) => {
    return feedbacks.reduce((acc, feedback) => {
      if (!acc[feedback.courseId]) {
        acc[feedback.courseId] = [];
      }
      acc[feedback.courseId].push(feedback);
      return acc;
    }, {});
  };

  const pageCount = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const paginatedFeedbacks = filteredFeedbacks.slice(offset, offset + itemsPerPage);
  const groupedFeedbacks = groupByFeedbacks(paginatedFeedbacks);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const paginationStyles = `
    .pagination {
      display: flex;
      justify-content: center;
      gap: 0.25rem;
      margin-top: 2rem;
    }

    .page-item {
      list-style: none;
    }

    .page-link {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      background: #001a33;
      color: #00FA9A;
      cursor: pointer;
      transition: all 0.2s;
    }

    .active .page-link {
      background: #00FA9A;
      color: #001a33;
    }

    .page-link:hover {
      transform: translateY(-2px);
      opacity: 0.9;
    }
  `;

  if (loading) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
          <Head>
            <title>Feedbacks - CodeWise</title>
          </Head>
          <main className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 bg-[#00FA9A]/15 border-[#00FA9A]/40 text-[#001a2c] font-semibold">
                💬 Carregando feedbacks...
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-slate-800">
                <span className="codewise-text-gradient">Feedbacks</span> dos Cursos
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto px-4">
                Acompanhe as avaliações e comentários dos estudantes
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <LoadingSkeleton key={index} />
              ))}
            </div>
          </main>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <Head>
          <title>Feedbacks - CodeWise</title>
        </Head>

        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 bg-[#00FA9A]/15 border-[#00FA9A]/40 text-[#001a2c] font-semibold">
              💬 Administração de Feedbacks
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-slate-800">
              <span className="codewise-text-gradient">Feedbacks</span> dos Cursos
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              Acompanhe as avaliações e comentários dos estudantes
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-slate-200/50 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar por nome de usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 border-2 border-slate-200 rounded-lg focus:border-[#00FA9A] focus:ring-2 focus:ring-[#00FA9A]/20 transition-colors text-slate-800 bg-white shadow-sm"
              />
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00FA9A] h-4 w-4" />
            </div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#00FA9A] focus:ring-2 focus:ring-[#00FA9A]/20 transition-colors text-slate-800 w-full sm:min-w-[200px] sm:w-auto bg-white shadow-sm"
            >
              <option value="">Todos os cursos</option>
              {uniqueCourses.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>
          {paginatedFeedbacks.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-2xl font-semibold mb-2 text-readable">Nenhum feedback encontrado</h3>
              <p className="text-readable-muted">
                Não há feedbacks disponíveis com os filtros selecionados.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.keys(groupedFeedbacks).map((courseId) => (
                <div key={courseId} className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <FaGraduationCap className="h-6 w-6 text-[#00FA9A]" />
                    <h2 className="text-2xl font-bold text-readable">
                      {groupedFeedbacks[courseId][0].courseName}
                    </h2>
                    <Badge variant="secondary" className="bg-[#00FA9A]/15 text-[#001a2c] border border-[#00FA9A]/30">
                      {groupedFeedbacks[courseId].length} feedback{groupedFeedbacks[courseId].length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedFeedbacks[courseId].map((feedback, index) => (
                      <Card key={index} className="codewise-card group hover:shadow-lg transition-all duration-300">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <CardTitle className="text-lg text-readable font-bold flex items-center">
                                <FaUser className="mr-2 h-4 w-4 text-[#00FA9A]" />
                                {feedback.userName}
                              </CardTitle>
                              <CardDescription className="text-sm text-readable-muted flex items-center">
                                <FaEnvelope className="mr-1 h-3 w-3" />
                                {feedback.userEmail}
                              </CardDescription>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteFeedback(feedback.id)}
                              className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
                            >
                              <FaTrash className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Rating */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-readable-muted">Avaliação</span>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <FaStar 
                                  key={i} 
                                  className={`h-4 w-4 ${i < feedback.rating ? 'text-[#00FA9A]' : 'text-slate-300'}`} 
                                />
                              ))}
                              <span className="ml-2 text-sm font-medium text-readable">
                                {feedback.rating}/5
                              </span>
                            </div>
                          </div>

                          <Separator className="bg-slate-200" />

                          {/* Comment */}
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <FaComments className="mr-2 h-3 w-3 text-[#00FA9A]" />
                              <span className="text-sm font-medium text-readable-muted">Comentário</span>
                            </div>
                            <p className="text-sm text-readable leading-relaxed bg-slate-50 p-3 rounded-lg border">
                              "{feedback.comment}"
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Pagination */}
          {pageCount > 1 && (
            <div className="flex justify-center mt-12">
              <ReactPaginate
                previousLabel={'← Anterior'}
                nextLabel={'Próximo →'}
                pageCount={pageCount}
                onPageChange={handlePageChange}
                containerClassName={'flex items-center space-x-2'}
                activeClassName={'bg-[#00FA9A] text-[#001a2c] border-[#00FA9A]'}
                previousClassName={'px-4 py-2 text-sm font-medium text-slate-700 bg-white border-2 border-slate-300 rounded-md hover:bg-slate-50 hover:border-[#00FA9A] transition-colors cursor-pointer'}
                nextClassName={'px-4 py-2 text-sm font-medium text-slate-700 bg-white border-2 border-slate-300 rounded-md hover:bg-slate-50 hover:border-[#00FA9A] transition-colors cursor-pointer'}
                pageClassName={'px-4 py-2 text-sm font-medium text-slate-700 bg-white border-2 border-slate-300 rounded-md hover:bg-slate-50 hover:border-[#00FA9A] transition-colors cursor-pointer'}
                breakClassName={'px-4 py-2 text-sm font-medium text-slate-500'}
                pageLinkClassName={'block'}
                previousLinkClassName={'block'}
                nextLinkClassName={'block'}
                breakLinkClassName={'block'}
                forcePage={currentPage}
              />
            </div>
          )}
        </main>
      </div>
    </AdminRoute>
  );
};

export default Feedback;
