import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import AdminRoute from "../../components/AdminRoute";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import ReactPaginate from 'react-paginate';
import Head from "next/head";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { FaUsers, FaGraduationCap, FaTrash, FaClock } from "react-icons/fa";

export default function UserProgress() {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const progressCollection = collection(db, "userProgress");
        const progressSnapshot = await getDocs(progressCollection);
        const progressList = progressSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProgressData(progressList);
      } catch (error) {
        console.error("Erro ao buscar dados de progresso:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "userProgress", id));
      setProgressData(progressData.filter(progress => progress.id !== id));
    } catch (error) {
      console.error("Erro ao deletar dados de progresso:", error);
    }
  };

  const filteredData = progressData.filter(progress => {
    const matchesSearchTerm = progress.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse ? progress.courseName === selectedCourse : true;
    return matchesSearchTerm && matchesCourse;
  });

  const uniqueCourses = [...new Set(progressData.map(progress => progress.courseName))];

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredData.slice(offset, offset + itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  if (loading) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30">
          <Head>
            <title>Monitoramento - CodeWise</title>
          </Head>
          <main className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 bg-[#00FA9A]/15 border-[#00FA9A]/40 text-[#001a2c] font-semibold">
                📊 Carregando dados...
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-slate-800">
                <span className="codewise-text-gradient">Monitoramento</span> do Sistema
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Acompanhe o progresso dos estudantes e gerencie dados da plataforma
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30">
        <Head>
          <title>Monitoramento - CodeWise</title>
        </Head>
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 bg-[#00FA9A]/15 border-[#00FA9A]/40 text-[#001a2c] font-semibold">
              📊 Administração do Sistema
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-slate-800">
              <span className="codewise-text-gradient">Monitoramento</span> do Sistema
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              Acompanhe o progresso dos estudantes e gerencie dados da plataforma
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
              <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00FA9A] h-4 w-4" />
            </div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#00FA9A] focus:ring-2 focus:ring-[#00FA9A]/20 transition-colors text-slate-800 w-full sm:min-w-[200px] sm:w-auto bg-white shadow-sm"
            >
              <option value="">Todos os cursos</option>
              {uniqueCourses.map((course, index) => (
                <option key={index} value={course}>{course}</option>
              ))}
            </select>
          </div>

          {filteredData.length === 0 ? (
            <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-xl border border-slate-200/50">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-semibold mb-2 text-slate-800">Nenhum dado encontrado</h3>
              <p className="text-slate-600">
                Não há dados de progresso disponíveis com os filtros selecionados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((progress, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-2 border-slate-200/60 hover:border-[#00FA9A]/60 group hover:shadow-xl transition-all duration-300 hover:bg-white">
                  <CardHeader className="pb-3 bg-gradient-to-r from-slate-50/50 to-green-50/30 rounded-t-lg">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg text-slate-800 font-bold flex items-center">
                          <FaUsers className="mr-2 h-4 w-4 text-[#00FA9A]" />
                          {progress.userName}
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-600">
                          {progress.userEmail}
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(progress.id)}
                        className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
                      >
                        <FaTrash className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-slate-700 bg-slate-50/50 p-2 rounded-md">
                        <FaGraduationCap className="mr-2 h-3 w-3 text-[#00FA9A]" />
                        <span className="font-medium">{progress.courseName}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 font-medium">Progresso do curso</span>
                        <Badge variant="secondary" className="bg-[#00FA9A]/20 text-[#001a2c] border border-[#00FA9A]/40 font-semibold">
                          {Math.round((progress.completedLessons / progress.totalLessons) * 100)}%
                        </Badge>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-600">
                          <span>{progress.completedLessons} de {progress.totalLessons} aulas</span>
                          <span className="font-medium">{Math.round((progress.completedLessons / progress.totalLessons) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-200/70 rounded-full h-3 shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-[#00FA9A] to-[#33FBB1] h-3 rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${(progress.completedLessons / progress.totalLessons) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-slate-300/60" />

                    <div className="text-xs text-slate-600 flex items-center bg-slate-50/40 p-2 rounded-md">
                      <FaClock className="mr-1 h-3 w-3 text-[#00FA9A]" />
                      <span>Dados atualizados em tempo real</span>
                    </div>
                  </CardContent>
                </Card>
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
}