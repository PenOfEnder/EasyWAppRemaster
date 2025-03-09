<script>
  import brailleMap from "../../utils/brailleMap.js";

  // Props definition in Svelte using export
  export let letter = "";
  
  // Reactive variables and calculations
  $: mayus = letter === letter.toUpperCase();
  $: letraxd = letter.toLowerCase();
  $: letterArray = brailleMap[letraxd] || [0, 0, 0, 0, 0, 0];
</script>

<section class="flex flex-col items-center">
  <strong class="text-[16pt] bg-[#2DD3E3] px-6 rounded-t-[3px] pb-0.5 text-center w-1/2">
    {letter.toUpperCase() + (mayus ? " - Mayúscula" : "")}
  </strong>
  <div
    class="bg-[#157589] rounded-[6px]
    grid grid-cols-2 grid-rows-3 gap-x-[24px] gap-y-[12px]
    p-3"
  >
    {#each letterArray as dot}
      {#if dot === 1}
        <div class="bg-[#0B3441] rounded-[25px] h-[50px] w-[50px]" />
      {:else}
        <div class="bg-[#2DD3E3] rounded-[25px] h-[50px] w-[50px]" />
      {/if}
    {/each}
  </div>
</section>