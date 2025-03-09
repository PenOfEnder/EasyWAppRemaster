<script>
    import { onMount } from "svelte";

    // Props
    export let letters = "hola";
    export let currentIndex = 0;
    export let onLetterChange = () => {}; // Valor por defecto como función vacía

    // Estado local
    let activeIndex = currentIndex;
    let resetClicked = false; // Nuevo estado para rastrear el primer clic en reiniciar
    let resetTimer; // Para el temporizador

    // Vigilar cambios en currentIndex
    $: if (currentIndex !== undefined) {
        activeIndex = currentIndex;
    }

    // Función para manejar clics en los puntos de la línea del tiempo
    function handlePointClick(index) {
        resetClicked = false; // Reinicia el estado de doble clic
        activeIndex = index;
        if (typeof onLetterChange === "function") {
            onLetterChange(index);
        }
    }

    // Funciones para navegación
    function handlePrevious() {
        resetClicked = false; // Reinicia el estado de doble clic
        if (activeIndex > 0) {
            handlePointClick(activeIndex - 1);
        }
    }

    function handleNext() {
        resetClicked = false; // Reinicia el estado de doble clic
        if (activeIndex < letters.length - 1) {
            handlePointClick(activeIndex + 1);
        }
    }

    // Función para repetir o reiniciar con doble clic
    function handleRepeatOrReset() {
        // Si no está en la última letra, simplemente repite
        if (activeIndex < letters.length - 1) {
            if (typeof onLetterChange === "function") {
                onLetterChange(activeIndex);
            }
            return;
        }

        // Si está en la última letra, implementamos la lógica de doble clic
        if (!resetClicked) {
            // Primer clic: activa el estado resetClicked
            resetClicked = true;

            // Configura un temporizador para restablecer el estado después de 3 segundos
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                resetClicked = false;
            }, 3000);
        } else {
            // Segundo clic: realiza el reinicio
            resetClicked = false;
            clearTimeout(resetTimer);
            handlePointClick(0);
        }
    }

    // Limpia el temporizador al desmontar el componente
    onMount(() => {
        return () => {
            clearTimeout(resetTimer);
        };
    });

    // Arreglo de letras
    $: lettersArray = letters.split("");
</script>

<div class="w-full max-w-4xl mx-auto my-8">
    <div class="relative w-full">
        <!-- Línea base -->
        <div class="h-1 bg-[#12b6c8] w-full absolute top-3"></div>

        <!-- Puntos y letras -->
        <div class="flex justify-between relative w-full">
            {#each lettersArray as letter, index}
                <div class="flex flex-col items-center">
                    <button
                        on:click={() => handlePointClick(index)}
                        class="w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center z-10 {index ===
                        activeIndex
                            ? 'bg-[#1a4f5f] border-[#1a4f5f] text-white shadow-lg scale-125'
                            : index < activeIndex
                              ? 'bg-[#1a4f5f] border-[#1a4f5f]'
                              : 'bg-[#12b6c8] border-[#12b6c8]'}"
                        aria-label="Ir a letra {letter}"
                    >
                        {index < activeIndex ? " " : ""}
                    </button>

                    <span
                        class="mt-2 text-sm font-medium {index === activeIndex
                            ? 'text-[#1a4f5f]'
                            : 'text-[#12b6c8]'}"
                    >
                        {letter.toUpperCase()}
                    </span>
                </div>
            {/each}
        </div>

        <!-- Barra de progreso -->
        <div
            class="h-1 bg-[#1a4f5f] absolute top-3 transition-all duration-300"
            style="width: {(activeIndex / (letters.length - 1)) *
                100}%; left: 0; right: 0;"
        ></div>
    </div>

    <!-- Controles de navegación -->
    <div class="flex justify-between items-center mt-8">
        <button
            on:click={handlePrevious}
            disabled={activeIndex === 0}
            class="px-4 py-2 bg-[#EDFEFE] text-[#0B3441] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-[#0B3441] hover:text-[#EDFEFE] flex justify-center group"
            aria-label="Ir a letra anterior"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0B3441"
                stroke-linecap="round"
                stroke-linejoin="round"
                width="15%"
                height="15%"
                stroke-width="2"
                class="ml-2 group-hover:stroke-[#EDFEFE] transform -scale-x-100"
            >
                <path d="M3 5v14l8 -7z"></path>
                <path d="M14 5v14l8 -7z"></path>
            </svg>
        </button>

        <div
            class="flex items-center bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors group {resetClicked
                ? 'bg-amber-100 hover:bg-amber-200'
                : ''}"
            on:click={handleRepeatOrReset}
        >
            <span
                class="text-[#1a4f5f] text-xl group-hover:text-[#0b3441] transition-colors"
            >
                {activeIndex + 1} de {letters.length}
                {activeIndex === letters.length - 1
                    ? resetClicked
                        ? " (Clic para confirmar)"
                        : " (Reiniciar)"
                    : " (Repetir)"}
            </span>
        </div>

        <button
            on:click={handleNext}
            disabled={activeIndex === letters.length - 1}
            class="px-4 py-2 bg-[#EDFEFE] text-[#0B3441] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-[#0B3441] hover:text-[#EDFEFE] flex justify-center group"
            aria-label="Ir a letra siguiente"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0B3441"
                stroke-linecap="round"
                stroke-linejoin="round"
                width="15%"
                height="15%"
                stroke-width="2"
                class="ml-2 group-hover:stroke-[#EDFEFE]"
            >
                <path d="M3 5v14l8 -7z"></path>
                <path d="M14 5v14l8 -7z"></path>
            </svg>
        </button>
    </div>
</div>
