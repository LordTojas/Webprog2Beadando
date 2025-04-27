<!-- src/routes/guess/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';

    interface GuessQuestion {
        question: string;
        options: string[];
        correctAnswer: string;
    }

    export let data: { questions: GuessQuestion[] };
    let questions: GuessQuestion[] = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let feedback: string | null = null;
    let gameOver = false;

    // Pontszám betöltése localStorage-ból
    onMount(() => {
        const savedScore = localStorage.getItem('guessGameScore');
        if (savedScore) {
            score = parseInt(savedScore, 10);
        }

        // Kérdések betöltése a data-ból
        questions = data.questions || [];
    });

    function checkAnswer(selectedOption: string) {
        const currentQuestion = questions[currentQuestionIndex];
        if (selectedOption === currentQuestion.correctAnswer) {
            score += 1;
            feedback = 'Helyes válasz! 🎉';
            localStorage.setItem('guessGameScore', score.toString());
        } else {
            feedback = `Hibás válasz! A helyes válasz: ${currentQuestion.correctAnswer}`;
        }

        if (currentQuestionIndex + 1 < questions.length) {
            setTimeout(() => {
                currentQuestionIndex += 1;
                feedback = null;
            }, 2000);
        } else {
            gameOver = true;
        }
    }

    function restartGame() {
        currentQuestionIndex = 0;
        score = 0;
        feedback = null;
        gameOver = false;
        localStorage.setItem('guessGameScore', '0');
    }
</script>

<h1>CS:GO Rádióparancs Találós Játék</h1>

<section class="game-section">
    {#if questions.length === 0}
        <p class="error">Nem sikerült betölteni a kérdéseket.</p>
    {:else if gameOver}
        <div class="game-over">
            <h2>Játék vége!</h2>
            <p>Végső pontszám: {score} / {questions.length}</p>
            <button on:click={restartGame}>Újrakezdés</button>
        </div>
    {:else}
        <div class="game-container">
            <h2>Kérdés {currentQuestionIndex + 1}/{questions.length}</h2>
            <p class="score">Pontszám: {score}</p>
            <p class="question">{questions[currentQuestionIndex].question}</p>
            <div class="options">
                {#each questions[currentQuestionIndex].options as option}
                    <button
                        on:click={() => checkAnswer(option)}
                        disabled={feedback !== null}
                        class="option-button"
                    >
                        {option}
                    </button>
                {/each}
            </div>
            {#if feedback}
                <p class="feedback {feedback.includes('Helyes') ? 'success' : 'error'}">{feedback}</p>
            {/if}
        </div>
    {/if}
</section>

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

    .game-section {
        max-width: 800px;
        margin: 0 auto;
        padding: 1rem;
    }

    .game-container {
        background: #2c2c2c;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    .score {
        text-align: center;
        font-size: 1.2rem;
        color: #00ff00;
        margin-bottom: 1rem;
    }

    .question {
        text-align: center;
        font-size: 1.4rem;
        margin-bottom: 2rem;
        color: #ddd;
    }

    .options {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .option-button {
        padding: 0.8rem;
        background: #444;
        color: #fff;
        border: none;
        border-radius: 8px;
        font-size: 1.1rem;
        cursor: pointer;
        transition: background 0.2s;
    }

    .option-button:hover {
        background: #555;
    }

    .option-button:disabled {
        background: #333;
        cursor: not-allowed;
        opacity: 0.6;
    }

    .feedback {
        text-align: center;
        font-size: 1.2rem;
        margin-top: 1rem;
    }

    .success {
        color: #00ff00;
    }

    .error {
        color: #ff4444;
    }

    .game-over {
        text-align: center;
        background: #2c2c2c;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    .game-over p {
        font-size: 1.4rem;
        margin-bottom: 1rem;
        color: #ddd;
    }

    .game-over button {
        padding: 0.8rem 1.5rem;
        background: #00ff00;
        color: #000;
        border: none;
        border-radius: 8px;
        font-size: 1.1rem;
        cursor: pointer;
        transition: background 0.2s;
    }

    .game-over button:hover {
        background: #00cc00;
    }

    /* Reszponzív dizájn */
    @media (max-width: 768px) {
        .game-section {
            padding: 0.5rem;
        }

        .game-container {
            padding: 1.5rem;
        }

        .question {
            font-size: 1.2rem;
        }

        .option-button {
            font-size: 1rem;
            padding: 0.6rem;
        }

        .feedback {
            font-size: 1rem;
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

        .question {
            font-size: 1.1rem;
        }

        .option-button {
            font-size: 0.9rem;
        }
    }
</style>