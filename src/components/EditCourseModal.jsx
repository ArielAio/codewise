import { useState, useEffect, useRef } from 'react';
import { db } from '../lib/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { FaTrash } from 'react-icons/fa';

const isValidYouTubeUrl = (url) => {
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return regex.test(url);
};

const getYouTubeEmbedUrl = (url) => {
  const videoId = url.split('v=')[1]?.split('&')[0];
  return `https://www.youtube.com/embed/${videoId}`;
};

const EditCourseModal = ({ course, onClose, onRefresh }) => {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [youtubeLinks, setYoutubeLinks] = useState(course.youtubeLinks || []);
  const modalRef = useRef();

  useEffect(() => {
    // Update state when course prop changes
    setTitle(course.title);
    setDescription(course.description);
    setYoutubeLinks(course.youtubeLinks || []);
  }, [course]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate YouTube links
      const uniqueLinks = youtubeLinks.filter((link, index, self) =>
        index === self.findIndex((l) => l.url === link.url)
      );

      if (uniqueLinks.length < youtubeLinks.length) {
        alert('Não é permitido cadastrar duas aulas com o mesmo link do YouTube.');
        return;
      }

      // Validate required fields
      const validLinks = youtubeLinks.filter(link => link.title && link.url);
      if (!title || !description || validLinks.length === 0) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      // Update course in Firestore
      const courseDoc = doc(db, 'cursos', course.id);
      await updateDoc(courseDoc, {
        title: title.trim(),
        description: description.trim(),
        youtubeLinks: validLinks.map(link => ({
          title: link.title.trim(),
          url: link.url.trim()
        }))
      });

      await onRefresh(); // Wait for refresh to complete
      onClose(); // Close modal after successful update
    } catch (error) {
      console.error('Erro ao editar curso:', error);
      alert('Erro ao editar curso: ' + error.message);
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

  // Close modal when clicking outside
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
              <div key={index} className="mb-6">
                <div className="flex space-x-4 mb-2">
                  <input
                    type="text"
                    value={link.title}
                    onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                    className="w-1/2 p-3 border border-[#00ffaa] bg-white rounded-lg text-[#00264d] focus:outline-none focus:ring-2 focus:ring-[#00ffaa]"
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
                </div>
                {/* Pré-visualização do vídeo abaixo do link */}
                {isValidYouTubeUrl(link.url) && (
                  <iframe 
                    width="100%" 
                    height="200" 
                    src={getYouTubeEmbedUrl(link.url)} 
                    title={link.title} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen 
                    className="mt-4"
                  ></iframe>
                )}
                {index > 0 && (
                  <button type="button" onClick={() => removeLinkField(index)} className="text-red-400 mt-2 flex items-center hover:text-red-300 transition-colors">
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
      </div>
    </div>
  );
};

export default EditCourseModal;
