import type { PageServerLoad } from './$types';

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

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const apiKey = import.meta.env.VITE_PANDASCORE_API_KEY;
    if (!apiKey) {
      throw new Error('API key is not defined in .env');
    }

    // Lekérjük a csapatokat
    const teamsResponse = await fetch(
      `https://api.pandascore.co/csgo/teams?per_page=20&token=${apiKey}`
    );
    if (!teamsResponse.ok) {
      throw new Error(`PandaScore API error: ${teamsResponse.statusText}`);
    }
    let teams: Team[] = await teamsResponse.json();

    // Ha a players mező üres, külön lekérjük a játékosokat
    teams = await Promise.all(
      teams.map(async (team: Team) => {
        if (!team.players || team.players.length === 0) {
          const playersResponse = await fetch(
            `https://api.pandascore.co/csgo/teams/${team.id}/players?token=${apiKey}`
          );
          if (playersResponse.ok) {
            const players: Player[] = await playersResponse.json();
            return { ...team, players };
          }
        }
        return team;
      })
    );

    const rankedTeams = teams
      .filter(team => team.rank !== null)
      .sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999))
      .slice(0, 30);

    return {
      teams: rankedTeams
    };
  } catch (error) {
    console.error('PandaScore API error:', error);
    return {
      teams: [],
      error: 'Nem sikerült betölteni a csapatokat'
    };
  }
};