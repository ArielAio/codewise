import { useEffect, useState } from 'react';
import { db } from '../lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { motion } from 'framer-motion'; // Importando a biblioteca de animação
import LoadingSkeleton from './LoadingSkeleton'; // Importando o componente de loading skeleton

const CourseList = ({ searchTerm }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto bg-[#001a2c] rounded-3xl shadow-2xl overflow-hidden my-8 p-8">
        <h1 className="text-4xl font-bold mb-4 text-center text-[#00FA9A]">Lista de Cursos</h1>
        <p className="text-center text-white mb-8">Explore nossa seleção de cursos e comece sua jornada de aprendizado</p>
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
        <h1 className="text-4xl font-bold mb-4 text-center text-[#00FA9A]">Lista de Cursos</h1>
        <p className="text-center text-white mb-8">Explore nossa seleção de cursos e comece sua jornada de aprendizado</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length === 0 ? (
            <p className="text-center text-white w-full">Nenhum curso disponível no momento.</p>
          ) : (
            filteredCourses.map((course) => (
              <motion.div // Alterado para motion.div
                key={course.id}
                className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 cursor-pointer relative"
                whileTap={{ scale: 0.95, transition: { duration: 0.1 } }} // Animação de clique mais rápida
              >
                <Link href={`/cursos/${course.id}`}>
                  <h2 className="text-2xl font-semibold text-[#001a2c] hover:underline mb-3">{course.title}</h2>
                  <p className="text-[#003a66] mt-2">{course.description}</p>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseList;

