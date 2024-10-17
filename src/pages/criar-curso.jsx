import { useState } from 'react';
import Head from 'next/head';
import { db } from '../lib/firebaseConfig'; // Importar a configuração do Firebase
import { collection, addDoc } from 'firebase/firestore'; // Importar funções do Firestore
import { useRouter } from 'next/router'; // Importar o hook useRouter do Next.js

export default function AddCourse() {
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState(''); // Novo estado para a descrição do curso
  const [youtubeLinks, setYoutubeLinks] = useState([{ title: '', url: '' }]); // Estado para armazenar múltiplos links com títulos
  const router = useRouter(); // Inicializa o router

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Adiciona o curso ao Firestore
      await addDoc(collection(db, 'cursos'), {
        title: courseName, // Salva apenas o nome do curso
        description: courseDescription, // Salva a descrição do curso
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
    <div className="min-h-screen bg-white text-[#001a33]">
      <Head>
        <title>Adicionar Curso - CodeWise</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-16 bg-[#001a33] py-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-4 text-[#00FA9A]">Adicionar Novo Curso</h1>
          <p className="text-xl text-white">Crie um novo curso para a plataforma CodeWise</p>
        </header>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="mb-6">
            <label className="block text-lg mb-2 font-semibold">Nome do Curso</label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FA9A]"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-lg mb-2 font-semibold">Descrição do Curso</label>
            <textarea
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FA9A]"
              placeholder="Descreva o conteúdo do curso"
              rows="4"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-lg mb-2 font-semibold">Links do YouTube</label>
            {youtubeLinks.map((link, index) => (
              <div key={index} className="flex mb-4">
                <input
                  type="text"
                  value={link.title}
                  onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                  className="w-1/2 p-3 border border-gray-300 rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-[#00FA9A]"
                  placeholder="Título do Link"
                  required
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                  className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FA9A]"
                  placeholder="Link do YouTube"
                  required
                />
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
  );
}
