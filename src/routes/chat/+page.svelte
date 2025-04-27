<!-- src/routes/chat/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { invalidateAll } from '$app/navigation';

    interface Comment {
        userId: string;
        content: string;
        timestamp: string;
    }

    interface Topic {
        id: number;
        title: string;
        comments: Comment[];
    }

    export let data: { topics: Topic[], userId: string };
    $: topics = data.topics; // Reaktívan frissítjük a topics változót
    let selectedTopicId: number | null = null;
    let userId: string = data.userId; // Szerverről kapott userId
    let newTopicTitle = '';
    let newTopicComment = '';
    let newComment = '';

    // Kiválasztott topic reaktív meghatározása
    $: selectedTopic = topics.find(topic => topic.id === selectedTopicId) || null;

    onMount(() => {
        console.log('Kliens: data.topics:', data.topics);
        console.log('Kliens: userId:', userId);

        // Alapértelmezett topic kiválasztása, ha van
        if (topics.length > 0) {
            selectedTopicId = topics[0].id;
        }
        console.log('Kliens: selectedTopic:', selectedTopic);
    });

    // Topic kiválasztása
    function selectTopic(topicId: number) {
        selectedTopicId = topicId;
        console.log('Kliens: Kiválasztott topic ID:', selectedTopicId, 'Topic:', selectedTopic);
    }

    // Profil ikon színe generálása a felhasználó neve alapján
    function getProfileColor(userId: string) {
        if (!userId) return '#888'; // Alapértelmezett szín, ha userId undefined
        const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 60%)`;
    }

    // Topic létrehozása űrlap elküldése
    async function createTopic() {
        const formData = new FormData();
        formData.append('title', newTopicTitle);
        formData.append('initialComment', newTopicComment);
        formData.append('userId', userId);

        const response = await fetch('/chat?/createTopic', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            newTopicTitle = '';
            newTopicComment = '';
            // Frissítjük a szerveroldali adatokat
            await invalidateAll();
            // Az új topic kiválasztása
            selectedTopicId = topics.length > 0 ? topics[topics.length - 1].id : null;
            console.log('Kliens: Új topic létrehozva, topics:', topics);
        } else {
            alert(result.error);
        }
    }

    // Komment hozzáadása
    async function addComment() {
        if (!selectedTopic) {
            alert('Kérlek, válassz egy topicot!');
            return;
        }

        const formData = new FormData();
        formData.append('topicId', selectedTopic.id.toString());
        formData.append('content', newComment);
        formData.append('userId', userId);

        const response = await fetch('/chat?/addComment', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            // Frissítjük a szerveroldali adatokat
            await invalidateAll();
            newComment = '';
            console.log('Kliens: Komment hozzáadva, selectedTopic:', selectedTopic);
        } else {
            alert(result.error);
        }
    }

    // Billentyűzet eseménykezelő a topic kiválasztásához
    function handleKeydown(event: KeyboardEvent, topic: Topic) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            selectTopic(topic.id);
        }
    }
</script>

<div class="chat-container">
    <div class="sidebar">
        <h2>Topicok</h2>
        <div class="topic-list">
            {#each topics as topic (topic.id)}
                <div
                    class="topic-item"
                    class:selected={selectedTopic?.id === topic.id}
                    role="button"
                    tabindex="0"
                    on:click={() => selectTopic(topic.id)}
                    on:keydown={(e) => handleKeydown(e, topic)}
                >
                    <h3>{topic.title || 'Névtelen topic'}</h3>
                    <p>{topic.comments[0]?.content || 'Nincs komment'}</p>
                </div>
            {/each}
        </div>
        <div class="create-topic">
            <h3>Új topic létrehozása</h3>
            <form on:submit|preventDefault={createTopic}>
                <input
                    type="text"
                    placeholder="Topic címe (max 250 karakter)"
                    maxlength="250"
                    bind:value={newTopicTitle}
                    required
                />
                <textarea
                    placeholder="Alap komment (max 250 karakter)"
                    maxlength="250"
                    bind:value={newTopicComment}
                    required
                ></textarea>
                <button type="submit">Topic létrehozása</button>
            </form>
        </div>
    </div>
    <div class="chat-content">
        {#if selectedTopic}
            <h2>{selectedTopic.title || 'Névtelen topic'}</h2>
            <div class="comments">
                {#each selectedTopic.comments as comment}
                    <div class="comment">
                        <div class="user-profile" style="background-color: {getProfileColor(comment.userId)}">
                            {comment.userId?.length > 5 ? comment.userId.charAt(5) : comment.userId?.charAt(0) || 'G'}
                        </div>
                        <div class="comment-content">
                            <span class="user-name">{comment.userId || 'Ismeretlen'}</span>
                            <p>{comment.content || 'Nincs tartalom'}</p>
                            <span class="timestamp">{comment.timestamp ? new Date(comment.timestamp).toLocaleString() : 'Ismeretlen idő'}</span>
                        </div>
                    </div>
                {/each}
            </div>
            <form on:submit|preventDefault={addComment} class="comment-form">
                <textarea
                    placeholder="Kommentelj (max 250 karakter)"
                    maxlength="250"
                    bind:value={newComment}
                    required
                ></textarea>
                <button type="submit">Komment küldése</button>
            </form>
        {:else}
            <p>Válassz egy topicot a bal oldali listáról.</p>
        {/if}
    </div>
</div>

<style>
    :global(body) {
        font-family: Arial, sans-serif;
        background-color: #1a1a1a;
        color: #fff;
        margin: 0;
        padding: 0;
    }

    .chat-container {
        display: flex;
        min-height: 100vh;
    }

    .sidebar {
        width: 300px;
        background: #2c2c2c;
        padding: 1rem;
        border-right: 1px solid #444;
        display: flex;
        flex-direction: column;
    }

    h2 {
        color: #ddd;
        text-align: center;
        margin-bottom: 1rem;
    }

    h3 {
        color: #bbb;
        font-size: 1rem;
        margin-bottom: 0.5rem;
    }

    .topic-list {
        flex: 1;
        overflow-y: auto;
    }

    .topic-item {
        padding: 0.8rem;
        margin-bottom: 0.5rem;
        background: #3a3a3a;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.2s;
    }

    .topic-item.selected {
        background: #555;
    }

    .topic-item:hover {
        background: #444;
    }

    .topic-item h3 {
        margin: 0;
        font-size: 1.1rem;
    }

    .topic-item p {
        margin: 0.3rem 0 0;
        font-size: 0.9rem;
        color: #bbb;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .create-topic {
        margin-top: 1rem;
    }

    .create-topic form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .create-topic input,
    .create-topic textarea {
        padding: 0.5rem;
        border: 1px solid #444;
        border-radius: 4px;
        background: #444;
        color: #fff;
        resize: none;
    }

    .create-topic button {
        padding: 0.5rem;
        background: #00ff00;
        color: #000;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
    }

    .create-topic button:hover {
        background: #00cc00;
    }

    .chat-content {
        flex: 1;
        padding: 2rem;
        overflow-y: auto;
    }

    .comments {
        margin-bottom: 2rem;
    }

    .comment {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: #2c2c2c;
        border-radius: 5px;
        margin-bottom: 0.5rem;
    }

    .user-profile {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        font-weight: bold;
        color: #fff;
    }

    .comment-content {
        flex: 1;
    }

    .user-name {
        font-size: 1rem;
        font-weight: 500;
        color: #ddd;
    }

    .comment-content p {
        margin: 0.3rem 0;
        font-size: 0.9rem;
        color: #bbb;
    }

    .timestamp {
        font-size: 0.8rem;
        color: #888;
    }

    .comment-form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .comment-form textarea {
        padding: 0.5rem;
        border: 1px solid #444;
        border-radius: 4px;
        background: #444;
        color: #fff;
        resize: none;
        height: 80px;
    }

    .comment-form button {
        padding: 0.5rem;
        background: #00ff00;
        color: #000;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
    }

    .comment-form button:hover {
        background: #00cc00;
    }

    /* Reszponzív dizájn */
    @media (max-width: 768px) {
        .chat-container {
            flex-direction: column;
        }

        .sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #444;
        }

        .chat-content {
            padding: 1rem;
        }

        .topic-item {
            padding: 0.6rem;
        }

        .topic-item h3 {
            font-size: 1rem;
        }

        .topic-item p {
            font-size: 0.85rem;
        }

        .user-profile {
            width: 35px;
            height: 35px;
            font-size: 1rem;
        }
    }

    @media (max-width: 480px) {
        h2 {
            font-size: 1.2rem;
        }

        .topic-item h3 {
            font-size: 0.9rem;
        }

        .topic-item p {
            font-size: 0.8rem;
        }

        .comment-content p {
            font-size: 0.85rem;
        }

        .user-name {
            font-size: 0.9rem;
        }
    }
</style>