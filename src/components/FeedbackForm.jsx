// src/components/FeedbackForm.jsx
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import StarRating from './StarRating';
import { motion } from 'framer-motion';
import { FaComments, FaTimes, FaPaperPlane, FaHeart } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const FeedbackForm = ({ courseId, userId, userName, userEmail, courseTitle, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (rating === 0) {
      alert("Por favor, selecione uma avaliação de 1 a 5 estrelas.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, "feedbacks"), {
        userId,
        userName,
        userEmail,
        courseId,
        courseName: courseTitle,
        rating,
        comment,
        timestamp: new Date().toISOString(),
      });
      
      // Sucesso com animação
      setTimeout(() => {
        onClose();
        alert("✨ Feedback enviado com sucesso! Obrigado por compartilhar sua experiência.");
      }, 500);
      
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      alert("Erro ao enviar feedback. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="w-full max-w-lg"
      >
        <Card className="relative overflow-hidden border-2 border-[#00FA9A]/20 shadow-2xl">
          {/* Header com gradiente */}
          <CardHeader className="bg-gradient-to-br from-[#001a2c] to-[#002d4a] text-white relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00FA9A]/10 to-transparent" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#00FA9A] rounded-lg flex items-center justify-center">
                    <FaComments className="h-6 w-6 text-[#001a2c]" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-white">Avalie o Curso</CardTitle>
                    <CardDescription className="text-slate-300">
                      Compartilhe sua experiência conosco
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <FaTimes className="h-5 w-5" />
                </Button>
              </div>
              
              <Badge variant="outline" className="bg-white/10 border-white/30 text-white">
                {courseTitle}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-8 bg-white">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Rating Section */}
              <div className="text-center space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-readable mb-2">Como você avalia este curso?</h3>
                  <p className="text-readable-muted text-sm">Clique nas estrelas para avaliar</p>
                </div>
                
                <div className="flex justify-center">
                  <StarRating rating={rating} setRating={setRating} />
                </div>
                
                {rating > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-center"
                  >
                    <Badge className={`px-4 py-2 font-semibold ${
                      rating <= 2 ? 'bg-red-500' :
                      rating <= 3 ? 'bg-yellow-500' :
                      rating <= 4 ? 'bg-blue-500' : 'bg-green-500'
                    } text-white`}>
                      {rating <= 2 ? '😞 Precisa melhorar' :
                       rating <= 3 ? '😐 Regular' :
                       rating <= 4 ? '😊 Bom' : '🌟 Excelente'}
                    </Badge>
                  </motion.div>
                )}
              </div>

              {/* Comment Section */}
              <div className="space-y-3">
                <label className="block">
                  <span className="text-lg font-semibold text-readable">Deixe seu comentário</span>
                  <span className="text-readable-muted text-sm block mt-1">
                    Conte-nos mais sobre sua experiência (opcional)
                  </span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Compartilhe seus pensamentos sobre o curso..."
                  className="w-full p-4 border-2 border-slate-200 rounded-lg focus:border-[#00FA9A] focus:outline-none transition-colors duration-200 resize-none h-32 text-readable"
                  maxLength={500}
                />
                <div className="text-right text-xs text-readable-muted">
                  {comment.length}/500 caracteres
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-slate-300 text-slate-700 hover:border-[#00FA9A] hover:text-[#00FA9A]"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 codewise-button-primary font-semibold"
                  disabled={rating === 0 || isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <FaPaperPlane className="h-4 w-4" />
                      <span>Enviar Feedback</span>
                      <FaHeart className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default FeedbackForm;