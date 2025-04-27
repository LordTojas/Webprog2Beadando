<!-- src/routes/matches/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';
  import { format } from 'date-fns';

  export let data: PageData;
</script>

<h1>Counter-Strike meccsek</h1>

{#if data.error}
  <p class="error">{data.error}</p>
{:else}
  <!-- Múltbeli meccsek -->
  <section>
      <h2>Előző meccsek</h2>
      <div class="match-grid">
          {#each data.pastMatches as match}
              <div class="match-card">
                  <div class="match-teams">
                      <div class="team">
                          {#if match.opponents[0]?.opponent?.image_url}
                              <img src={match.opponents[0].opponent.image_url} alt={match.opponents[0].opponent.name} class="team-logo" />
                          {/if}
                          <span>{match.opponents[0]?.opponent?.name || 'TBD'}</span>
                      </div>
                      <span class="vs">vs</span>
                      <div class="team">
                          {#if match.opponents[1]?.opponent?.image_url}
                              <img src={match.opponents[1].opponent.image_url} alt={match.opponents[1].opponent.name} class="team-logo" />
                          {/if}
                          <span>{match.opponents[1]?.opponent?.name || 'TBD'}</span>
                      </div>
                  </div>
                  <div class="match-time">
                      {#if match.begin_at}
                          <span>{format(new Date(match.begin_at), 'yyyy.MM.dd HH:mm')}</span>
                      {:else}
                          <span>Nincs időpont</span>
                      {/if}
                  </div>
              </div>
          {/each}
      </div>
  </section>

  <!-- Jelenleg futó meccsek -->
  <section>
      <h2>Jelenleg futó meccsek</h2>
      {#if data.runningMatches.length === 0}
          <p>Nincsenek jelenleg futó meccsek.</p>
      {:else}
          <div class="match-grid">
              {#each data.runningMatches as match}
                  <div class="match-card">
                      <div class="match-teams">
                          <div class="team">
                              {#if match.opponents[0]?.opponent?.image_url}
                                  <img src={match.opponents[0].opponent.image_url} alt={match.opponents[0].opponent.name} class="team-logo" />
                              {/if}
                              <span>{match.opponents[0]?.opponent?.name || 'TBD'}</span>
                          </div>
                          <span class="vs">vs</span>
                          <div class="team">
                              {#if match.opponents[1]?.opponent?.image_url}
                                  <img src={match.opponents[1].opponent.image_url} alt={match.opponents[1].opponent.name} class="team-logo" />
                              {/if}
                              <span>{match.opponents[1]?.opponent?.name || 'TBD'}</span>
                          </div>
                      </div>
                      <div class="match-time">
                          {#if match.begin_at}
                              <span>{format(new Date(match.begin_at), 'yyyy.MM.dd HH:mm')}</span>
                          {:else}
                              <span>Nincs időpont</span>
                          {/if}
                      </div>
                  </div>
              {/each}
          </div>
      {/if}
  </section>

  <!-- Közelgő meccsek -->
  <section>
      <h2>Közelgő meccsek</h2>
      <div class="match-grid">
          {#each data.upcomingMatches as match}
              <div class="match-card">
                  <div class="match-teams">
                      <div class="team">
                          {#if match.opponents[0]?.opponent?.image_url}
                              <img src={match.opponents[0].opponent.image_url} alt={match.opponents[0].opponent.name} class="team-logo" />
                          {/if}
                          <span>{match.opponents[0]?.opponent?.name || 'TBD'}</span>
                      </div>
                      <span class="vs">vs</span>
                      <div class="team">
                          {#if match.opponents[1]?.opponent?.image_url}
                              <img src={match.opponents[1].opponent.image_url} alt={match.opponents[1].opponent.name} class="team-logo" />
                          {/if}
                          <span>{match.opponents[1]?.opponent?.name || 'TBD'}</span>
                      </div>
                  </div>
                  <div class="match-time">
                      {#if match.begin_at}
                          <span>{format(new Date(match.begin_at), 'yyyy.MM.dd HH:mm')}</span>
                      {:else}
                          <span>Nincs időpont</span>
                      {/if}
                  </div>
              </div>
          {/each}
      </div>
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
  }

  h2 {
      margin-bottom: 1rem;
      color: #ddd;
      text-align: center;
  }

  .error {
      color: #ff4444;
      text-align: center;
      font-size: 1.2rem;
  }

  .match-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      padding: 1rem;
      max-width: 1200px;
      margin: 0 auto;
  }

  .match-card {
      background: #2c2c2c;
      border-radius: 10px;
      padding: 1.5rem;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: transform 0.2s;
  }

  .match-card:hover {
      transform: translateY(-5px);
  }

  .match-teams {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 1rem;
  }

  .team {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
  }

  .team-logo {
      width: 60px;
      height: 60px;
      object-fit: contain;
      margin-bottom: 0.5rem;
  }

  .team span {
      font-size: 1rem;
      color: #ddd;
      font-weight: 500;
  }

  .vs {
      font-size: 1.2rem;
      color: #888;
      font-weight: bold;
  }

  .match-time {
      margin-top: 1rem;
      font-size: 0.9rem;
      color: #bbb;
  }

  /* Reszponzív dizájn */
  @media (max-width: 768px) {
      .match-grid {
          grid-template-columns: 1fr;
          padding: 0.5rem;
      }

      .match-teams {
          flex-direction: column;
          gap: 0.5rem;
      }

      .team-logo {
          width: 50px;
          height: 50px;
      }

      .vs {
          margin: 0.5rem 0;
      }
  }

  @media (max-width: 480px) {
      h1 {
          font-size: 1.5rem;
          padding: 1rem 0;
      }

      h2 {
          font-size: 1.2rem;
      }

      .match-card {
          padding: 1rem;
      }

      .team span {
          font-size: 0.9rem;
      }

      .match-time {
          font-size: 0.8rem;
      }
  }
</style>