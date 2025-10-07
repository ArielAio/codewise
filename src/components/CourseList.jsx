import React, { useState, useEffect } from 'react';
import { db } from "../lib/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ReactPaginate from 'react-paginate';
import LoadingSkeleton from "./LoadingSkeleton";
import ExpandableDescription from "./ExpandableDescription";
import { FaEdit, FaTrash, FaPlus, FaPlay, FaClock, FaUsers } from "react-icons/fa";
import EditCourseModal from "./EditCourseModal";
import { useAuth } from "../lib/AuthContext";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

// Função para extrair o ID do vídeo do YouTube
const getYouTubeVideoId = (url) => {
  try {
    // Para URLs como https://www.youtube.com/watch?v=VIDEO_ID
    const urlParams = new URL(url).searchParams;
    const videoId = urlParams.get("v");
    if (videoId) return videoId;
    
    // Para URLs como https://youtu.be/VIDEO_ID
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao extrair ID do vídeo:', error);
    return null;
  }
};

const CourseList = ({ searchTerm }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  const itemsPerPage = 5;

  // Verifica se o usuário é admin
  const isAdmin = user && user.permission === 'admin';

  const fetchCourses = async () => {
    try {
      const coursesCollection = collection(db, "cursos");
      const coursesSnapshot = await getDocs(coursesCollection);
      const coursesList = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(coursesList);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Resetar página quando o filtro de busca mudar
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredCourses.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredCourses.slice(offset, offset + itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Funções administrativas
  const handleEdit = (course) => {
    setCurrentCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este curso?')) {
      try {
        const courseDoc = doc(db, "cursos", id);
        await deleteDoc(courseDoc);
        setCourses(courses.filter((course) => course.id !== id));
        console.log("Curso excluído:", id);
      } catch (error) {
        console.error("Erro ao excluir curso:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Nossos Cursos
          </h1>
          <p className="text-xl text-slate-700 max-w-2xl mx-auto">
            Explore nossa seleção de cursos e comece sua jornada de aprendizado
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4 bg-[#00FA9A]/10 border-[#00FA9A]/30 text-black font-semibold">
          📚 {isAdmin ? "Administração de" : "Explore nossos"} Cursos
        </Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-readable">
          {isAdmin ? "Gerenciar" : "Nossos"} <span className="codewise-text-gradient">Cursos</span>
        </h1>
        <p className="text-lg sm:text-xl text-readable-muted max-w-2xl mx-auto px-4">
          {isAdmin 
            ? "Gerencie, edite e monitore todos os cursos da plataforma"
            : "Explore nossa seleção cuidadosamente curada de cursos práticos e transforme sua carreira"
          }
        </p>
      </div>
      
      {/* Admin Create Course Button */}
      {isAdmin && (
        <div className="flex justify-center mb-12">
          <Button size="lg" className="codewise-button-primary font-semibold" asChild>
            <Link href="/create-course" className="flex items-center">
              <FaPlus className="mr-2 h-4 w-4" />
              Criar Novo Curso
            </Link>
          </Button>
        </div>
      )}
      
      {filteredCourses.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-semibold mb-2 text-readable">Nenhum curso encontrado</h3>
          <p className="text-readable-muted">
            {isAdmin 
              ? "Comece criando seu primeiro curso!"
              : "Novos cursos serão adicionados em breve."
            }
          </p>
          {isAdmin && (
            <Button className="mt-6 codewise-button-primary font-semibold" asChild>
              <Link href="/create-course">
                <FaPlus className="mr-2 h-4 w-4" />
                Criar Primeiro Curso
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-12">
          {/* Courses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {currentItems.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/courses/${course.id}`} className="block">
                  <Card 
                    className="bg-white/90 backdrop-blur-sm border-2 border-slate-200/60 hover:border-[#00FA9A]/60 group h-full cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden hover:bg-white"
                  >
                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-40 flex space-x-1 sm:space-x-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEdit(course);
                          }}
                          className="admin-button codewise-button-secondary shadow-lg"
                        >
                          <FaEdit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(course.id);
                          }}
                          className="admin-button bg-red-500 hover:bg-red-600 shadow-lg text-white"
                        >
                          <FaTrash className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                  <CardHeader className="pb-3 bg-gradient-to-r from-slate-50/50 to-green-50/30 rounded-t-lg">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <CardTitle className="text-lg sm:text-xl leading-tight group-hover:text-[#00FA9A] transition-colors duration-200 text-slate-800 font-bold">
                          {course.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-slate-600">
                          <div className="flex items-center bg-white/60 px-2 py-1 rounded-md">
                            <FaClock className="mr-1 h-3 w-3 text-[#00FA9A]" />
                            <span className="font-medium">{course.youtubeLinks?.length || 0} aulas</span>
                          </div>
                          <div className="flex items-center bg-white/60 px-2 py-1 rounded-md">
                            <FaUsers className="mr-1 h-3 w-3 text-[#00FA9A]" />
                            <span className="font-medium">Iniciante</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Course Thumbnail */}
                  {course.youtubeLinks && course.youtubeLinks.length > 0 && course.youtubeLinks[0].url && (
                    <div className="px-6 mb-4">
                      <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-300 shadow-sm">
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeVideoId(course.youtubeLinks[0].url)}?autoplay=0&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&enablejsapi=0`}
                          title="Preview do curso"
                          className="w-full h-full pointer-events-none"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen={false}
                          style={{ 
                            pointerEvents: 'none',
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                            MozUserSelect: 'none',
                            msUserSelect: 'none'
                          }}
                          tabIndex="-1"
                        />
                        {/* Play overlay */}
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="bg-white/95 rounded-full p-3 shadow-lg">
                            <FaPlay className="h-6 w-6 text-[#001a2c]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <CardContent className="space-y-4">
                    <div className="bg-slate-50/50 p-3 rounded-md">
                      <ExpandableDescription 
                        description={course.description}
                        maxLength={120}
                        maxHeight="60px"
                        className="text-sm"
                        buttonClassName="text-xs"
                      />
                    </div>
                    
                    <Separator className="bg-slate-300/60" />
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-[#00FA9A]/20 text-[#001a2c] border border-[#00FA9A]/40 font-semibold">
                        Programação
                      </Badge>
                      <div className="text-sm text-slate-700 font-medium bg-slate-100/60 px-3 py-1 rounded-md">
                        Clique para acessar
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              </motion.div>
            ))}
          </div>

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
                pageLinkClassName={'block w-full h-full'}
                previousLinkClassName={'block w-full h-full'}
                nextLinkClassName={'block w-full h-full'}
                breakLinkClassName={'block w-full h-full'}
                forcePage={currentPage}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
              />
            </div>
          )}
        </div>
      )}
      
      {/* Edit Course Modal */}
      {isAdmin && isModalOpen && (
        <EditCourseModal
          course={currentCourse}
          onClose={() => setIsModalOpen(false)}
          onRefresh={fetchCourses}
        />
      )}
    </div>
  );
};

export default CourseList;
