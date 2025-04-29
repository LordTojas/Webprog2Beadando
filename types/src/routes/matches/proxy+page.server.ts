// @ts-nocheck
import type { PageServerLoad } from './$types';

interface Match {
  name: string;
  status: 'not_started' | 'running' | 'finished';
  begin_at: string | null;
  opponents: Array<{
    opponent: {
      name: string;
      image_url: string | null;
    };
  }>;
}

export const load = async () => {
  try {
    const apiKey = import.meta.env.VITE_PANDASCORE_API_KEY;
    console.log('API kulcs tartalma:', apiKey); // Pontosan kiírja a kulcsot
    if (!apiKey) {
      throw new Error('API key is not defined in .env');
    }

    console.log('API hívás: Összes meccs lekérése...');
    const response = await fetch(`https://api.pandascore.co/csgo/matches?token=${apiKey}`);
    console.log('API válasz státusza:', response.status, response.statusText);
    if (!response.ok) {
      throw new Error(`PandaScore API error: ${response.statusText}`);
    }
    const matches: Match[] = await response.json();
    console.log('Összes meccs:', matches.length);

    const pastMatches = matches
      .filter(match => match.status === 'finished')
      .slice(0, 5);
    const runningMatches = matches
      .filter(match => match.status === 'running')
      .slice(0, 5);
    const upcomingMatches = matches
      .filter(match => match.status === 'not_started')
      .slice(0, 5);

    return {
      pastMatches,
      runningMatches,
      upcomingMatches
    };
  } catch (error) {
    console.error('PandaScore API error:', error);
    return {
      pastMatches: [],
      runningMatches: [],
      upcomingMatches: [],
      error: 'Nem sikerült betölteni a meccseket'
    };
  }
};;null as any as PageServerLoad;