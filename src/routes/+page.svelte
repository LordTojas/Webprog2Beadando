<!-- src/routes/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { invalidateAll } from '$app/navigation';

    interface NewsItem {
        title: string;
        type: 'match' | 'transfer';
    }

    interface MatchResult {
        title: string;
        result: string;
    }

    export let data: { news: NewsItem[], matchResults: MatchResult[], userId: string, error?: string };
    $: news = data.news;
    $: matchResults = data.matchResults;
    let userId: string = data.userId;

    onMount(() => {
        console.log('Kliens: data.news:', data.news);
        console.log('Kliens: data.matchResults:', data.matchResults);
        console.log('Kliens: userId:', userId);
    });
</script>

<h1>Counter-Strike hírek</h1>

{#if data.error}
    <p class="error">{data.error}</p>
{:else}
    <section class="news-section">
        <h2>Legfrissebb hírek</h2>
        {#if news.length === 0}
            <p>Nincsenek hírek.</p>
        {:else}
            <div class="news-carousel">
                {#each news as newsItem}
                    <div class="news-card">
                        <div class="news-content">
                            <span class="news-title">{newsItem.title}</span>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </section>

    <section class="match-results-section">
        <h2>Legutóbbi meccseredmények</h2>
        {#if matchResults.length === 0}
            <p>Nincsenek meccseredmények.</p>
        {:else}
            <ul class="match-results-list">
                {#each matchResults as match}
                    <li class="match-result-item">
                        <span class="match-title">{match.title}</span>
                        <span class="match-result">{match.result}</span>
                    </li>
                {/each}
            </ul>
        {/if}
    </section>
{/if}

<style>
    :global(body) {
        font-family: Arial, sans-serif;
        background-color: #1a1a1a;
        color: #fff;
        margin: 0;
        padding: 0;
    }

    h1 {
        text-align: center;
        padding: 2rem 0;
        color: #fff;
        font-size: 2.5rem;
    }

    h2 {
        margin-bottom: 1.5rem;
        color: #ddd;
        text-align: center;
        font-size: 1.8rem;
    }

    .error {
        color: #ff4444;
        text-align: center;
        font-size: 1.2rem;
    }

    .news-section {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem;
    }

    .news-carousel {
        display: flex;
        overflow-x: auto;
        gap: 1.5rem;
        padding-bottom: 1rem;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
    }

    .news-carousel::-webkit-scrollbar {
        height: 8px;
    }

    .news-carousel::-webkit-scrollbar-track {
        background: #333;
        border-radius: 4px;
    }

    .news-carousel::-webkit-scrollbar-thumb {
        background: #00ff00;
        border-radius: 4px;
    }

    .news-card {
        flex: 0 0 auto;
        width: 300px;
        background: #2c2c2c;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        scroll-snap-align: start;
        transition: transform 0.2s;
    }

    .news-card:hover {
        transform: translateY(-5px);
    }

    .news-content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .news-title {
        color: #000; /* Fekete betűszín */
        font-size: 1.3rem; /* Nagyobb betűméret */
        font-weight: 600;
        line-height: 1.4;
    }

    .match-results-section {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 1rem;
    }

    .match-results-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .match-result-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #2c2c2c;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 0.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        transition: transform 0.2s;
    }

    .match-result-item:hover {
        transform: translateY(-3px);
    }

    .match-title {
        color: #ddd;
        font-size: 1.1rem;
        font-weight: 500;
        flex: 1;
    }

    .match-result {
        color: #00ff00;
        font-size: 1.1rem;
        font-weight: bold;
        background: #444;
        padding: 0.3rem 0.6rem;
        border-radius: 4px;
    }

    /* Reszponzív dizájn */
    @media (max-width: 768px) {
        .news-section,
        .match-results-section {
            padding: 0.5rem;
        }

        .news-carousel {
            gap: 1rem;
        }

        .news-card {
            width: 250px;
            padding: 1rem;
        }

        .news-title {
            font-size: 1.1rem;
        }

        .match-result-item {
            padding: 0.8rem;
        }

        .match-title {
            font-size: 1rem;
        }

        .match-result {
            font-size: 0.9rem;
            padding: 0.2rem 0.5rem;
        }
    }

    @media (max-width: 480px) {
        h1 {
            font-size: 1.8rem;
            padding: 1rem 0;
        }

        h2 {
            font-size: 1.4rem;
        }

        .news-card {
            width: 200px;
        }

        .news-title {
            font-size: 0.95rem;
        }

        .match-title {
            font-size: 0.9rem;
        }

        .match-result {
            font-size: 0.8rem;
        }
    }
</style>