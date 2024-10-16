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
        setCourses(coursesList); // Atualiza o estado com a lista de cursos
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Lista de Cursos</h1>
      <Link href="/criar-curso">
        <button className="mb-4 bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition duration-300">
          Criar Curso
        </button>
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? ( // Verifica se está carregando
          Array.from({ length: 6 }).map((_, index) => ( // Gera 6 skeletons
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
    </div>
  );
};

export default CourseList;
