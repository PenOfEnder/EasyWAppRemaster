// Este archivo debe estar en tu carpeta public o src/scripts
import BrailleTimeline from '../components/BrailleTimeline.svelte';

// Expone una función para inicializar el componente
window.initBrailleTimeline = function (containerId, options) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const { letters = "hola", currentIndex = 0 } = options || {};

    // Función de callback
    const handleLetterChange = (index) => {
        console.log(`Letra cambiada a índice: ${index}`);
        // Puedes emitir un evento personalizado si necesitas comunicarte con otros scripts
        container.dispatchEvent(new CustomEvent('letterChange', { detail: { index } }));
    };

    // Inicializa el componente
    const component = new BrailleTimeline({
        target: container,
        props: {
            letters,
            currentIndex,
            onLetterChange: handleLetterChange
        }
    });

    // Devuelve una referencia para manipulación adicional
    return component;
};