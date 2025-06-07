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

    // Función para capitalizar la primera letra de cada palabra
    function capitalizar(texto) {
        if (!texto) return texto;
        return texto.split(' ')
            .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
            .join(' ');
    }

    // Aplicar capitalización reactivamente
    $: palabraEspanol = capitalizar(palabraEspanol);
    $: palabraIngles = capitalizar(palabraIngles);
    $: palabraAleman = capitalizar(palabraAleman);
    $: palabraFrances = capitalizar(palabraFrances);
    $: palabraPortugues = capitalizar(palabraPortugues);
    $: palabraNahuatl = capitalizar(palabraNahuatl);
    
    function cargarVideo() {
        // Implementación pendiente
    }
</script>

<article class="border-black border-2 rounded-[12.5px] p-5 relative mt-5">
    <ul>
        <li class="c-normal-text">
            <strong>
                • {palabraEspanol} <span class="font-[450]"> (Español): </span>
            </strong>
            {#if significadoEspanol}
            <section class="pl-4 font-[300]">
                def. 
                <span class="pl-4">
                    {significadoEspanol}
                </span>
            </section>
            {/if}
        </li>
        
        {#if palabraIngles && significadoIngles}
        <li class="c-normal-text">
            <strong>
                • {palabraIngles} <span class="font-[450]"> (Inglés): </span>
            </strong>
            <section class="pl-4 font-[300]">
                def. 
                <span class="pl-4">
                    {significadoIngles}
                </span>
            </section>
        </li>
        {/if}

        {#if palabraAleman && significadoAleman}
        <li class="c-normal-text">
            <strong>
                • {palabraAleman} <span class="font-[450]"> (Alemán): </span>
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
                • {palabraFrances} <span class="font-[450]"> (Francés): </span>
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
                • {palabraPortugues} <span class="font-[450]"> (Portugués): </span>
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
</article>
