<!-- src/routes/players/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  interface Player {
      name: string;
      role?: string;
  }

  interface Team {
      id: number;
      name: string;
      image_url: string | null;
      rank: number | null;
      players: Player[];
  }

  let openTeamId: number | null = null;

  function toggleTeam(teamId: number) {
      openTeamId = openTeamId === teamId ? null : teamId;
  }
</script>

<h1>Top CSGO Csapatok</h1>

{#if data.error}
  <p class="error">{data.error}</p>
{:else}
  <section>
      <h2>Global Valve Ranking - Top 30</h2>
      {#if data.teams.length === 0}
          <p>Nincsenek csapatok.</p>
      {:else}
          <div class="team-list">
              {#each data.teams as team (team.id)}
                  <div class="team-card">
                      <div class="team-header" on:click={() => toggleTeam(team.id)}>
                          <span class="team-rank">#{team.rank}</span>
                          {#if team.image_url}
                              <img src={team.image_url} alt={team.name} class="team-logo" />
                          {/if}
                          <span class="team-name">{team.name}</span>
                          <span class="toggle-icon">{openTeamId === team.id ? '▲' : '▼'}</span>
                      </div>
                      {#if openTeamId === team.id}
                          <div class="team-details">
                              <h3>Játékosok és edző</h3>
                              {#if team.players && team.players.length > 0}
                                  <ul>
                                      {#each team.players as player}
                                          {#if !player.role || player.role === 'player'}
                                              <li>{player.name} (Játékos)</li>
                                          {/if}
                                      {/each}
                                      {#each team.players as player}
                                          {#if player.role === 'coach'}
                                              <li>{player.name} (Edző)</li>
                                          {/if}
                                      {/each}
                                  </ul>
                              {:else}
                                  <p>Nincsenek játékosok.</p>
                              {/if}
                          </div>
                      {/if}
                  </div>
              {/each}
          </div>
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
  }

  h2 {
      margin-bottom: 1rem;
      color: #ddd;
      text-align: center;
  }

  h3 {
      margin: 0.5rem 0;
      color: #bbb;
      font-size: 1rem;
  }

  .error {
      color: #ff4444;
      text-align: center;
      font-size: 1.2rem;
  }

  .team-list {
      max-width: 800px;
      margin: 0 auto;
      padding: 1rem;
  }

  .team-card {
      background: #2c2c2c;
      border-radius: 8px;
      margin-bottom: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      transition: transform 0.2s;
  }

  .team-card:hover {
      transform: translateY(-3px);
  }

  .team-header {
      display: flex;
      align-items: center;
      padding: 1rem;
      cursor: pointer;
      gap: 1rem;
  }

  .team-rank {
      font-size: 1.2rem;
      font-weight: bold;
      color: #00ff00;
  }

  .team-logo {
      width: 50px;
      height: 50px;
      object-fit: contain;
  }

  .team-name {
      font-size: 1.1rem;
      font-weight: 500;
      color: #ddd;
      flex: 1;
  }

  .toggle-icon {
      font-size: 1rem;
      color: #888;
  }

  .team-details {
      padding: 1rem;
      background: #3a3a3a;
      border-top: 1px solid #444;
  }

  .team-details ul {
      list-style: none;
      padding: 0;
      margin: 0;
  }

  .team-details li {
      padding: 0.3rem 0;
      font-size: 0.9rem;
      color: #bbb;
  }

  .team-details p {
      font-size: 0.9rem;
      color: #bbb;
      margin: 0;
  }

  /* Reszponzív dizájn */
  @media (max-width: 768px) {
      .team-list {
          padding: 0.5rem;
      }

      .team-header {
          padding: 0.8rem;
          gap: 0.8rem;
      }

      .team-rank {
          font-size: 1rem;
      }

      .team-logo {
          width: 40px;
          height: 40px;
      }

      .team-name {
          font-size: 1rem;
      }

      .team-details {
          padding: 0.8rem;
      }

      .team-details li {
          font-size: 0.85rem;
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

      .team-rank {
          font-size: 0.9rem;
      }

      .team-logo {
          width: 35px;
          height: 35px;
      }

      .team-name {
          font-size: 0.9rem;
      }

      .team-details li {
          font-size: 0.8rem;
      }
  }
</style>