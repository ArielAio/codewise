import { useEffect, useState } from "react";
import { db } from "../lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { motion } from "framer-motion";
import LoadingSkeleton from "./LoadingSkeleton";
import { FaCheckCircle } from "react-icons/fa";

const CourseList = ({ searchTerm }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;

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

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length === 0 ? (
            <p className="text-center text-white w-full">
              Nenhum curso disponível no momento.
            </p>
          ) : (
            currentCourses.map((course) => (
              <motion.div
                key={course.id}
                className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 cursor-pointer relative"
                whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
              >
                <Link href={`/cursos/${course.id}`}>
                  <div className="w-full h-full">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-semibold text-[#001a2c] hover:underline mb-3 flex items-center">
                          {course.title}
                        </h2>
                        <p className="text-[#003a66] mt-2 whitespace-pre-wrap">
                          {course.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
        <div className="flex justify-center mt-8">
          {Array.from(
            { length: Math.ceil(courses.length / coursesPerPage) },
            (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-[#00FA9A] text-[#001a2c]"
                    : "bg-[#003a66] text-white"
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseList;
