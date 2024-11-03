// src/components/FeedbackForm.jsx
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import StarRating from './StarRating';

const FeedbackForm = ({ courseId, userId, userName, userEmail, courseTitle, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await addDoc(collection(db, "feedbacks"), {
        userId,
        userName,
        userEmail,
        courseId,
        courseName: courseTitle,
        rating,
        comment,
      });
      onClose();
      alert("Feedback enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
    }
  };

  return (
    <div className="mt-8 bg-[#001a33] p-6 rounded-lg shadow-lg border border-[#00FA9A]">
      <h3 className="text-2xl font-semibold mb-4 text-[#00FA9A]">Enviar Feedback</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white mb-2">Nota (0 a 5 estrelas):</label>
          <StarRating rating={rating} setRating={setRating} />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Comentário:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 rounded"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-[#00FA9A] text-white py-2 px-4 rounded hover:bg-[#00FA7A] transition duration-200"
        >
          Enviar Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;