import { useState } from 'react';
import Head from 'next/head';
import { db } from '../lib/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { FaTrash, FaPlus, FaVideo, FaBook } from 'react-icons/fa';
import AdminRoute from '../components/AdminRoute';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';


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
      <div className="min-h-screen bg-white">
        <Head>
          <title>Criar Curso - CodeWise</title>
        </Head>

        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 bg-[#00FA9A]/10 border-[#00FA9A]/30 text-black font-semibold">
              ➕ Novo Curso
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-readable">
              Criar <span className="codewise-text-gradient">Curso</span>
            </h1>
            <p className="text-xl text-readable-muted max-w-2xl mx-auto">
              Crie um novo curso para enriquecer nossa plataforma de aprendizado
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="codewise-card shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-readable flex items-center">
                  <FaBook className="mr-3 h-6 w-6 text-[#00FA9A]" />
                  Informações do Curso
                </CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Course Basic Info */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-lg font-semibold text-readable flex items-center">
                        <FaBook className="mr-2 h-4 w-4 text-[#00FA9A]" />
                        Nome do Curso
                      </label>
                      <input
                        type="text"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#00FA9A] focus:ring-2 focus:ring-[#00FA9A]/20 transition-colors text-readable"
                        placeholder="Ex: Fundamentos de JavaScript"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-lg font-semibold text-readable">Descrição do Curso</label>
                      <textarea
                        value={courseDescription}
                        onChange={(e) => setCourseDescription(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#00FA9A] focus:ring-2 focus:ring-[#00FA9A]/20 transition-colors text-readable"
                        placeholder="Descreva o conteúdo e objetivos do curso..."
                        rows="4"
                        required
                      />
                    </div>
                  </div>

                  <Separator className="bg-slate-200" />

                  {/* Course Lessons */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-readable flex items-center">
                        <FaVideo className="mr-2 h-5 w-5 text-[#00FA9A]" />
                        Aulas do Curso
                      </h3>
                      <Badge variant="secondary" className="bg-[#00FA9A]/15 text-[#001a2c] border border-[#00FA9A]/30">
                        {youtubeLinks.length} aula{youtubeLinks.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      {youtubeLinks.map((link, index) => (
                        <Card key={index} className="bg-slate-50 border-slate-200">
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
                                  height="315"
                                  src={getYouTubeEmbedUrl(link.url)}
                                  title={link.title || `Vídeo ${index + 1}`}
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
                    </div>
                    {/* Add New Lesson Button */}
                    <div className="flex justify-center">
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

                  <Separator className="bg-slate-200" />

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <Button 
                      type="submit"
                      size="lg"
                      className="codewise-button-primary font-semibold px-8"
                    >
                      <FaBook className="mr-2 h-4 w-4" />
                      Criar Curso
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>

        <footer className="text-center py-8 bg-[#001a2c] text-white mt-16">
          <p>&copy; 2024 CodeWise. Transformando vidas através da programação.</p>
        </footer>
      </div>
    </AdminRoute>
  );
}
