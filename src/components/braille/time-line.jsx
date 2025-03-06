import React, { useState, useEffect } from 'react';
import IconNext from '../icons/icon-next.astro';

const PlayIcon = ({ size = "24", color = "currentColor", className = "", rotate = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    strokeWidth="2"
    className={`${className} ${rotate ? 'transform rotate-180' : ''}`}
  >
    <path d="M3 5v14l8 -7z"></path>
    <path d="M14 5v14l8 -7z"></path>
  </svg>
);

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
      <div className="relative w-full">
        {/* Línea base */}
        <div className="h-1 bg-[#12b6c8] w-full absolute top-3"></div>

        {/* Puntos y letras */}
        <div className="flex justify-between relative w-full">
          {letters.split('').map((letter, index) => (
            <div key={index} className="flex flex-col items-center">
              <button
                onClick={() => handlePointClick(index)}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center z-10 ${index === activeIndex
                  ? 'bg-[#1a4f5f] border-[#1a4f5f] text-white shadow-lg scale-125'
                  : index < activeIndex
                    ? 'bg-[#1a4f5f] border-[#1a4f5f]'
                    : 'bg-[#12b6c8] border-[#12b6c8]'
                  }`}
                aria-label={`Ir a letra ${letter}`}
              >
                {index < activeIndex ? ' ' : ''}
              </button>

              <span className={`mt-2 text-sm font-medium ${index === activeIndex ? 'text-[#1a4f5f]' : 'text-[#12b6c8]'
                }`}>
                {letter.toUpperCase()}
              </span>

              {/* Indicador de letra actual */}

            </div>
          ))}
        </div>

        {/* Barra de progreso */}
        <div
          className="h-1 bg-[#1a4f5f] absolute top-3 transition-all duration-300"
          style={{
            width: `${(activeIndex / (letters.length - 1)) * 100}%`,
            left: 0, // Asegura que comience desde el inicio
            right: 0 // Permite extenderse hasta el final
          }}
        ></div>
      </div>

      {/* Controles de navegación */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePrevious}
          disabled={activeIndex === 0}
          className="px-4 py-2 bg-[#EDFEFE] text-[#0B3441] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-[#0B3441] hover:text-[#EDFEFE]
  flex justify-center group"
          aria-label="Ir a letra anterior"
        >
          <PlayIcon
            size="25%"
            color="#0B3441"
            className="ml-2 group-hover:stroke-[#EDFEFE] transform -scale-x-100"
          />
        </button>


        <div
          className="flex items-center bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors group"
          onClick={() => {
            if (activeIndex < letters.length - 1) {
              // Si no está en la última letra, repite la letra actual
              onLetterChange && onLetterChange(activeIndex);
            } else {
              // Si está en la última letra, reinicia la secuencia
              onLetterChange && onLetterChange(0);
            }
          }}
        >
          <span className="text-[#1a4f5f] font-medium group-hover:text-[#0b3441] transition-colors">
            {activeIndex + 1} de {letters.length}
            {activeIndex === letters.length - 1 ? ' (Reiniciar)' : ' (Repetir)'}
          </span>
        </div>



        <button
          onClick={handleNext}
          disabled={activeIndex === letters.length - 1}
          className="px-4 py-2 bg-[#EDFEFE] text-[#0B3441] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-[#0B3441] hover:text-[#EDFEFE] flex justify-center group"
          aria-label="Ir a letra siguiente"
        >
          <PlayIcon
            size="25%"
            color="#0B3441"
            className="ml-2 group-hover:stroke-[#EDFEFE]"
          />
        </button>
      </div>
    </div>
  );
};

export default BrailleTimeline;