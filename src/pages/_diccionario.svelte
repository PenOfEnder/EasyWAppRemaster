<script>
    import { onMount } from "svelte";
    import Arrow from "../components/icons/svelte/arrow.svelte";

    // Estado para la aplicación
    let palabraSeleccionada = null;
    let letraActual = "A";
    let terminoBusqueda = "";
    let mostrarBusqueda = false;
    let palabrasMostradas = 3; // Controla cuántas tarjetas se muestran

    // Datos de ejemplo (reemplazar con tus datos reales)
    import diccionario from "../utils/miniDiccionario.js";

    console.log(diccionario);
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

<div class="diccionario-container">
    <!-- Barra superior con botones de navegación y búsqueda -->
    <div class="navbar">
        <button class="nav-button"> <Arrow color = "#0B3441" size = "20px" /> </button>

        <div class="search-bar">
            <input
                type="text"
                placeholder="Buscar en el diccionario"
                bind:value={terminoBusqueda}
                on:keydown={(e) => e.key === "Enter" && buscar()}
            />
        </div>

        <button class="nav-button" on:click={letraSiguiente}> &#8250; </button>

        <button class="settings-button"> &#9881; </button>
    </div>

    <!-- Navegador alfabético -->
    <div class="alphabet-nav">
        {#each alfabeto as letra}
            <button
                class="letra-button"
                class:active={letra === letraActual}
                on:click={() => cambiarLetra(letra)}
            >
                {letra}
            </button>
        {/each}
    </div>

    <!-- Contenido principal -->
    <div class="content-area">
        {#if mostrarBusqueda}
            <!-- Resultados de búsqueda -->
            <div class="search-results">
                <h2>Resultados para "{terminoBusqueda}"</h2>

                {#if getResultadosBusqueda().length > 0}
                    <div class="palabras-grid">
                        {#each getResultadosBusqueda() as resultado}
                            <div 
                                class="palabra-card"
                                on:click={() => {
                                    seleccionarPalabra(resultado);
                                    mostrarBusqueda = false;
                                }}
                            >
                                <div class="palabra-card-header">
                                    {resultado.palabra}
                                </div>
                                <div class="palabra-card-content">
                                    {#if resultado.definiciones.español}
                                        <div class="definicion">
                                            <p><strong>Español:</strong></p>
                                            <p>a. {resultado.definiciones.español}</p>
                                        </div>
                                    {/if}
                                    
                                    {#if resultado.definiciones.inglés}
                                        <div class="definicion">
                                            <p><strong>Word (English):</strong></p>
                                            <p>a. {resultado.definiciones.inglés}</p>
                                        </div>
                                    {/if}
                                    
                                    {#if resultado.definiciones.lsm}
                                        <div class="lsm-button">
                                            <span>Lengua de señas mexicana</span>
                                            <span class="dropdown-icon">&#9662;</span>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <p>No se encontraron resultados.</p>
                {/if}

                <button on:click={() => (mostrarBusqueda = false)} class="back-button">
                    Volver al diccionario
                </button>
            </div>
        {:else}
            <!-- Lista de palabras para la letra actual como tarjetas -->
            {#if diccionario[letraActual] && diccionario[letraActual].length > 0}
                <div class="palabras-grid">
                    {#each diccionario[letraActual].slice(0, palabrasMostradas) as palabra}
                        <div class="palabra-card" on:click={() => seleccionarPalabra(palabra)}>
                            <div class="palabra-card-header">
                                {palabra.palabra}
                            </div>
                            <div class="palabra-card-content">
                                {#if palabra.definiciones.español}
                                    <div class="definicion">
                                        <p><strong>Español:</strong></p>
                                        <p>a. {palabra.definiciones.español}</p>
                                    </div>
                                {/if}
                                
                                {#if palabra.definiciones.inglés}
                                    <div class="definicion">
                                        <p><strong>Word (English):</strong></p>
                                        <p>a. {palabra.definiciones.inglés}</p>
                                    </div>
                                {/if}
                                
                                {#if palabra.definiciones.lsm}
                                    <div class="lsm-button">
                                        <span>Lengua de señas mexicana</span>
                                        <span class="dropdown-icon">&#9662;</span>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="no-palabra">
                    <p>No hay palabras disponibles para la letra {letraActual}</p>
                </div>
            {/if}
        {/if}
    </div>
</div>

<style>
    .diccionario-container {
        font-family: Arial, sans-serif;
        max-width: 100%;
        margin: 0 auto;
        background-color: #a7dbe3;
        height: 100vh;
        display: flex;
        flex-direction: column;
    }

    .navbar {
        display: flex;
        padding: 10px;
        background-color: #a7dbe3;
        align-items: center;
    }

    .nav-button {
        background-color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin: 0 5px;
    }

    .search-bar {
        flex: 1;
        margin: 0 10px;
    }

    .search-bar input {
        width: 100%;
        padding: 12px 20px;
        font-size: 16px;
        border: none;
        border-radius: 25px;
    }

    .settings-button {
        background-color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
    }

    .alphabet-nav {
        display: flex;
        justify-content: space-around;
        background-color: #a7dbe3;
        padding: 10px 5px;
        flex-wrap: wrap;
    }

    .letra-button {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        padding: 5px 10px;
        margin: 2px;
        color: #333;
    }

    .letra-button.active {
        background-color: #2b6e7d;
        color: white;
        border-radius: 5px;
    }

    .content-area {
        background-color: #f0f9fa;
        flex: 1;
        border-radius: 10px 10px 0 0;
        padding: 20px;
        overflow-y: auto;
    }

    /* Nuevo estilo para las tarjetas de palabras */
    .palabras-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
    }

    .palabra-card {
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        overflow: hidden;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .palabra-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .palabra-card-header {
        background-color: #2b6e7d;
        color: white;
        padding: 10px 15px;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
    }

    .palabra-card-content {
        padding: 15px;
    }

    .definicion {
        margin-bottom: 15px;
    }

    .definicion p {
        margin: 5px 0;
        font-size: 14px;
        line-height: 1.4;
    }

    .lsm-button {
        background-color: #f5f5f5;
        padding: 10px;
        border-radius: 5px;
        text-align: center;
        margin-top: 10px;
        font-size: 14px;
        color: #2b6e7d;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
    }

    .dropdown-icon {
        font-size: 12px;
    }

    .back-button {
        margin-top: 20px;
        background-color: #2b6e7d;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
    }

    .no-palabra {
        text-align: center;
        padding: 30px;
        color: #666;
    }

    .search-results h2 {
        margin-bottom: 20px;
    }
</style>