import { useState } from 'react';
import Head from 'next/head';
import { db } from '../lib/firebaseConfig'; // Importar a configuração do Firebase
import { collection, addDoc } from 'firebase/firestore'; // Importar funções do Firestore
import { useRouter } from 'next/router'; // Importar o hook useRouter do Next.js

export default function AddCourse() {
  const [courseName, setCourseName] = useState('');
  const [youtubeLinks, setYoutubeLinks] = useState([{ title: '', url: '' }]); // Estado para armazenar múltiplos links com títulos
  const router = useRouter(); // Inicializa o router

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Adiciona o curso ao Firestore
      await addDoc(collection(db, 'cursos'), {
        title: courseName, // Salva apenas o nome do curso
        youtubeLinks: youtubeLinks.filter(link => link.title && link.url), // Salva os links do YouTube, removendo entradas vazias
      });
      console.log('Curso Adicionado:', { title: courseName, youtubeLinks });
      setCourseName(''); // Limpa o campo após o envio
      setYoutubeLinks([{ title: '', url: '' }]); // Limpa os campos de links do YouTube

      // Redireciona para a página de cursos
      router.push('/cursos'); // Redireciona para /cursos
    } catch (error) {
      console.error('Erro ao adicionar curso:', error);
    }
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...youtubeLinks];
    newLinks[index][field] = value; // Atualiza o campo específico (title ou url)
    setYoutubeLinks(newLinks);
  };

  const addLinkField = () => {
    setYoutubeLinks([...youtubeLinks, { title: '', url: '' }]); // Adiciona um novo campo de link
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
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2">Links do YouTube</label>
            {youtubeLinks.map((link, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={link.title}
                  onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                  className="w-1/2 p-2 border border-gray-300 rounded mr-2"
                  placeholder="Título do Link"
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
