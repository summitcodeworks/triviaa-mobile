import {questionBanks} from "../types/questionBank.ts";
import {Question} from "../types/question.ts";

export const getQuestionsByCategory = (categoryId: number): Question[] => {
    const category = questionBanks.find(bank => bank.id === categoryId);
    return category?.questions || [];
};

export const getCategoryName = (categoryId: number): string => {
    const category = questionBanks.find(bank => bank.id === categoryId);
    return category?.name || "Unknown Category";
};
