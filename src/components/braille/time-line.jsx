import React, { useState, useEffect } from 'react';
import BrailleNavigationControls from './controlButtons-time-line';

const BrailleTimeline = ({ letters = "hola", currentIndex = 0, onLetterChange }) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  
  // Actualiza el componente cuando cambia el índice externamente
  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);
  
  // Función para manejar clics en los puntos de la línea del tiempo
  const handlePointClick = (index) => {
    setActiveIndex(index);
    if (onLetterChange) {
      onLetterChange(index);
    }
  };

  // Funciones para navegación
  const handlePrevious = () => {
    if (activeIndex > 0) {
      handlePointClick(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < letters.length - 1) {
      handlePointClick(activeIndex + 1);
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      <div className="relative">
        {/* Línea base */}
        <div className="h-1 bg-[#0B3441] w-full absolute top-3"></div>
        
        {/* Puntos y letras */}
        <div className="flex justify-between relative">
          {letters.split('').map((letter, index) => (
            <div key={index} className="flex flex-col items-center">
              <button
                onClick={() => handlePointClick(index)}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center z-10 ${
                  index === activeIndex
                    ? 'bg-red border-blue-600 text-white shadow-lg scale-125'
                    : index < activeIndex
                    ? 'bg-blue-200 border-blue-300'
                    : 'bg-white border-gray-300'
                }`}
                aria-label={`Ir a letra ${letter}`}
              >
                {index < activeIndex ? '✓' : ''}
              </button>
              
              <span className={`mt-2 text-sm font-medium ${
                index === activeIndex ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {letter.toUpperCase()}
              </span>
              
              {/* Indicador de letra actual */}
              {index === activeIndex && (
                <div className="absolute -top-8 left-0 right-0 mx-auto text-center">
                  <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                    Letra actual
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Barra de progreso */}
        <div 
          className="h-1 bg-blue-500 absolute top-3 transition-all duration-300"
          style={{ 
            width: `${(activeIndex / (letters.length - 1)) * 100}%`,
            maxWidth: activeIndex === letters.length - 1 ? '100%' : `calc(${(activeIndex / (letters.length - 1)) * 100}% + ${(activeIndex === 0 ? 0 : 3)}%)` 
          }}
        ></div>
      </div>
      
      {/* Controles de navegación usando el componente separado */}
      <BrailleNavigationControls 
        currentIndex={activeIndex}
        totalItems={letters.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        className="mt-8"
      />
    </div>
  );
};

export default BrailleTimeline;