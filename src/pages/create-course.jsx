import { useState } from 'react';
import Head from 'next/head';
import { db } from '../lib/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { FaTrash } from 'react-icons/fa';
import AdminRoute from '../components/AdminRoute';


export default function AddCourse() {
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [youtubeLinks, setYoutubeLinks] = useState([{ title: '', url: '' }]);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uniqueLinks = youtubeLinks.filter((link, index, self) =>
        index === self.findIndex((l) => l.url === link.url)
      );

      if (uniqueLinks.length < youtubeLinks.length) {
        throw new Error('Não é permitido cadastrar duas aulas com o mesmo link do YouTube.');
      }

      await addDoc(collection(db, 'cursos'), {
        title: courseName,
        description: courseDescription,
        youtubeLinks: uniqueLinks.filter(link => link.title && link.url),
      });
      console.log('Curso Adicionado:', { title: courseName, youtubeLinks });
      setCourseName('');
      setYoutubeLinks([{ title: '', url: '' }]);

      router.push('/courses');
    } catch (error) {
      console.error('Erro ao adicionar curso:', error);
      alert(error.message);
    }
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...youtubeLinks];
    newLinks[index][field] = value;
    setYoutubeLinks(newLinks);
  };

  const addLinkField = () => {
    setYoutubeLinks([...youtubeLinks, { title: '', url: '' }]);
  };

  const removeLinkField = (index) => {
    const newLinks = youtubeLinks.filter((_, i) => i !== index);
    setYoutubeLinks(newLinks);
  };

  const isValidYouTubeUrl = (url) => {
    const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    return regex.test(url);
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-white text-[#001a33]">
        <Head>
          <title>Adicionar Curso - CodeWise</title>
        </Head>

        <main className="container mx-auto px-4 py-8">
          <header className="text-center mb-16 bg-[#001a33] py-8 rounded-lg">
            <h1 className="text-4xl font-bold mb-4 text-[#00FA9A]">Adicionar Novo Curso</h1>
            <p className="text-xl text-white">Crie um novo curso para a plataforma CodeWise</p>
          </header>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-[#001a33] p-8 rounded-lg shadow-md text-white">
            <div className="mb-6">
              <label className="block text-lg mb-2 font-semibold">Nome do Curso</label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FA9A] text-[#001a33]"
                placeholder='Insira o Nome do Curso'
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-lg mb-2 font-semibold">Descrição do Curso</label>
              <textarea
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FA9A] text-[#001a33]"
                placeholder="Descreva o conteúdo do curso"
                rows="4"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-lg mb-2 font-semibold">Adicionar Aula</label>

              {youtubeLinks.map((link, index) => (
                <div key={index} className="mb-4">
                  <div className="flex">
                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                      className="w-1/2 p-3 border border-gray-300 rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-[#00FA9A] text-[#001a33]"
                      placeholder="Título da Aula"
                      required
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                      className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FA9A] text-[#001a33]"
                      placeholder="Link do YouTube"
                      required
                    />
                    {index > 0 && (
                      <button type="button" onClick={() => removeLinkField(index)} className="text-red-600 ml-2 flex items-center">
                        <FaTrash className="h-5 w-5 mr-1" />
                        Remover
                      </button>
                    )}
                  </div>

                  {isValidYouTubeUrl(link.url) && (
                    <div className="mt-4">
                      <iframe
                        width="560"
                        height="315"
                        src={getYouTubeEmbedUrl(link.url)}
                        title={link.title || `Vídeo ${index + 1}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full"
                      ></iframe>
                    </div>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addLinkField}
                className="text-[#00FA9A] font-semibold hover:text-[#33FBB1] transition-colors duration-300"
              >
                + Adicionar Outro Link
              </button>
            </div>
            <button
              type="submit"
              className="bg-[#00FA9A] text-[#001a33] px-8 py-3 rounded-full text-xl font-bold inline-block transition-all duration-300 hover:bg-[#33FBB1] hover:shadow-lg transform hover:-translate-y-1 hover:scale-105"
            >
              Adicionar Curso
            </button>
          </form>
        </main>

        <footer className="text-center py-8 bg-[#001a33] text-white mt-16">
          <p>&copy; 2023 CodeWise. Transformando vidas através da programação.</p>
        </footer>
      </div>
    </AdminRoute>
  );
}
