<script>
    import { generateSpeech } from "../../utils/textToSpeech";
    import brailleMap from "../../utils/brailleMap";
    import Next from "../icons/svelte/next.svelte";

    export let config = {
        word: "",
        currentIndex: 0,
    };

    let currentIndex = config.currentIndex - 1;
    const word = " " + config.word.toUpperCase();
    const wordLength = config.word.length;


    async function prevLetter() {
        if (currentIndex > -1) {
            currentIndex--;
        }
        const currentLetter = word[currentIndex + 1];
        console.log(currentLetter);
        try {
            const text = generateBrailleDescription(
                currentLetter,
                currentIndex,
            );
            const audioURL = await generateSpeech(text, {
                saveToLocalStorage: false,
            });

            if (audioURL) {
                const audio = new Audio(audioURL);
                await audio.play();
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function nextLetter() {
        if (currentIndex < wordLength - 1) {
            currentIndex++;
        }
        const currentLetter = word[currentIndex + 1];
        console.log(currentLetter);
        try {
            const text = generateBrailleDescription(
                currentLetter,
                currentIndex,
            );
            const audioURL = await generateSpeech(text, {
                saveToLocalStorage: false,
            });

            if (audioURL) {
                const audio = new Audio(audioURL);
                await audio.play();
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function repeatLetter() {
        const currentLetter = word[currentIndex + 1];

        try {
            const text = generateBrailleDescription(
                currentLetter,
                currentIndex,
            );
            const audioURL = await generateSpeech(text, {
                saveToLocalStorage: false,
            });

            if (audioURL) {
                const audio = new Audio(audioURL);
                await audio.play();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const generateBrailleDescription = (letter, position) => {
        let text = `Letra ${letter}: `;
        letter = letter.toUpperCase();

        // Si la letra no está en nuestro mapa, retornar un mensaje genérico
        if (letter === " ") {
            text = "Espacio";
            return text;
        } else if (!brailleMap[letter]) {
            return `La letra ${letter} en posición ${position + 1} en Braille no está disponible en el mapa actual.`;
        }

        // Incluir la posición en el texto para diferenciar letras repetidas
        for (let i = 0; i < brailleMap[letter].length; i++) {
            if (i > 2) {
                if (brailleMap[letter][i] > 0) {
                    text += "Punto " + (i + 1) + " ";
                }
            } else {
                if (brailleMap[letter][i] > 0) {
                    text += "Punto " + (i + 1) + " ";
                }
            }
        }

        return text;
    };
</script>

<section
    class="w-full md:w-full md:h-full flex flex-col justify-center items-center p-3.5 gap-2 overflow-x-auto min-w-full"
>
    <article class="w-full h-4/5 flex justify-center items-center relative">
        <!-- Línea con los puntos -->
        <div
            class="absolute w-[calc(100%-48px)] h-[2px] bg-[#0B3441] left-[24px]"
        ></div>
        <!-- Letras -->
        <div class="flex w-full z-10 justify-between">
            {#each Array(wordLength + 1) as _, index}
                {#if index === currentIndex + 1}
                    <span
                        class="w-[48px] h-[48px] rounded-full bg-[#2dd3e3] flex justify-center items-center text-[#0b3441]
                        transition-all ease-in-out duration-500 hover:brightness-110
                        cursor-pointer scale-110 shadow-md
                        "
                        aria-label="Letra actual: {word[index]}"
                    >
                        {word[index]}
                    </span>
                {:else}
                    <span
                        class="w-[48px] h-[48px] rounded-full bg-[#0b3441] flex justify-center items-center text-[#2dd3e3]
                        transition-all ease-in-out duration-600 hover:bg-[#135164] hover:scale-110
                        cursor-pointer shadow-md
                        "
                        aria-label="Reproducir letra {word[index]}"
                        on:click={(currentIndex = index - 1)}
                    >
                        {word[index]}
                    </span>
                {/if}
            {/each}
        </div>
    </article>
    <article class="w-full flex justify-around items-center gap-5">
        <!-- ================ Controles de navegación ================ -->

        <!-- Botón Anterior -->
        {#if currentIndex === 0 || currentIndex === -1}
            <button
                class="cursor-not-allowed brightness-80 hover:brightness-90 transform -scale-x-100 bg-[#edfefe] p-2 rounded-md transition-all ease-in-out duration-300"
                disabled
                aria-label="Botón para ir a la letra anterior, deshabilitado temporalmente"
            >
                <Next size="64" color="#0B3441" />
            </button>
        {:else}
            <button
                class="hover:brightness-110 transform -scale-x-100 bg-[#EDFEFE] p-2 rounded-md cursor-pointer transition-all ease-in-out duration-300
                "
                aria-label="Reproducir a la letra anterior"
                on:click={prevLetter}
            >
                <Next size="64" color="#0B3441" />
            </button>
        {/if}

        <!-- Botón Repetir letra -->
        {#if currentIndex === -1}
            <button
                class="brightness-90 bg-[#EDFEFE] text-[#1a5f70] h-full flex-1 rounded-md text-lg cursor-pointer transition-all ease-in-out duration-300 text-inter p-2"
                disabled
                aria-label="Botón para repetir la última letra, deshabilitado temporalmente"
                on:click={repeatLetter}
            >
                Repetir letra <br />
                
            </button>
        {:else}
            <button
                class="hover:brightness-110 bg-[#EDFEFE] text-[#1a5f70] h-full flex-1 rounded-md text-lg cursor-pointer transition-all ease-in-out duration-300 text-inter"
                aria-label={`Reproducir la última letra, letra ${word[currentIndex + 1]}`}
                on:click={repeatLetter}
            >
                Repetir letra <br />
                <span class="text-[#1a4f5f] font-bold"
                aria-hidden="true"
                >
                     Letra {currentIndex + 1} de {wordLength} 
                </span>
            </button>
        {/if}

        <!-- Botón Siguiente -->
        {#if currentIndex === wordLength - 1}
            <button
                class="cursor-not-allowed brightness-80 hover:brightness-90 bg-[#edfefe] p-2 rounded-md transition-all ease-in-out duration-300"
                aria-label="Botón para ir a la letra siguiente, deshabilitado temporalmente"
                disabled
            >
                <Next size="64" color="#0B3441" />
            </button>
        {:else}
            <button
                class="hover:brightness-110 bg-[#EDFEFE] p-2 rounded-md cursor-pointer transition-all ease-in-out duration-300"
                aria-label="Reproducir a la letra siguiente"
                on:click={nextLetter}
            >
                <Next size="64" color="#0B3441" />
            </button>
        {/if}
    </article>
</section>
