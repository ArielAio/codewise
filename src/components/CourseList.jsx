import { useEffect, useState } from 'react';
import { db } from '../lib/firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Link from 'next/link';
import { FaTrash, FaEdit } from 'react-icons/fa';
import EditCourseModal from './EditCourseModal';

const CourseList = () => {
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Lista de Cursos</h1>
      <Link href="/criar-curso">
        <button className="mb-4 bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition duration-300">
          Criar Curso
        </button>
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-gray-300 h-32 rounded-lg animate-pulse"></div>
          ))
        ) : (
          courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105 cursor-pointer relative">
              <Link href={`/cursos/${course.id}`}>
                <h2 className="text-xl font-semibold text-blue-600 hover:underline">{course.title}</h2>
                <p className="text-gray-700 mt-2">{course.description}</p>
              </Link>
              <button 
                onClick={() => handleEdit(course)}
                className="absolute top-4 right-16 text-blue-500 hover:text-blue-700 focus:outline-none" 
                aria-label="Editar curso"
              >
                <FaEdit size={20} />
              </button>
              <button 
                onClick={() => handleDelete(course.id)} 
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 focus:outline-none" 
                aria-label="Excluir curso"
              >
                <FaTrash size={20} />
              </button>
            </div>
          ))
        )}
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

export default CourseList;
