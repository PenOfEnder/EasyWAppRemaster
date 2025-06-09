<script>
    import DictionaryCard from "./dictionary-card.svelte";
    import { onMount } from "svelte";

    export let range = 0;
    export let letter = "";

    import tursoGlobalClient from "../../utils/tursoClient";

    // Crear una promesa para manejar todo el proceso de carga
    let dataPromise;

    async function loadData() {
        try {
            // Paso 1: Obtener palabras
            const sql_getWords = `SELECT * FROM all_words 
                        WHERE initial_letter = '${letter}'
                        ORDER BY word ASC 
                        LIMIT 10 OFFSET ${range}`;
            
            const result = await tursoGlobalClient.execute(sql_getWords);
            const palabras = result.rows;

            if (palabras.length === 0) {
                return { palabras: [], meanings: null };
            }

            // Paso 2: Obtener significados
            const meanings = await findMeanings(palabras);
            
            return { palabras, meanings };
            
        } catch (error) {
            console.error("Error cargando datos:", error);
            throw error;
        }
    }

    async function findMeanings(words) {
        try {
            let temp_sql_spanish = "";
            let temp_sql_english = "";
            let temp_sql_german = "";
            let temp_sql_franch = "";
            let temp_sql_portuguese = "";

            for (let i = 0; i < words.length; i++) {
                if (i > 0) {
                    temp_sql_spanish += " UNION ";
                    temp_sql_english += " UNION ";
                    temp_sql_german += " UNION ";
                    temp_sql_franch += " UNION ";
                    temp_sql_portuguese += " UNION ";
                }
                temp_sql_spanish += `SELECT * FROM spanish_meanings WHERE word = '${words[i].spanish}'`;
                temp_sql_english += `SELECT * FROM english_meanings WHERE word = '${words[i].english}'`;
                temp_sql_german += `SELECT * FROM german_meanings WHERE word = '${words[i].german}'`;
                temp_sql_franch += `SELECT * FROM franch_meanings WHERE word = '${words[i].franch}'`;
                temp_sql_portuguese += `SELECT * FROM portuguese_meanings WHERE word = '${words[i].portuguese}'`;
            }

            const [result_spanish, result_english, result_german, result_franch, result_portuguese] = 
                await Promise.all([
                    tursoGlobalClient.execute(temp_sql_spanish),
                    tursoGlobalClient.execute(temp_sql_english),
                    tursoGlobalClient.execute(temp_sql_german),
                    tursoGlobalClient.execute(temp_sql_franch),
                    tursoGlobalClient.execute(temp_sql_portuguese)
                ]);

            const meanings = {
                spanish: result_spanish.rows,
                english: result_english.rows,
                german: result_german.rows,
                franch: result_franch.rows,
                portuguese: result_portuguese.rows,
            };

            console.log(meanings); // Agrega esta línea para imprimir los significados en la consola


            return meanings;

        } catch (error) {
            throw error;
        }
    }

    onMount(() => {
        dataPromise = loadData();
    });

    // Reactivo: reiniciar cuando cambien los parámetros
    $: if (letter || range >= 0) {
        dataPromise = loadData();
    }
</script>

<main
    class="w-full bg-[#edfefe80] grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-y-auto h-[65vh] max-h-[65vh] p-2 rounded-md"
>
    {#await dataPromise}
        <div class="col-span-4 text-center p-4">
            <h1>Cargando palabras y significados...</h1>
        </div>
    {:then data}
        {#if data && data.palabras.length > 0}
            {#each data.palabras as palabra, i}
                <DictionaryCard
                    palabraEspanol={palabra.word}
                    palabraIngles={palabra.english}
                    palabraAleman={palabra.german}
                    palabraFrances={palabra.franch}
                    palabraPortugues={palabra.portuguese}

                    significadoEspanol={data.meanings.spanish[i].sp_meaning}
                    significadoIngles={data.meanings.english[i].en_meaning}
                    significadoAleman={data.meanings.german[i].de_meaning}
                    significadoFrances={data.meanings.franch}
                    significadoPortugues={data.meanings.portuguese}
                />
                
            {/each}
        {:else}
            <div class="col-span-4 text-center p-4">
                <h1>No se encontraron palabras para la letra "{letter}"</h1>
            </div>
        {/if}
    {:catch error}
        <div class="col-span-4 text-center p-4 text-red-600">
            <h1>Error cargando datos: {error.message}</h1>
        </div>
    {/await}
</main>
