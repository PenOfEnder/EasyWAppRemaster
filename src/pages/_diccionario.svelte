<script>
    import { onMount } from "svelte";
    import Arrow from "../components/icons/svelte/arrow.svelte";
    import LocalVersion from "../utils/localVersion.js";

    // Estado para la aplicación
    let palabraSeleccionada = null;
    let letraActual = "A";
    let terminoBusqueda = "";
    let mostrarBusqueda = false;
    let palabrasMostradas = 3; // Controla cuántas tarjetas se muestran

    // Datos de ejemplo (reemplazar con tus datos reales)
    import diccionario from "../utils/miniDiccionario.js";

    // Lista de todas las letras del alfabeto
    const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    // Seleccionar una palabra
    function seleccionarPalabra(palabra) {
        palabraSeleccionada = palabra;
    }

    // Cambiar a una letra específica
    function cambiarLetra(letra) {
        letraActual = letra;
        if (diccionario[letra] && diccionario[letra].length > 0) {
            palabraSeleccionada = diccionario[letra][0];
        } else {
            palabraSeleccionada = null;
        }
    }

    // Navegar a la letra anterior
    function letraAnterior() {
        const indiceActual = alfabeto.indexOf(letraActual);
        if (indiceActual > 0) {
            cambiarLetra(alfabeto[indiceActual - 1]);
        }
    }

    // Navegar a la letra siguiente
    function letraSiguiente() {
        const indiceActual = alfabeto.indexOf(letraActual);
        if (indiceActual < alfabeto.length - 1) {
            cambiarLetra(alfabeto[indiceActual + 1]);
        }
    }

    // Realizar búsqueda
    function buscar() {
        mostrarBusqueda = true;
        // Implementar la lógica de búsqueda real aquí
    }

    // Inicializar con la primera palabra
    onMount(() => {
        if (diccionario["A"] && diccionario["A"].length > 0) {
            palabraSeleccionada = diccionario["A"][0];
        }
    });

    // Obtener resultados de búsqueda
    function getResultadosBusqueda() {
        if (!terminoBusqueda.trim()) return [];

        const busquedaLower = terminoBusqueda.toLowerCase();
        let resultados = [];

        // Buscar en todas las letras
        for (const letra in diccionario) {
            const palabrasEnLetra = diccionario[letra];
            const coincidencias = palabrasEnLetra.filter((p) =>
                p.palabra.toLowerCase().includes(busquedaLower),
            );
            resultados = [...resultados, ...coincidencias];
        }

        return resultados;
    }
</script>

<div
    class="grid grid-cols-1 place-items-center font-sans max-w-full h-screen bg-gradient-to-t from-[#1296ad] to-[#d2fafb] bg-fixed"
>
    <!-- Barra superior con botones de navegación y búsqueda -->
    <div class="flex items-center p-2.5 w-9/10 row-span-1">
        <button
            class="bg-[#edfefe] rounded-full w-12 h-12 text-2xl flex items-center justify-center cursor-pointer mx-1.5"
        >
            <Arrow color="#0B3441" size="20px" />
        </button>

        <div class="flex-1 mx-2.5 bg-[#edfefe] rounded-xl">
            <input
                type="text"
                placeholder="Buscar en el diccionario"
                bind:value={terminoBusqueda}
                on:keydown={(e) => e.key === "Enter" && buscar()}
                class="w-full py-3 px-5 text-base border-none rounded-3xl outline-0 bg-[#]"
            />
        </div>
    </div>

    <!-- Navegador alfabético -->
    <div class="flex justify-around py-2.5 px-1.5 flex-wrap w-9/10 row-span-1">
        {#each alfabeto as letra}
            <button
                class={` bg-transparent border-none text-lg cursor-pointer py-1.5 px-2.5 m-0.5 text-[#00736A] ${letra === letraActual ? "bg-[#2b6e7d] text-[#0B3441] font-[1000]" : ""}`}
                on:click={() => cambiarLetra(letra)}
            >
                {letra}
            </button>
        {/each}
    </div>

    <!-- Contenido principal -->
    <main
        class="bg-[#EDFEFE80] flex-1 rounded-t-lg p-5 overflow-y-scroll w-9/10 row-span-4"
    >
        {#if mostrarBusqueda}
            <!-- Resultados de búsqueda -->
            <div>
                <h2 class="mb-5">Resultados para "{terminoBusqueda}"</h2>

                {#if getResultadosBusqueda().length > 0}
                    <div
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                        {#each getResultadosBusqueda() as resultado}
                            <button
                                class="bg-white rounded-lg shadow-md cursor-pointer overflow-hidden transition-all duration-200 hover:translate-y-[-3px] hover:shadow-lg"
                                on:click={() => {
                                    seleccionarPalabra(resultado);
                                    mostrarBusqueda = false;
                                }}
                            >
                                <div
                                    class="absolute top-0 left-1/2 -translate-x-1/2 bg-[#2b6e7d] text-[#EDFEFE] py-2.5 px-4 text-lg font-bold text-center rounded-lg"
                                >
                                    {palabra.palabra}
                                </div>
                                <div class="p-4">
                                    {#if resultado.definiciones.español}
                                        <div class="mb-4">
                                            <p class="my-1.5">
                                                <strong>Español:</strong>
                                            </p>
                                            <p
                                                class="my-1.5 text-sm leading-relaxed"
                                            >
                                                a. {resultado.definiciones
                                                    .español}
                                            </p>
                                        </div>
                                    {/if}

                                    {#if resultado.definiciones.inglés}
                                        <div class="mb-4">
                                            <p class="my-1.5">
                                                <strong>Word (English):</strong>
                                            </p>
                                            <p
                                                class="my-1.5 text-sm leading-relaxed"
                                            >
                                                a. {resultado.definiciones
                                                    .inglés}
                                            </p>
                                        </div>
                                    {/if}

                                    {#if resultado.definiciones.lsm}
                                        <div
                                            class="bg-gray-100 p-2.5 rounded text-center mt-2.5 text-sm text-[#2b6e7d] font-bold flex justify-between items-center cursor-pointer"
                                        >
                                            <span>Lengua de señas mexicana</span
                                            >
                                            <span class="text-xs">&#9662;</span>
                                        </div>
                                    {/if}
                                </div>
                            </button>
                        {/each}
                    </div>
                {:else}
                    <p class="text-center py-8 text-gray-600">
                        No se encontraron resultados.
                    </p>
                {/if}

                <button
                    on:click={() => (mostrarBusqueda = false)}
                    class="mt-5 bg-[#2b6e7d] text-[#EDFEFE] border-none py-2.5 px-4 rounded cursor-pointer font-bold"
                >
                    Volver al diccionario
                </button>
            </div>
        {:else}
            <!-- Lista de palabras para la letra actual como tarjetas -->
            {#if diccionario[letraActual] && diccionario[letraActual].length > 0}
                <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    {#each diccionario[letraActual].slice(0, palabrasMostradas) as palabra}
                        <button
                            class="relative rounded-lg shadow-md cursor-pointer overflow-hidden transition-all duration-200 hover:translate-y-[-3px] hover:shadow-lg pt-5 mb-5"
                            on:click={() => seleccionarPalabra(palabra)}
                        >
                            <div
                                class="absolute top-0 left-1/2 -translate-x-1/2 bg-[#2b6e7d] text-[#EDFEFE] py-2.5 px-4 text-lg font-bold text-center rounded-lg"
                            >
                                {palabra.palabra}
                            </div>
                            <div class="p-4 text-left border-2 rounded-xl">
                                {#if palabra.definiciones.español}
                                    <div class="mb-4">
                                        <p class="my-1.5">
                                            <strong>• Español:</strong>
                                        </p>
                                        <p
                                            class="my-1.5 text-sm leading-relaxed"
                                        >
                                            a. {palabra.definiciones.español}
                                        </p>
                                    </div>
                                {/if}

                                {#if palabra.definiciones.inglés}
                                    <div class="mb-4">
                                        <p class="my-1.5">
                                            <strong>• Word (English):</strong>
                                        </p>
                                        <p
                                            class="my-1.5 text-sm leading-relaxed"
                                        >
                                            a. {palabra.definiciones.inglés}
                                        </p>
                                    </div>
                                {/if}

                                {#if palabra.definiciones.lsm}
                                    <div
                                        class="bg-gray-100 p-2.5 rounded text-center mt-2.5 text-sm text-[#2b6e7d] font-bold flex justify-between items-center cursor-pointer"
                                    >
                                        <span>Lengua de señas mexicana</span>
                                        <span class="text-xs">&#9662;</span>
                                    </div>
                                {/if}
                            </div>
                        </button>
                    {/each}
                </div>
            {:else}
                <div class="text-center py-8 text-gray-600">
                    <p>
                        No hay palabras disponibles para la letra {letraActual}
                    </p>
                </div>
            {/if}
        {/if}
    </main>

    <footer class="text-center row-span-1">
        <span class="text-center text-lg text-[#EDFEFE] font-semibold">
            Versión {LocalVersion}
            <br /> Designed by DevSpark
        </span>
    </footer>
</div>
