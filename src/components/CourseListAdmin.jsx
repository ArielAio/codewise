import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaEdit, FaTrash, FaCheckCircle } from "react-icons/fa";
import EditCourseModal from "./EditCourseModal";
import LoadingSkeleton from "./LoadingSkeleton"; // Importando o componente de loading skeleton

const CourseListAdmin = ({ searchTerm }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  const fetchCourses = async () => {
    try {
      setLoading(true);
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

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const totalPages = Math.ceil(courses.length / coursesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 rounded-lg shadow ${
            currentPage === i
              ? "bg-[#00FA9A] text-[#001a2c]"
              : "bg-[#001a2c] text-[#00FA9A]"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const handleEdit = (course) => {
    setCurrentCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const courseDoc = doc(db, "cursos", id);
      await deleteDoc(courseDoc);
      setCourses(courses.filter((course) => course.id !== id));
      console.log("Curso excluído:", id);
    } catch (error) {
      console.error("Erro ao excluir curso:", error);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Link href="/criar-curso">
          <motion.button
            className="mb-8 bg-[#00FA9A] text-[#001a2c] px-6 py-3 rounded-lg shadow hover:bg-[#33FBB1] transition duration-300 font-medium text-lg"
            whileHover={{ scale: 1.05, transition: { duration: 0 } }}
            whileTap={{ scale: 0.95, transition: { duration: 0 } }}
          >
            Criar Curso
          </motion.button>
        </Link>
        {currentCourses.length === 0 ? (
          <p className="text-center text-white">
            Nenhum curso disponível no momento.
          </p>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCourses.map((course) => (
                <motion.div
                  key={course.id}
                  className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 cursor-pointer relative"
                  whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
                >
                  <Link href={`/cursos/${course.id}`}>
                    <div className="w-full h-full">
                      <div className="flex flex-col">
                        <div className="flex items-start justify-between">
                          <h2 className="text-2xl font-semibold text-[#001a2c] hover:underline flex items-center">
                            {course.title}
                          </h2>
                        </div>
                        <p className="text-[#003a66] mt-2 whitespace-pre-wrap">
                          {course.description}
                        </p>
                      </div>
                    </div>
                  </Link>

                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="text-[#001a2c] hover:text-[#00FA9A] focus:outline-none"
                      aria-label="Editar curso"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-400 hover:text-red-600 focus:outline-none"
                      aria-label="Excluir curso"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              {renderPageNumbers()}
            </div>
          </div>
        )}
      </div>
      {isModalOpen && (
        <EditCourseModal
          course={currentCourse}
          onClose={() => setIsModalOpen(false)}
          onRefresh={fetchCourses} // Pass fetchCourses directly
        />
      )}
    </div>
  );
};

export default CourseListAdmin;
