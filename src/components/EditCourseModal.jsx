import { useState, useEffect, useRef } from 'react';
import { db } from '../lib/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { FaTrash } from 'react-icons/fa';

const EditCourseModal = ({ course, onClose, onRefresh }) => {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [youtubeLinks, setYoutubeLinks] = useState(course.youtubeLinks || []);
  const modalRef = useRef();

  useEffect(() => {
    setTitle(course.title);
    setDescription(course.description);
    setYoutubeLinks(course.youtubeLinks || []);
  }, [course]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const courseDoc = doc(db, 'cursos', course.id);
      await updateDoc(courseDoc, { title, description, youtubeLinks });
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Erro ao editar curso:', error);
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

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div ref={modalRef} className="bg-[#00264d] p-8 rounded-lg shadow-xl max-w-3xl w-full m-4 overflow-y-auto max-h-[80vh]">
        <h2 className="text-3xl font-bold mb-6 text-[#00ffaa]">Editar Curso</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#00ffaa] text-lg font-semibold mb-2">Título</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="border border-[#00ffaa] bg-white rounded-lg w-full py-3 px-4 text-[#00264d] focus:outline-none focus:ring-2 focus:ring-[#00ffaa]" 
              required 
            />
          </div>
          <div>
            <label className="block text-[#00ffaa] text-lg font-semibold mb-2">Descrição</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="border border-[#00ffaa] bg-white rounded-lg w-full py-3 px-4 text-[#00264d] focus:outline-none focus:ring-2 focus:ring-[#00ffaa]" 
              rows="4"
              required 
            />
          </div>
          <div>
            <label className="block text-xl font-semibold mb-4 text-[#00ffaa]">Aulas</label>
            {youtubeLinks.map((link, index) => (
              <div key={index} className="flex mb-3">
                <input
                  type="text"
                  value={link.title}
                  onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                  className="w-1/2 p-3 border border-[#00ffaa] bg-white rounded-lg mr-2 text-[#00264d] focus:outline-none focus:ring-2 focus:ring-[#00ffaa]"
                  placeholder="Título da Aula"
                  required
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                  className="w-1/2 p-3 border border-[#00ffaa] bg-white rounded-lg text-[#00264d] focus:outline-none focus:ring-2 focus:ring-[#00ffaa]"
                  placeholder="Link do YouTube"
                  required
                />
                {index > 0 && (
                  <button type="button" onClick={() => removeLinkField(index)} className="text-red-400 ml-2 flex items-center hover:text-red-300 transition-colors">
                    <FaTrash className="h-5 w-5 mr-1" />
                    Remover
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addLinkField} className="text-[#00ffaa] font-semibold hover:text-[#33ffbb] transition-colors text-lg">
              + Adicionar Nova Aula
            </button>
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button type="button" onClick={onClose} className="px-6 py-3 border border-[#00ffaa] rounded-lg text-[#00ffaa] font-semibold hover:bg-[#004d99] transition-colors">Cancelar</button>
            <button type="submit" className="px-6 py-3 bg-[#00ffaa] text-[#00264d] rounded-lg font-semibold hover:bg-[#33ffbb] transition-colors">Salvar Alterações</button>
          </div>
        </form>
        {/* Pré-visualização do curso */}
        <div className="mt-8 p-4 bg-[#003366] rounded-lg text-white">
          <h3 className="text-2xl font-bold mb-2">Pré-visualização</h3>
          <p className="mb-2"><strong>Título:</strong> {title}</p>
          <p className="mb-2"><strong>Descrição:</strong> {description}</p>
          <h4 className="font-semibold">Links do YouTube:</h4>
          <ul className="list-disc pl-5">
            {youtubeLinks.map((link, index) => (
              <li key={index} className="mb-2">
                <strong>{link.title}</strong>: 
                <a href={link.url} className="text-[#00ffaa]" target="_blank" rel="noopener noreferrer">{link.url}</a>
                {/* Adicionando o iframe para pré-visualização do vídeo */}
                <iframe 
                  width="100%" 
                  height="200" 
                  src={`https://www.youtube.com/embed/${link.url.split('v=')[1]?.split('&')[0]}`} 
                  title={link.title} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen 
                  className="mt-2"
                ></iframe>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditCourseModal;
