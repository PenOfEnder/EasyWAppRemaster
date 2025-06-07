<script>
    import tursoGlobalClient from "../../utils/tursoClient";
    import { onMount } from "svelte";

    export let letter = "";
    export let range = 0;

    let count_words;

    let config = {
        totalPages: 0,
        currentpage: Math.floor(range / 10),
        indexes: [],
    };

    onMount(() => {
        count_words = get_count_words();
    });

    async function get_count_words() {
        try {
            const sql_count_words = `SELECT COUNT(*) as count FROM all_words WHERE initial_letter = '${letter}'`;

            const response = await tursoGlobalClient.execute(sql_count_words);
            if (response.rows === 0) {
                console.log("Hubo un error al fechear");
            }
            config.totalPages = Math.ceil(response.rows[0].count / 10);
            for (let i = 0; i < config.totalPages; i++) {
                config.indexes.push(i);
            }
            console.log(config);
            return response.rows[0].count;
        } catch (error) {
            console.log("Hubo un error al fechear");
            throw error;
        }
    }

    let innerWidth = 0;

    $: isMobile = innerWidth < 768;
    $: isTablet = innerWidth >= 768 && innerWidth < 1024;
    $: isDesktop = innerWidth >= 1024;
</script>

<svelte:window bind:innerWidth />

<section class="flex flex-col py-2 px-4 p-1">
    {#if isMobile || isTablet}
        {#await count_words then data}
            <div class="flex justify-between items-center w-full">
                {#if config.currentpage === 0}
                    <button
                        class="bg-[#a9a9a9] rounded-md aspect-square p-0.5"
                        aria-label="Pagina anterior"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            class="scale-x-[-1]"
                            ><path
                                fill="#1a4f5f"
                                d="M10.5 16.3q-.2 0-.35-.137T10 15.8V8.2q0-.225.15-.362t.35-.138q.05 0 .35.15l3.625 3.625q.125.125.175.25t.05.275t-.05.275t-.175.25L10.85 16.15q-.075.075-.162.113t-.188.037"
                            /></svg
                        >
                    </button>
                {:else}
                    <a
                        href={config.currentpage * 10 - 10}
                        class="bg-[#edfefe80] rounded-md aspect-square p-0.5"
                        aria-label="Pagina anterior"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            class="scale-x-[-1]"
                            ><path
                                fill="#1a4f5f"
                                d="M10.5 16.3q-.2 0-.35-.137T10 15.8V8.2q0-.225.15-.362t.35-.138q.05 0 .35.15l3.625 3.625q.125.125.175.25t.05.275t-.05.275t-.175.25L10.85 16.15q-.075.075-.162.113t-.188.037"
                            /></svg
                        >
                    </a>
                {/if}

                {#each config.indexes as index}
                    {#if index <= config.currentpage + 2 && index >= config.currentpage -1}
                        {#if index === config.currentpage}
                            <button
                                class="bg-[#edfefe] rounded-md px-4 py-2 lg:text-xl text-[#1a4f5f] font-[600]"
                            >
                                {index + 1}
                            </button>
                        {:else}
                            <a
                                href={`${index * 10}`}
                                class="bg-[#edfefe80] rounded-md px-4 py-2 lg:text-xl cursor-pointer text-[#0b3441] font-[400]"
                            >
                                {index +1}
                            </a>
                        {/if}
                    {:else}
                    {/if}
                {/each}

                <a
                    href={config.currentpage * 10 + 10}
                    class="bg-[#edfefe80] rounded-md aspect-square p-0.5"
                    aria-label="Pagina siguiente"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        ><path
                            fill="#1a4f5f"
                            d="M10.5 16.3q-.2 0-.35-.137T10 15.8V8.2q0-.225.15-.362t.35-.138q.05 0 .35.15l3.625 3.625q.125.125.175.25t.05.275t-.05.275t-.175.25L10.85 16.15q-.075.075-.162.113t-.188.037"
                        /></svg
                    >
                </a>
            </div>
            <h1 class="text-center w-full text-[#1a4f5f] text-lg p-2">
                Mostrado 10 de {data} palabras
            </h1>
        {/await}
    {:else if isDesktop}
        {#await count_words then data}
            <div class="flex justify-between items-center w-full">
                {#if config.currentpage === 0}
                    <button
                        class="bg-[#a9a9a9] rounded-md aspect-square p-0.5"
                        aria-label="Pagina anterior"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            class="scale-x-[-1]"
                            ><path
                                fill="#1a4f5f"
                                d="M10.5 16.3q-.2 0-.35-.137T10 15.8V8.2q0-.225.15-.362t.35-.138q.05 0 .35.15l3.625 3.625q.125.125.175.25t.05.275t-.05.275t-.175.25L10.85 16.15q-.075.075-.162.113t-.188.037"
                            /></svg
                        >
                    </button>
                {:else}
                    <a
                        href={config.currentpage * 10 - 10}
                        class="bg-[#edfefe80] rounded-md aspect-square p-0.5"
                        aria-label="Pagina anterior"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            class="scale-x-[-1]"
                            ><path
                                fill="#1a4f5f"
                                d="M10.5 16.3q-.2 0-.35-.137T10 15.8V8.2q0-.225.15-.362t.35-.138q.05 0 .35.15l3.625 3.625q.125.125.175.25t.05.275t-.05.275t-.175.25L10.85 16.15q-.075.075-.162.113t-.188.037"
                            /></svg
                        >
                    </a>
                {/if}

                {#each config.indexes as index}
                    {#if index === config.currentpage}
                        <button
                            class="bg-[#edfefe] rounded-md px-4 py-2 lg:text-xl text-[#1a4f5f] font-[600]"
                        >
                            {index + 1}
                        </button>
                    {:else}
                        <a
                            href={`${index * 10}`}
                            class="bg-[#edfefe80] rounded-md px-4 py-2 lg:text-xl cursor-pointer text-[#0b3441] font-[400]"
                        >
                            {index + 1}
                        </a>
                    {/if}
                {/each}

                <a
                    href={config.currentpage * 10 + 10}
                    class="bg-[#edfefe80] rounded-md aspect-square p-0.5"
                    aria-label="Pagina siguiente"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        ><path
                            fill="#1a4f5f"
                            d="M10.5 16.3q-.2 0-.35-.137T10 15.8V8.2q0-.225.15-.362t.35-.138q.05 0 .35.15l3.625 3.625q.125.125.175.25t.05.275t-.05.275t-.175.25L10.85 16.15q-.075.075-.162.113t-.188.037"
                        /></svg
                    >
                </a>
            </div>

            <h1 class="text-center w-full text-[#1a4f5f] text-lg p-2">
                Mostrado 10 de {data} palabras
            </h1>
        {/await}
    {/if}
</section>
