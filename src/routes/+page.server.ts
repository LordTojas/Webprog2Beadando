import type { PageServerLoad } from './$types';
import { HLTV } from 'hltv'; // HLTV API használata tartalékként

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
  winner: { id: number; name: string } | null;
  results: Array<{ team_id: number; score: number }>;
}

interface NewsItem {
  title: string;
  type: 'match' | 'transfer';
}

interface MatchResult {
  title: string;
  result: string;
}

export const load: PageServerLoad = async ({ cookies }) => {
  let userId = cookies.get('userId');
  if (!userId) {
    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    userId = `Guest${randomNum}`;
    cookies.set('userId', userId, { path: '/', maxAge: 60 * 60 * 24 * 30 });
  }

  let news: NewsItem[] = [];
  let matchResults: MatchResult[] = [];

  try {
    // NewsAPI: Hírek lekérdezése
    const newsApiKey = import.meta.env.VITE_NEWSAPI_KEY;
    if (!newsApiKey) {
      throw new Error('NewsAPI key is not defined in .env');
    }

    const response = await fetch(
      `https://newsapi.org/v2/everything?q="counter-strike 2"+OR+cs2&language=en&sortBy=publishedAt&apiKey=${newsApiKey}`
    );
    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.statusText}`);
    }
    const newsData = await response.json();

    news = newsData.articles
      .filter((article: any) => {
        const title = article.title?.toLowerCase() || '';
        const description = article.description?.toLowerCase() || '';
        return (
          (title.includes('cs2') || title.includes('counter-strike 2') || description.includes('cs2') || description.includes('counter-strike 2'))
        );
      })
      .slice(0, 5)
      .map((article: any) => ({
        title: article.title,
        type: article.description?.toLowerCase().includes('transfer') ? 'transfer' : 'match'
      }));

    // Ha a NewsAPI nem ad híreket, használjuk az HLTV API-t
    if (news.length === 0) {
      try {
        const hltvNews = await HLTV.getNews(); // Eltávolítottuk a limit opciót
        news = hltvNews
          .slice(0, 5) // A hírek számát itt korlátozzuk
          .map((newsItem: any) => ({
            title: newsItem.title,
            type: newsItem.description?.toLowerCase().includes('transfer') ? 'transfer' : 'match'
          }));
      } catch (hltvError) {
        console.error('HLTV API error:', hltvError);
      }
    }

    // PandaScore API: Meccseredmények lekérdezése
    const pandaScoreApiKey = import.meta.env.VITE_PANDASCORE_API_KEY;
    if (pandaScoreApiKey) {
      const matchResponse = await fetch(`https://api.pandascore.co/csgo/matches/past?token=${pandaScoreApiKey}`);
      if (matchResponse.ok) {
        const matches: Match[] = await matchResponse.json();
        matchResults = matches.slice(0, 8).map(match => {
          const team1 = match.opponents[0]?.opponent?.name || 'TBD';
          const team2 = match.opponents[1]?.opponent?.name || 'TBD';
          const winner = match.winner?.name || 'Döntetlen';
          const result = match.results
            ? `${match.results[0]?.score || 0}-${match.results[1]?.score || 0}`
            : 'N/A';

          return {
            title: `${team1} vs ${team2}: ${winner} győzött`,
            result
          };
        });
      }
    }

    return {
      news,
      matchResults,
      userId
    };
  } catch (error) {
    console.error('API error:', error);
    return {
      news: [],
      matchResults: [],
      userId,
      error: 'Nem sikerült betölteni a híreket'
    };
  }
};