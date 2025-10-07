// src/components/StarRating.jsx
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
    <div className="flex space-x-2 justify-center">
      {[...Array(5)].map((_, index) => {
        const value = index + 1;
        const isActive = value <= (hover || rating);

        return (
          <motion.div
            key={index}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <FaStar
              size={48}
              className={`cursor-pointer transition-all duration-200 ${
                isActive 
                  ? 'text-yellow-400 drop-shadow-lg filter brightness-110' 
                  : 'text-slate-300 hover:text-slate-400'
              } ${hover === value ? 'animate-pulse' : ''}`}
              onClick={() => handleClick(value)}
              onMouseOver={() => handleMouseOver(value)}
              onMouseLeave={handleMouseLeave}
              style={{
                filter: isActive ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))' : 'none'
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default StarRating;