<script>
    function searchWord() {
        const word = document.querySelector("input").value;
        if (!word) {
            return;
        }
    }

    import DictionaryCard from "./dictionary-card.svelte";

    import Search from "../icons/svelte/search.svelte";
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
                class="text-lg p-2 absolute -top-6 left-2  bg-[#1a5f70] text-[#2dd3e3] rounded-md cursor-pointer"
                >Buscar palabra</label
            >
            <input
                id="searchInput"
                class="flex-1 outline-none px-1 py-2 placeholder:text-[#1a5f70] text-[#0b3441]"
                type="text"
                placeholder="Introduce la palabra a buscar"
            />
            <button type="submit" class="cursor-pointer">
                <Search color="#0b3441" size="30px" />
            </button>
        </form>
    </article>
    <div class="w-full h-full bg-[#edfefe80] rounded-md p-4 relative">
        <h1 class="text-xl font-[500] text-inter text-[#1a5f70]"> Resultados </h1>
        <words class="grid grid-cols-4 gap-4 overflow-y-auto min-h-[50vh] max-h-[50vh] p-2 ">
            <!-- <DictionaryCard 
                original_word="Hola"
                second_word="Hello"
                original_word_meaning="Saludo"
                second_word_meaning="Greeting"
            /> -->
            <h1 class="text-lg col-start-2 col-span-2 place-self-center text-inter font-[700]  text-[#0b3441]">
                Aqui apareceran los resultados
            </h1>
        </words>
    </div>
</section>
