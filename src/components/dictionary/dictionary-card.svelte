<script>
    /** @type {string} Por lo general, viene en español */
    export let original_word;
    
    /** @type {string=} Por lo general, viene en inglés */
    export let second_word = undefined;
    
    /** @type {string=} Por lo general, viene en aleman */
    export let third_word = undefined;
    
    /** @type {string=} Por lo general, viene en aleman */
    export let fourth_word = undefined;
    
    /** @type {string=} Por lo general, viene en aleman */
    export let fifth_word = undefined;
    
    /** @type {string=} Por lo general, viene en español */
    export let original_word_meaning = undefined;
    
    /** @type {string=} Por lo general, viene en inglés */
    export let second_word_meaning = undefined;
    
    /** @type {string=} Por lo general, viene en aleman */
    export let third_word_meaning = undefined;

    /** @type {string=} Por lo general, viene en inglés */
    export let fourth_word_meaning = undefined;
    
    /** @type {string=} Por lo general, viene en aleman */
    export let fifth_word_meaning = undefined;
    
    function loadVideo(){

    }
</script>

<article class=" border-black border-2 rounded-[12.5px] p-5 relative mt-5">
    <div
        class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1A5F70] text-center px-2 py-1 rounded-[5px]"
    >
        <p class="text-[14pt] text-[#EDFEFE] ">{original_word}</p>
    </div>

    <ul>
        <li>
            <strong>
                • Español: 
            </strong>
            <section class="pl-4">
                def. 
                <span class="pl-4">
                    {original_word_meaning}
                </span>
            </section>
        </li>
        <li>
            <strong>
                • {second_word} (Inglés): 
            </strong>
            <section class="pl-4">
                def. 
                <span class="pl-4">
                    {second_word_meaning}
                </span>
            </section>
        </li>
        <li>
            <strong>
                • {third_word} (Alemán): 
            </strong>
            <section class="pl-4">
                def. 
                <span class="pl-4">
                    {third_word_meaning}
                </span>
            </section>
        </li>
        <li>
            <strong>
                • {fourth_word} (Francés): 
            </strong>
            <section class="pl-4">
                def. 
                <span class="pl-4">
                    {fourth_word}
                </span>
            </section>
        </li>
        <li>
            <strong>
                • {fifth_word} (Portugues): 
            </strong>
            <section class="pl-4">
                def. 
                <span class="pl-4">
                    {fifth_word_meaning}
                </span>
            </section>
        </li>
    </ul>

    <div>
        <button class="font-bold"
        on:click={loadVideo}
        >Lengua de señas mexicana >
    </button>
        <!-- El > hay que cambiarlo por un icon -->
    </div>

    <div class="">
        <iframe title="Video de la palabra"></iframe>
    </div>
</article>
