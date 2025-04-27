import type { PageServerLoad, Actions } from './$types';

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

let topics: Topic[] = [];
let topicCounter = 1;

export const load: PageServerLoad = async ({ cookies }) => {
  // userId generálása szerveroldalon
  let userId = cookies.get('userId');
  if (!userId) {
    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    userId = `Guest${randomNum}`;
    cookies.set('userId', userId, { path: '/', maxAge: 60 * 60 * 24 * 30 }); // 30 napig érvényes cookie
  }

  console.log('Szerver: topics értéke:', topics);
  return {
    topics,
    userId
  };
};

export const actions: Actions = {
  createTopic: async ({ request }) => {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const initialComment = formData.get('initialComment') as string;
    const userId = formData.get('userId') as string;

    console.log('createTopic: title:', title, 'initialComment:', initialComment, 'userId:', userId);

    if (!title || title.length > 250 || !initialComment || initialComment.length > 250) {
      return { success: false, error: 'A cím és a komment maximum 250 karakter lehet.' };
    }

    const newTopic: Topic = {
      id: topicCounter++,
      title,
      comments: [
        {
          userId,
          content: initialComment,
          timestamp: new Date().toISOString()
        }
      ]
    };

    topics.push(newTopic);
    console.log('createTopic: Új topic hozzáadva, topics:', topics);
    return { success: true };
  },

  addComment: async ({ request }) => {
    const formData = await request.formData();
    const topicId = parseInt(formData.get('topicId') as string);
    const content = formData.get('content') as string;
    const userId = formData.get('userId') as string;

    console.log('addComment: topicId:', topicId, 'content:', content, 'userId:', userId);

    if (!content || content.length > 250) {
      return { success: false, error: 'A komment maximum 250 karakter lehet.' };
    }

    const topic = topics.find(t => t.id === topicId);
    if (!topic) {
      return { success: false, error: 'Topic nem található.' };
    }

    topic.comments.push({
      userId,
      content,
      timestamp: new Date().toISOString()
    });

    console.log('addComment: Komment hozzáadva, topic:', topic);
    return { success: true };
  }
};