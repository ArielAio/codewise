import React, { useState, useEffect } from 'react';
import { db } from "../lib/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { motion } from 'framer-motion';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import LoadingSkeleton from "./LoadingSkeleton";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import EditCourseModal from "./EditCourseModal";
import { useAuth } from "../lib/AuthContext";

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

// Função para truncar texto
const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

const CourseList = ({ searchTerm }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const { user } = useAuth();
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

  // Função para navegar para o curso
  const handleCourseClick = (courseId, event) => {
    // Previne navegação se clicou em botões administrativos
    if (event && event.target.closest('.admin-button')) {
      return;
    }
    window.location.href = `/courses/${courseId}`;
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
      background: #001a2c;
      color: #00FA9A;
      cursor: pointer;
      transition: all 0.2s;
    }

    .active .page-link {
      background: #00FA9A;
      color: #001a2c;
    }

    .page-link:hover {
      transform: translateY(-2px);
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.75rem;
      max-height: 3.5rem;
    }
  `;

  if (loading) {
    return (
      <div className="container mx-auto bg-[#001a2c] rounded-3xl shadow-2xl overflow-hidden my-8 p-8">
        <h1 className="text-4xl font-bold mb-4 text-center text-[#00FA9A]">
          Lista de Cursos
        </h1>
        <p className="text-center text-white mb-8">
          Explore nossa seleção de cursos e comece sua jornada de aprendizado
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto bg-[#001a2c] rounded-3xl shadow-2xl overflow-hidden my-8">
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-4 text-center text-[#00FA9A]">
          Lista de Cursos
        </h1>
        <p className="text-center text-white mb-8">
          Explore nossa seleção de cursos e comece sua jornada de aprendizado
        </p>
        
        {/* Botão Criar Curso - apenas para admins */}
        {isAdmin && (
          <Link href="/create-course">
            <motion.button
              className="mb-8 bg-[#00FA9A] text-[#001a2c] px-6 py-3 rounded-lg shadow hover:bg-[#33FBB1] transition duration-300 font-medium text-lg flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05, transition: { duration: 0 } }}
              whileTap={{ scale: 0.95, transition: { duration: 0 } }}
            >
              <FaPlus /> Criar Curso
            </motion.button>
          </Link>
        )}
        
        {filteredCourses.length === 0 ? (
          <p className="text-center text-white">
            Nenhum curso disponível no momento.
          </p>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((course) => (
                <motion.div
                  key={course.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer relative h-[500px] flex flex-col"
                  whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
                  onClick={(e) => handleCourseClick(course.id, e)}
                >
                  {/* Título do curso */}
                  <div className="p-4 pb-2">
                    <h2 className="text-xl font-bold text-[#001a2c] text-center line-clamp-2 min-h-[3.5rem] flex items-center justify-center">
                      {course.title}
                    </h2>
                  </div>

                  {/* Botões administrativos - apenas para admins */}
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex space-x-2 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(course);
                        }}
                        className="admin-button text-[#001a2c] hover:text-[#00FA9A] focus:outline-none bg-white p-2 rounded-full shadow-md transition-colors"
                        aria-label="Editar curso"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(course.id);
                        }}
                        className="admin-button text-red-400 hover:text-red-600 focus:outline-none bg-white p-2 rounded-full shadow-md transition-colors"
                        aria-label="Excluir curso"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  )}

                  {/* Thumbnail da primeira aula - SEM INTERAÇÃO */}
                  {course.youtubeLinks && course.youtubeLinks.length > 0 && course.youtubeLinks[0].url && (
                    <div className="px-4 pb-2">
                      <div className="relative aspect-video bg-gray-100 rounded overflow-hidden">
                        {/* Overlay para prevenir qualquer interação */}
                        <div className="absolute inset-0 z-20 bg-transparent cursor-pointer"></div>
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeVideoId(course.youtubeLinks[0].url)}?autoplay=0&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&enablejsapi=0`}
                          title="Thumbnail do curso"
                          className="w-full h-full rounded border-2 border-[#00FA9A]"
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
                      </div>
                    </div>
                  )}

                  {/* Descrição */}
                  <div className="flex-1 px-4 pb-4 flex flex-col justify-between">
                    <div>
                      <p className="text-[#003a66] text-sm leading-relaxed text-justify mb-4">
                        {truncateText(course.description, 150)}
                      </p>
                    </div>
                    
                    {/* Indicador visual de clique */}
                    <div className="mt-auto">
                      <div className="w-full bg-[#001a2c] text-[#00FA9A] px-4 py-2 rounded text-center hover:bg-[#003366] transition-colors duration-300 font-medium">
                        Clique para Ver Curso
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <ReactPaginate
              previousLabel={'Anterior'}
              nextLabel={'Próximo'}
              pageCount={pageCount}
              onPageChange={handlePageChange}
              containerClassName={'pagination'}
              activeClassName={'active'}
              previousClassName={'page-item'}
              nextClassName={'page-item'}
              pageClassName={'page-item'}
              breakClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousLinkClassName={'page-link'}
              nextLinkClassName={'page-link'}
              breakLinkClassName={'page-link'}
            />
          </div>
        )}
      </div>
      <style>{paginationStyles}</style>
      
      {/* Modal de edição - apenas para admins */}
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
