import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import AdminRoute from "../../components/AdminRoute";
import LoadingSkeleton from "../../components/LoadingSkeleton"; // Importando o componente de loading skeleton
import ReactPaginate from 'react-paginate';

const UserProgress = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12; // Adjust this number as needed

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const progressCollection = collection(db, "userProgress");
        const progressSnapshot = await getDocs(progressCollection);
        const progressList = progressSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProgressData(progressList);
      } catch (error) {
        console.error("Erro ao buscar dados de progresso:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "userProgress", id));
      setProgressData(progressData.filter(progress => progress.id !== id));
    } catch (error) {
      console.error("Erro ao deletar dados de progresso:", error);
    }
  };

  const filteredData = progressData.filter(progress => {
    const matchesSearchTerm = progress.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse ? progress.courseName === selectedCourse : true;
    return matchesSearchTerm && matchesCourse;
  });

  const uniqueCourses = [...new Set(progressData.map(progress => progress.courseName))];

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredData.slice(offset, offset + itemsPerPage);

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
      <AdminRoute>
        <div className="min-h-screen bg-white text-[#001a33]">
          <main className="container mx-auto px-4 py-16">
            <h2 className="text-4xl font-bold mb-8 text-center text-[#001a33]">
              Monitoramento de Progresso dos Usuários
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <LoadingSkeleton key={index} />
              ))}
            </div>
          </main>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-white text-[#001a33]">
        <main className="container mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold mb-8 text-center text-[#001a33]">
            Monitoramento de Progresso dos Usuários
          </h2>
          <div className="mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <input
              type="text"
              placeholder="Buscar por nome de usuário"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full md:w-auto"
            />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full md:w-auto"
            >
              <option value="">Todos os cursos</option>
              {uniqueCourses.map((course, index) => (
                <option key={index} value={course}>{course}</option>
              ))}
            </select>
          </div>
          <div className="bg-[#001a33] p-8 rounded-lg shadow-lg">
            {filteredData.length === 0 ? (
              <p className="text-center text-red-500">Nenhum dado de progresso encontrado.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {currentItems.map((progress, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-md text-[#001a33] relative">
                    <p><strong>Usuário:</strong> {progress.userName}</p>
                    <p><strong>Email:</strong> {progress.userEmail}</p>

                    <p><strong>Curso:</strong> {progress.courseName}</p>
                    <p><strong>Aulas Completas:</strong> {progress.completedLessons} de {progress.totalLessons}</p>
                    <p><strong>Progresso:</strong> {((progress.completedLessons / progress.totalLessons) * 100).toFixed(2)}%</p>
                    <button
                      onClick={() => handleDelete(progress.id)}
                      className="absolute top-4 right-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-200"
                    >
                      Deletar
                    </button>
                  </div>
                ))}
              </div>
            )}
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
        </main>
      </div>
      <style>{paginationStyles}</style>
    </AdminRoute>
  );
};

export default UserProgress;