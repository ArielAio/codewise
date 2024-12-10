import React, { useState, useEffect } from 'react';
import { db } from "../lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { motion } from 'framer-motion';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import LoadingSkeleton from "./LoadingSkeleton";

const CourseList = ({ searchTerm }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // Adjust this number as needed

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
        <Link href="/criar-curso">
          <motion.button
            className="mb-8 bg-[#00FA9A] text-[#001a2c] px-6 py-3 rounded-lg shadow hover:bg-[#33FBB1] transition duration-300 font-medium text-lg"
            whileHover={{ scale: 1.05, transition: { duration: 0 } }}
            whileTap={{ scale: 0.95, transition: { duration: 0 } }}
          >
            Criar Curso
          </motion.button>
        </Link>
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
    </div>
  );
};

export default CourseList;
