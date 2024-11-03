// src/components/StarRating.jsx
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(null);

  const handleClick = (value) => {
    setRating(value);
  };

  const handleMouseOver = (value) => {
    setHover(value);
  };

  const handleMouseLeave = () => {
    setHover(null);
  };

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const value = index + 1;

        return (
          <FaStar
            key={index}
            size={40} // Aumenta o tamanho das estrelas
            className={`cursor-pointer ${value <= (hover || rating) ? 'text-yellow-500' : 'text-gray-300'}`}
            onClick={() => handleClick(value)}
            onMouseOver={() => handleMouseOver(value)}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
    </div>
  );
};

export default StarRating;