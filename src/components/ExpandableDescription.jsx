import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

const ExpandableDescription = ({ 
  description, 
  maxLength = 200, 
  maxHeight = "80px",
  className = "",
  buttonClassName = "",
  showBorder = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!description) return null;
  
  const shouldTruncate = description.length > maxLength;

  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className={`description-container text-readable-muted leading-relaxed transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? 'description-expanded' : 'description-collapsed'
        }`}
        style={{
          maxHeight: isExpanded ? 'none' : maxHeight
        }}
      >
        <p className="text-base whitespace-pre-line">
          {description}
        </p>
        
        {/* Gradient overlay para fade effect quando colapsado */}
        {!isExpanded && shouldTruncate && (
          <div className="description-fade-overlay" />
        )}
      </motion.div>
      
      {shouldTruncate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-4 flex justify-center"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`read-more-button group px-4 py-2 rounded-lg transition-all duration-200 ${
              showBorder ? 'border border-[#00FA9A]/20 hover:border-[#00FA9A]/40' : ''
            } ${buttonClassName}`}
          >
            <span className="mr-2">
              {isExpanded ? 'Mostrar menos' : 'Leia mais'}
            </span>
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="read-more-icon group-hover:scale-110"
            >
              ▼
            </motion.span>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExpandableDescription;
