import React, { useState, useEffect, useRef } from 'react';
import IconNext from '../icons/icon-next.astro';

// Importamos la función de generación de voz
import { generateSpeech } from '../../utils/textToSpeech.js';

// Mapa de caracteres Braille (representación 2x3 de puntos)
// Cada letra está representada por un array de 6 elementos (0 o 1)
// donde 1 indica presencia de un punto y 0 ausencia
const brailleMap = {
  'A': [1, 0, 0, 0, 0, 0], // ⠁
  'B': [1, 1, 0, 0, 0, 0], // ⠃
  'C': [1, 0, 0, 1, 0, 0], // ⠉
  'D': [1, 0, 0, 1, 1, 0], // ⠙
  'E': [1, 0, 0, 0, 1, 0], // ⠑
  'F': [1, 1, 0, 1, 0, 0], // ⠋
  'G': [1, 1, 0, 1, 1, 0], // ⠛
  'H': [1, 1, 0, 0, 1, 0], // ⠓
  'I': [0, 1, 0, 1, 0, 0], // ⠊
  'J': [0, 1, 0, 1, 1, 0], // ⠚
  'K': [1, 0, 1, 0, 0, 0], // ⠅
  'L': [1, 1, 1, 0, 0, 0], // ⠇
  'M': [1, 0, 1, 1, 0, 0], // ⠍
  'N': [1, 0, 1, 1, 1, 0], // ⠝
  'O': [1, 0, 1, 0, 1, 0], // ⠕
  'P': [1, 1, 1, 1, 0, 0], // ⠏
  'Q': [1, 1, 1, 1, 1, 0], // ⠟
  'R': [1, 1, 1, 0, 1, 0], // ⠗
  'S': [0, 1, 1, 1, 0, 0], // ⠎
  'T': [0, 1, 1, 1, 1, 0], // ⠞
  'U': [1, 0, 1, 0, 0, 1], // ⠥
  'V': [1, 1, 1, 0, 0, 1], // ⠧
  'W': [0, 1, 0, 1, 1, 1], // ⠺
  'X': [1, 0, 1, 1, 0, 1], // ⠭
  'Y': [1, 0, 1, 1, 1, 1], // ⠽
  'Z': [1, 0, 1, 0, 1, 1]  // ⠵
};

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

const BrailleTimeline = ({
  letters = "hola",
  currentIndex = 0,
  onLetterChange,
  speechOptions = {},
  autoStart = false // Parámetro para controlar si se reproduce automáticamente al iniciar
}) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const initialRenderRef = useRef(true);
  const lastPlayedRef = useRef(null); // Para controlar qué posición fue reproducida por última vez

  // Actualiza el componente cuando cambia el índice externamente
  useEffect(() => {
    setActiveIndex(currentIndex);

    // Solo reproducir si no es la renderización inicial o si autoStart es true
    if (!initialRenderRef.current || autoStart) {
      // Siempre pronunciar cuando cambia el índice, incluso si la letra es la misma
      speakCurrentLetter(currentIndex);
    }

    // Marcar que ya no estamos en la renderización inicial
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
    }
  }, [currentIndex, autoStart]);

  // Add keyboard event listener
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        handlePrevious();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

  

    // Cleanup listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex]); // Add activeIndex as dependency to access current state
  // Liberar recursos de audio cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Función para generar el texto descriptivo del patrón Braille
  const generateBrailleDescription = (letter, position) => {
    letter = letter.toUpperCase();

    // Si la letra no está en nuestro mapa, retornar un mensaje genérico
    if (!brailleMap[letter]) {
      return `La letra ${letter} en posición ${position + 1} en Braille no está disponible en el mapa actual.`;
    }

    // Incluir la posición en el texto para diferenciar letras repetidas
    let text = `La letra ${letter} en Braile es: `;
    for (let i = 0; i < brailleMap[letter].length; i++) { 
      if(i>2){
          if(brailleMap[letter][i] > 0){
              text += "Punto "+(i+1)+" ";
          }
      } else{
          if(brailleMap[letter][i] > 0){
              text += "Punto "+(i+1)+" "; 
          }
      }
  }

    return text;
  };

  // Función para pronunciar la letra actual
  const speakCurrentLetter = async (index) => {
    // Siempre forzar la reproducción incluso si la letra es la misma que la anterior
    // pero está en una posición diferente

    if (isSpeakingRef.current) {
      // Si ya está hablando, detener la reproducción actual
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }

    const currentLetter = letters.charAt(index);
    // Generar el texto descriptivo para la configuración Braille, incluyendo la posición
    const textToSpeak = generateBrailleDescription(currentLetter, index);

    // Actualizar la referencia de la última posición reproducida
    lastPlayedRef.current = index;

    try {
      isSpeakingRef.current = true;
      const url = await generateSpeech(textToSpeak, speechOptions);

      if (url) {
        setAudioUrl(url);

        // Reproducir el audio
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play();
        }
      }
    } catch (error) {
      console.error("Error al generar o reproducir el audio:", error);
    } finally {
      isSpeakingRef.current = false;
    }
  };

  // Función para manejar clics en los puntos de la línea del tiempo
  const handlePointClick = (index) => {
    // Siempre reproducir al hacer clic, incluso si es la misma letra en diferente posición
    setActiveIndex(index);
    speakCurrentLetter(index);

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

  // Función para repetir o reiniciar
  const handleRepeatOrReset = () => {
    if (activeIndex < letters.length - 1) {
      // Si no está en la última letra, repite la letra actual
      speakCurrentLetter(activeIndex);
      onLetterChange && onLetterChange(activeIndex);
    } else {
      // Si está en la última letra, reinicia la secuencia
      handlePointClick(0);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      {/* Elemento de audio oculto para reproducir el texto a voz */}
      <audio ref={audioRef} className="hidden" onEnded={() => isSpeakingRef.current = false} />

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
                aria-label={`Ir a letra ${letter} en posición ${index + 1}`}
                data-position={index}
              >
                {index < activeIndex ? ' ' : ''}
              </button>

              <span className={`mt-2 text-sm font-medium ${index === activeIndex ? 'text-[#1a4f5f]' : 'text-[#12b6c8]'
                }`}>
                {letter.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        {/* Barra de progreso */}
        <div
          className="h-1 bg-[#1a4f5f] absolute top-3 transition-all duration-300"
          style={{
            width: `${(activeIndex / (letters.length - 1)) * 100}%`,
            left: 0,
            right: 0
          }}
        ></div>
      </div>

      {/* Controles de navegación */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePrevious}
          disabled={activeIndex === 0}
          className="px-4 py-2 bg-[#EDFEFE] text-[#0B3441] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-[#0B3441] hover:text-[#EDFEFE] flex justify-center group"
          aria-label="Ir a letra anterior"
        >
          <PlayIcon
            size="15%"
            color="#0B3441"
            className="ml-2 group-hover:stroke-[#EDFEFE] transform -scale-x-100"
          />
        </button>

        <div
          className="flex items-center bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors group"
          onClick={handleRepeatOrReset}
        >
          <span className="text-[#1a4f5f] text-xl group-hover:text-[#0b3441] transition-colors">
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
            size="15%"
            color="#0B3441"
            className="ml-2 group-hover:stroke-[#EDFEFE]"
          />
        </button>
      </div>
    </div>
  );
};

export default BrailleTimeline;