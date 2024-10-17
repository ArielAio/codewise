import { useState } from 'react';
import Head from 'next/head';
import { db } from '../lib/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { FaTrash } from 'react-icons/fa';

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

      router.push('/cursos');
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-blue-900">
      <Head>
        <title>Adicionar Curso - CodeWise</title>
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4 text-center">Adicionar Novo Curso</h1>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <label className="block text-lg mb-2">Nome do Curso</label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Insira o Nome do Curso"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2">Descrição do Curso</label>
            <textarea
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Insira a Descrição do Curso"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2">Adicionar Aula</label>
            {youtubeLinks.map((link, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={link.title}
                  onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                  className="w-1/2 p-2 border border-gray-300 rounded mr-2"
                  placeholder="Título da Aula"
                  required
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                  className="w-1/2 p-2 border border-gray-300 rounded"
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
            ))}
            <button type="button" onClick={addLinkField} className="text-blue-600">
              Adicionar Outro Link
            </button>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Adicionar Curso
          </button>
        </form>
      </main>
    </div>
  );
}
