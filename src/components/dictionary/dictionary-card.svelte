<script>
    /** @type {string} Palabra en español */
    export let palabraEspanol;

    /** @type {string=} Palabra en inglés */
    export let palabraIngles = undefined;

    /** @type {string=} Palabra en alemán */
    export let palabraAleman = undefined;

    /** @type {string=} Palabra en francés */
    export let palabraFrances = undefined;

    /** @type {string=} Palabra en portugués */
    export let palabraPortugues = undefined;

    /** @type {string=} Palabra en náhuatl */
    export let palabraNahuatl = undefined;

    /** @type {string=} Significado en español */
    export let significadoEspanol = undefined;

    /** @type {string=} Significado en inglés */
    export let significadoIngles = undefined;

    /** @type {string=} Significado en alemán */
    export let significadoAleman = undefined;

    /** @type {string=} Significado en francés */
    export let significadoFrances = undefined;

    /** @type {string=} Significado en portugués */
    export let significadoPortugues = undefined;

    /** @type {string=} Significado en náhuatl */
    export let significadoNahuatl = undefined;

    // Variable para manejar la promesa del video
    let videoPromise = null;
    let mostrarVideo = false;

    // Función para capitalizar la primera letra de cada palabra
    function capitalizar(texto) {
        if (!texto) return texto;
        return texto
            .split(" ")
            .map(
                (palabra) =>
                    palabra.charAt(0).toUpperCase() +
                    palabra.slice(1).toLowerCase(),
            )
            .join(" ");
    }

    // Aplicar capitalización reactivamente
    $: palabraEspanol = capitalizar(palabraEspanol);
    $: palabraIngles = capitalizar(palabraIngles);
    $: palabraAleman = capitalizar(palabraAleman);
    $: palabraFrances = capitalizar(palabraFrances);
    $: palabraPortugues = capitalizar(palabraPortugues);
    $: palabraNahuatl = capitalizar(palabraNahuatl);

    async function cargarVideo(receivedWord) {
        const url = `https://palabra-clara.onrender.com/descargarVideo/${receivedWord}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error al cargar el video: ${response.status}`);
            }
            
            // Crear un blob URL para el video
            const blob = await response.blob();
            const videoUrl = URL.createObjectURL(blob);
            
            return videoUrl;
        } catch (error) {
            console.error('Error cargando video:', error);
            throw error;
        }
    }

    function handleVideoClick() {
        mostrarVideo = true;
        videoPromise = cargarVideo(palabraEspanol);
    }

    function cerrarVideo() {
        mostrarVideo = false;
        if (videoPromise) {
            // Limpiar el blob URL para liberar memoria
            videoPromise.then(url => URL.revokeObjectURL(url)).catch(() => {});
            videoPromise = null;
        }
    }
</script>

<article
    class="border-black border-2 rounded-[12.5px] p-5 relative mt-5"
    aria-label={"Definición de " + palabraEspanol +": " + significadoEspanol}
>
    <span
        class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 font-[#1A5F70] text-[#edfefe] px-3 py-1 rounded text-inter bg-[#0b3441]"
        aria-hidden="true"
    >
        {palabraEspanol}
    </span>
    <ul
        aria-hidden="true"
    >
        <li class="c-normal-text" aria-label={"Definición en español"}>
            <strong>
                • {palabraEspanol} <span class="font-[450]"> (Español): </span>
            </strong>
            {#if significadoEspanol}
                <section class="pl-4 font-[300]" aria-hidden="true">
                    def.
                    <span class="pl-4" aria-hidden="true">
                        {significadoEspanol}
                    </span>
                </section>
            {/if}
        </li>

        {#if palabraIngles && significadoIngles}
            <li class="c-normal-text">
                <strong aria-label={palabraIngles + " ,palabra en ingles"}>
                    • {palabraIngles}
                    <span class="font-[450]"> (Inglés): </span>
                </strong>
                <section class="pl-4 font-[300]">
                    def.
                    <span class="pl-4" aria-hidden="true">
                        {significadoIngles}
                    </span>
                </section>
            </li>
        {/if}

        {#if palabraAleman && significadoAleman}
            <li class="c-normal-text">
                <strong>
                    • {palabraAleman}
                    <span class="font-[450]"> (Alemán): </span>
                </strong>
                <section class="pl-4 font-[300]">
                    def.
                    <span class="pl-4">
                        {significadoAleman}
                    </span>
                </section>
            </li>
        {/if}

        {#if palabraFrances && significadoFrances}
            <li class="c-normal-text">
                <strong>
                    • {palabraFrances}
                    <span class="font-[450]"> (Francés): </span>
                </strong>
                <section class="pl-4 font-[300]">
                    def.
                    <span class="pl-4">
                        {significadoFrances}
                    </span>
                </section>
            </li>
        {/if}

        {#if palabraPortugues && significadoPortugues}
            <li class="c-normal-text">
                <strong>
                    • {palabraPortugues}
                    <span class="font-[450]"> (Portugués): </span>
                </strong>
                <section class="pl-4 font-[300]">
                    def.
                    <span class="pl-4">
                        {significadoPortugues}
                    </span>
                </section>
            </li>
        {/if}
    </ul>

    <section class="mt-4">
        <button
            class="font-[700] cursor-transparent border-none text-left p-0 text-inter text-[#1F4C5A] cursor-pointer"
            on:click={handleVideoClick}
            aria-label="Cargar video en lengua de señas para {palabraEspanol}"
        >
            Video en lengua de señas >
        </button>

        {#if mostrarVideo}
            <div class="mt-4">
                {#await videoPromise}
                    <div class="flex items-center justify-center p-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span class="ml-2">Cargando video...</span>
                    </div>
                {:then videoUrl}
                    <video 
                        controls 
                        class="w-full max-w-md mx-auto rounded-md border-2 border-[#1F4C5A]"
                        aria-label="Video en lengua de señas para {palabraEspanol}"
                    >
                        <source src={videoUrl} type="video/webm" />
                        Tu navegador no soporta la reproducción de video.
                    </video>
                {:catch error}
                    <div class="text-red-600 rounded">
                        <p><strong>Error al cargar el video:</strong></p>
                        <button 
                            class="mt-2 "
                            on:click={handleVideoClick}
                        >
                            Intentar de nuevo
                        </button>
                    </div>
                {/await}
            </div>
        {/if}
    </section>
</article>