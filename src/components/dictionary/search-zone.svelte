<script>
    import DictionaryCard from "./dictionary-card.svelte";
    import Search from "../icons/svelte/search.svelte";
    import tursoGlobalClient from "../../utils/tursoClient";

    
    let searchQuery = "";
    let searchResults = [];
    let isLoading = false;
    let errorMessage = "";

    // Función para buscar palabras en la base de datos
    async function findWords(query) {
        try {
            // Buscar en la tabla all_words que contiene todas las traducciones
            const sql = `SELECT * FROM all_words WHERE 
                word LIKE '%${query}%' OR 
                spanish LIKE '%${query}%' OR 
                english LIKE '%${query}%' OR 
                german LIKE '%${query}%' OR 
                franch LIKE '%${query}%' OR 
                portuguese LIKE '%${query}%' 
                LIMIT 20`;

            const result = await tursoGlobalClient.execute(sql);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Función para buscar significados basada en tu función existente
    async function findMeanings(words) {
        try {
            const wordIds = words.map(word => word.id);
            
            // Construir consultas para cada tabla de significados
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
                
                // Buscar significados usando las palabras específicas de cada idioma
                temp_sql_spanish += `SELECT * FROM spanish_meanings WHERE word = '${words[i].spanish}'`;
                temp_sql_english += `SELECT * FROM english_meanings WHERE word = '${words[i].english}'`;
                temp_sql_german += `SELECT * FROM german_meanings WHERE word = '${words[i].german}'`;
                temp_sql_franch += `SELECT * FROM franch_meanings WHERE word = '${words[i].franch}'`;
                temp_sql_portuguese += `SELECT * FROM portuguese_meanings WHERE word = '${words[i].portuguese}'`;
            }

            const [
                result_spanish,
                result_english,
                result_german,
                result_franch,
                result_portuguese,
            ] = await Promise.all([
                tursoGlobalClient.execute(temp_sql_spanish),
                tursoGlobalClient.execute(temp_sql_english),
                tursoGlobalClient.execute(temp_sql_german),
                tursoGlobalClient.execute(temp_sql_franch),
                tursoGlobalClient.execute(temp_sql_portuguese),
            ]);

            return {
                spanish: result_spanish.rows,
                english: result_english.rows,
                german: result_german.rows,
                franch: result_franch.rows,
                portuguese: result_portuguese.rows,
            };
        } catch (error) {
            throw error;
        }
    }

    // Función principal de búsqueda
    async function searchWord(event) {
        event.preventDefault();
        
        if (!searchQuery.trim()) {
            errorMessage = "Por favor, introduce una palabra para buscar";
            return;
        }

        isLoading = true;
        errorMessage = "";
        searchResults = [];

        try {
            // 1. Buscar palabras que coincidan con la consulta
            const words = await findWords(searchQuery.trim());
            
            if (words.length === 0) {
                errorMessage = "No se encontraron resultados para tu búsqueda";
                return;
            }

            // 2. Buscar significados para las palabras encontradas
            const meanings = await findMeanings(words);

            // 3. Combinar palabras con sus significados
            const combinedResults = words.map(word => {
                const result = {
                    palabraEspanol: word.spanish || '',
                    palabraIngles: word.english || '',
                    palabraAleman: word.german || '',
                    palabraFrances: word.franch || '',
                    palabraPortugues: word.portuguese || ''
                };

                // Buscar significados correspondientes
                const spanishMeaning = meanings.spanish.find(m => m.word === word.spanish);
                const englishMeaning = meanings.english.find(m => m.word === word.english);
                const germanMeaning = meanings.german.find(m => m.word === word.german);
                const franchMeaning = meanings.franch.find(m => m.word === word.franch);
                const portugueseMeaning = meanings.portuguese.find(m => m.word === word.portuguese);

                if (spanishMeaning) result.significadoEspanol = spanishMeaning.sp_meaning;
                if (englishMeaning) result.significadoIngles = englishMeaning.en_meaning;
                if (germanMeaning) result.significadoAleman = germanMeaning.de_meaning;
                if (franchMeaning) result.significadoFrances = franchMeaning.meaning;
                if (portugueseMeaning) result.significadoPortugues = portugueseMeaning.pt_meaning;

                return result;
            });

            searchResults = combinedResults;

        } catch (error) {
            console.error('Error en la búsqueda:', error);
            errorMessage = "Ocurrió un error durante la búsqueda. Por favor, intenta de nuevo.";
        } finally {
            isLoading = false;
        }
    }
</script>

<section class="w-full h-full flex flex-col justify-center gap-4">
    <article class="w-full h-auto">
        <form
            class="w-full flex justify-between items-center gap-2 cursor-pointer
        border-3 border-transparent focus-within:border-[#1a5f70] transition-all duration-500 ease-in-out select-none
        bg-[#edfefe80] rounded-md text-2xl px-2 py-4 relative
        "
            on:submit={searchWord}
            action="#"
        >
            <label
                for="searchInput"
                class="text-lg p-2 absolute -top-6 left-2 bg-[#1a5f70] text-[#2dd3e3] rounded-md cursor-pointer"
            >
                Buscar palabra
            </label>
            <input
                id="searchInput"
                bind:value={searchQuery}
                class="flex-1 outline-none px-1 py-2 placeholder:text-[#1a5f70] text-[#0b3441]"
                type="text"
                placeholder="Introduce la palabra a buscar"
                disabled={isLoading}
            />
            <button type="submit" class="cursor-pointer" disabled={isLoading}>
                <Search color="#0b3441" size="30px" />
            </button>
        </form>
    </article>

    <div class="w-full h-full bg-[#edfefe80] rounded-md p-4 relative">
        <h1 class="text-xl font-[500] text-inter text-[#1a5f70]">Resultados</h1>
        
        <div class="grid grid-cols-4 gap-4 overflow-y-auto min-h-[50vh] max-h-[50vh] p-2">
            {#if isLoading}
                <div class="col-start-2 col-span-2 place-self-center">
                    <p class="text-lg text-inter font-[700] text-[#0b3441]">Buscando...</p>
                </div>
            {:else if errorMessage}
                <div class="col-start-2 col-span-2 place-self-center">
                    <p class="text-lg text-inter font-[700] text-red-600">{errorMessage}</p>
                </div>
            {:else if searchResults.length > 0}
                {#each searchResults as result, index (index)}
                    <DictionaryCard
                        palabraEspanol={result.palabraEspanol}
                        palabraIngles={result.palabraIngles}
                        palabraAleman={result.palabraAleman}
                        palabraFrances={result.palabraFrances}
                        palabraPortugues={result.palabraPortugues}
                        significadoEspanol={result.significadoEspanol}
                        significadoIngles={result.significadoIngles}
                        significadoAleman={result.significadoAleman}
                        significadoFrances={result.significadoFrances}
                        significadoPortugues={result.significadoPortugues}
                    />
                {/each}
            {:else}
                <h1 class="text-lg col-start-2 col-span-2 place-self-center text-inter font-[700] text-[#0b3441]">
                    Aquí aparecerán los resultados
                </h1>
            {/if}
        </div>
    </div>
</section>