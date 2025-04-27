import type { PageServerLoad } from './$types';

interface GuessQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

const questions: GuessQuestion[] = [
    {
        question: "Melyik parancsot használod, ha ellenséget látsz?",
        options: ["Enemy Spotted", "Need Backup", "Hold Position", "Sector Clear"],
        correctAnswer: "Enemy Spotted"
    },
    {
        question: "Mit mondasz, ha azt akarod, hogy a csapatod együtt maradjon?",
        options: ["Stick Together", "Follow Me", "Cover Me", "Go Go Go"],
        correctAnswer: "Stick Together"
    },
    {
        question: "Melyik parancsot használod, ha azt akarod, hogy a csapatod tartsa a pozícióját?",
        options: ["Hold Position", "Follow Me", "Regroup Team", "Enemy Down"],
        correctAnswer: "Hold Position"
    },
    {
        question: "Mit mondasz, ha azt akarod, hogy a csapatod azonnal menjen előre?",
        options: ["Go Go Go", "Need Backup", "Sector Clear", "Taking Fire"],
        correctAnswer: "Go Go Go"
    },
    {
        question: "Melyik parancsot használod, ha segítséget kérsz, mert tüzet kapsz?",
        options: ["Taking Fire", "Enemy Spotted", "Cover Me", "Report In"],
        correctAnswer: "Taking Fire"
    }
];

export const load: PageServerLoad = async () => {
    return {
        questions
    };
};