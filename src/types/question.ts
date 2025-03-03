export interface Question {
    id: number;
    category: string;
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface QuestionBank {
    id: number;
    name: string;
    questions: Question[];
}
