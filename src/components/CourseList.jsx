import { useEffect, useState } from 'react';
import { db } from '../lib/firebaseConfig'; // Importar a configuração do Firebase
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Importar funções do Firestore
import Link from 'next/link'; // Importar o componente Link do Next.js
import { FaTrash } from 'react-icons/fa'; // Importar o ícone de lixeira

const CourseList = () => {
  const [courses, setCourses] = useState([]); // Estado para armazenar os cursos
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesCollection = collection(db, 'cursos'); // Nome da coleção no Firestore
        const coursesSnapshot = await getDocs(coursesCollection);
        const coursesList = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(coursesList); // Atualiza o estado com a lista de curso
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
      } finally {
        setLoading(false); // Define loading como false após a busca
      }
    };

    fetchCourses(); // Chama a função para buscar os cursos
  }, []); // O array vazio significa que o efeito será executado apenas uma vez após a montagem do componente

  const handleDelete = async (id) => {
    try {
      const courseDoc = doc(db, 'cursos', id); // Referência ao documento do curso
      await deleteDoc(courseDoc); // Exclui o documento do Firestore
      setCourses(courses.filter(course => course.id !== id)); // Atualiza a lista de cursos localmente
      console.log('Curso excluído:', id);
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
    }
  };

  return (
    <div className="container mx-auto bg-[#002b4d] rounded-3xl shadow-2xl overflow-hidden my-8">
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-[#00FA9A]">Lista de Cursos</h1>
        <Link href="/criar-curso">
          <button className="mb-8 bg-[#00FA9A] text-[#001a33] px-6 py-3 rounded-lg shadow hover:bg-[#33FBB1] transition duration-300 font-medium text-lg">
            Criar Curso
          </button>
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-[#003a66] h-48 rounded-lg animate-pulse"></div>
            ))
          ) : (
            courses.map((course) => (
              <div key={course.id} className="bg-[#003a66] rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 cursor-pointer relative">
                <Link href={`/cursos/${course.id}`}>
                  <h2 className="text-2xl font-semibold text-[#00FA9A] hover:underline mb-3">{course.title}</h2>
                  <p className="text-[#b3e6cc] mt-2">{course.description}</p>
                </Link>
                <button 
                  onClick={() => handleDelete(course.id)} 
                  className="absolute top-4 right-4 text-red-400 hover:text-red-600 focus:outline-none" 
                  aria-label="Excluir curso"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseList;
