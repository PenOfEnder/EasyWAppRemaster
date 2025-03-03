import React from 'react';

const BrailleNavigationControls = ({ 
  currentIndex, 
  totalItems, 
  onPrevious, 
  onNext,
  className = "" 
}) => {
  return (
    <div className={`flex justify-between items-center ${className}`}>
      <button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-300"
        aria-label="Ir a letra anterior"
      >
        Anterior
      </button>
      
      <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
        <span className="text-gray-700 font-medium">
          {currentIndex + 1} de {totalItems}
        </span>
      </div>
      
      <button
        onClick={onNext}
        disabled={currentIndex === totalItems - 1}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-blue-600"
        aria-label="Ir a letra siguiente"
      >
        Siguiente
      </button>
    </div>
  );
};

export default BrailleNavigationControls;