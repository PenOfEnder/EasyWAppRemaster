<script>
    import DictionaryCard from "./dictionary-card.svelte";

    import { onMount } from "svelte";

    export let range = 0;
    export let letter = "";

    import tursoGlobalClient from "../../utils/tursoClient";
    //jalar solo 10 palabras
    const sql = `SELECT * FROM words 
                WHERE initial_letter = '${letter}'
                ORDER BY word ASC 
                LIMIT ${range + 10} OFFSET ${range}
                `;

    let palabras;
    let palabrasLength;

    async function findLetters() {
        try {
            const result = await tursoGlobalClient.execute(sql);
            palabras = result.rows;
            palabrasLength = result.rows.length;
            console.log(palabras);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
        }
    }

    onMount(async () => {
        await findLetters();
    });
</script>

<main class="w-full bg-[#edfefe80] grid grid-cols-4 gap-4 overflow-y-auto min-h-[50vh] max-h-[70vh] p-2 rounded-md">
    {#await palabrasLength  && palabras}
        <h1>Cargando palabras...</h1>
    {:then data}

        {#each data as palabra}
            <DictionaryCard
                palabraEspanol={palabra.spanish}
                palabraIngles={palabra.english}
                palabraAleman={palabra.german}
                palabraFrances={palabra.franch}
                palabraPortugues={palabra.portuguese}                
            />
        {/each}
    {/await}
</main>
