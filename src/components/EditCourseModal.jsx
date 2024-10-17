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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Editar Curso</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Título</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="border rounded w-full py-2 px-3" 
              required 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Descrição</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="border rounded w-full py-2 px-3" 
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
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Salvar</button>
          <button type="button" onClick={onClose} className="ml-2 bg-gray-300 text-black px-4 py-2 rounded">Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default EditCourseModal;
