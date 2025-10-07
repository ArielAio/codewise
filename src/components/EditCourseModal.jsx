import { useState, useEffect, useRef } from 'react';
import { db } from '../lib/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { FaTrash, FaPlus, FaVideo, FaBook, FaEdit, FaTimes } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto p-4">
      <div ref={modalRef} className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-50/50 to-green-50/30 p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="outline" className="mb-3 bg-[#00FA9A]/10 border-[#00FA9A]/30 text-black font-semibold">
                <FaEdit className="mr-1 h-3 w-3" />
                Editar Curso
              </Badge>
              <h2 className="text-2xl lg:text-3xl font-bold text-readable">
                Editar <span className="codewise-text-gradient">{course.title}</span>
              </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-slate-500 border-slate-200 hover:bg-slate-50"
            >
              <FaTimes className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Course Basic Info */}
            <Card className="codewise-card">
              <CardHeader>
                <CardTitle className="text-xl text-readable flex items-center">
                  <FaBook className="mr-3 h-5 w-5 text-[#00FA9A]" />
                  Informações do Curso
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-lg font-semibold text-readable flex items-center">
                    <FaBook className="mr-2 h-4 w-4 text-[#00FA9A]" />
                    Nome do Curso
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#00FA9A] focus:ring-2 focus:ring-[#00FA9A]/20 transition-colors text-readable"
                    placeholder="Ex: Fundamentos de JavaScript"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-semibold text-readable">Descrição do Curso</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#00FA9A] focus:ring-2 focus:ring-[#00FA9A]/20 transition-colors text-readable resize-none"
                    rows="4"
                    placeholder="Descreva o conteúdo e objetivos do curso..."
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Separator className="bg-slate-200" />

            {/* Video Lessons */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-readable flex items-center">
                  <FaVideo className="mr-3 h-5 w-5 text-[#00FA9A]" />
                  Aulas do Curso
                </h3>
                <Badge variant="secondary" className="bg-[#00FA9A]/20 text-[#001a2c] border border-[#00FA9A]/40 font-semibold">
                  {youtubeLinks.filter(link => link.title && link.url).length} aulas
                </Badge>
              </div>

              <div className="space-y-4">
                {youtubeLinks.map((link, index) => (
                  <Card key={index} className="codewise-card border-slate-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-readable flex items-center">
                          <FaVideo className="mr-2 h-4 w-4 text-[#00FA9A]" />
                          Aula {index + 1}
                        </CardTitle>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeLinkField(index)}
                            className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
                          >
                            <FaTrash className="h-3 w-3 mr-1" />
                            Remover
                          </Button>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-readable">Título da Aula</label>
                          <input
                            type="text"
                            value={link.title}
                            onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-[#00FA9A] focus:ring-2 focus:ring-[#00FA9A]/20 transition-colors text-readable"
                            placeholder="Ex: Introdução ao JavaScript"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-readable">Link do YouTube</label>
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-[#00FA9A] focus:ring-2 focus:ring-[#00FA9A]/20 transition-colors text-readable"
                            placeholder="https://youtube.com/watch?v=..."
                            required
                          />
                        </div>
                      </div>

                      {/* Video Preview */}
                      {isValidYouTubeUrl(link.url) && (
                        <div className="border-2 border-[#00FA9A]/20 rounded-lg overflow-hidden">
                          <iframe
                            width="100%"
                            height="250"
                            src={getYouTubeEmbedUrl(link.url)}
                            title={link.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {/* Add New Lesson Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addLinkField}
                    className="border-[#00FA9A] text-[#00FA9A] hover:bg-[#00FA9A] hover:text-[#001a2c] transition-colors"
                  >
                    <FaPlus className="mr-2 h-4 w-4" />
                    Adicionar Nova Aula
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-200" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-slate-300 text-slate-600 hover:bg-slate-50 px-6"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="lg"
                className="codewise-button-primary font-semibold px-8"
              >
                <FaEdit className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCourseModal;
