

import { useEffect, useState } from 'react';
import { db } from '../lib/firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Link from 'next/link';
import { FaTrash, FaEdit } from 'react-icons/fa';
import EditCourseModal from './EditCourseModal';
import { motion } from 'framer-motion'; // Importando a biblioteca de animação

const CourseListAdmin = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  const fetchCourses = async () => {
    try {
      const coursesCollection = collection(db, 'cursos');
      const coursesSnapshot = await getDocs(coursesCollection);
      const coursesList = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(coursesList);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    try {
      const courseDoc = doc(db, 'cursos', id);
      await deleteDoc(courseDoc);
      setCourses(courses.filter(course => course.id !== id));
      console.log('Curso excluído:', id);
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
    }
  };

  const handleEdit = (course) => {
    setCurrentCourse(course);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto bg-[#001a2c] rounded-3xl shadow-2xl overflow-hidden my-8">
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-4 text-center text-[#00FA9A]">Lista de Cursos</h1>
        <p className="text-center text-white mb-8">Explore nossa seleção de cursos e comece sua jornada de aprendizado</p>
        <Link href="/criar-curso">
          <motion.button // Alterado para motion.button
            className="mb-8 bg-[#00FA9A] text-[#001a2c] px-6 py-3 rounded-lg shadow hover:bg-[#33FBB1] transition duration-300 font-medium text-lg"
            whileHover={{ scale: 1.05, transition: { duration: 0 } }} // Aumenta instantaneamente ao passar o mouse
            whileTap={{ scale: 0.95, transition: { duration: 0 } }} // Diminui instantaneamente ao clicar
          >
            Criar Curso
          </motion.button>
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white h-48 rounded-lg animate-pulse"></div>
            ))
          ) : (
            courses.map((course) => (
              <motion.div // Alterado para motion.div
                key={course.id}
                className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 cursor-pointer relative"
                whileTap={{ scale: 0.95, transition: { duration: 0.1 } }} // Animação de clique mais rápida
              >
                <Link href={`/cursos/${course.id}`}>
                  <h2 className="text-2xl font-semibold text-[#001a2c] hover:underline mb-3">{course.title}</h2>
                  <p className="text-[#003a66] mt-2">{course.description}</p>
                </Link>
                <button
                  onClick={() => handleEdit(course)}
                  className="absolute top-4 right-12 text-[#001a2c] hover:text-[#00FA9A] focus:outline-none"
                  aria-label="Editar curso"
                >
                  <FaEdit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-600 focus:outline-none"
                  aria-label="Excluir curso"
                >
                  <FaTrash size={20} />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>
      {isModalOpen && (
        <EditCourseModal
          course={currentCourse}
          onClose={() => setIsModalOpen(false)}
          onRefresh={fetchCourses}
        />
      )}
    </div>
  );
};

export default CourseListAdmin;
