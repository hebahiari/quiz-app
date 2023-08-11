export enum Difficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
}

export type Question = {
    category: string;
    correct_answer: string;
    difficulty: string;
    incorrect_answer: string[];
    question: string;
    type: string;
}

export type QuestionState = Question & {answers: string[]};



export const fetchQuizQuestions = async (amount: number, difficulty: Difficulty) => {
const endpoint =`https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`
// an await for the fetch and an await for it to be turned to json
const data = await (await fetch(endpoint)).json();
return data.results.map((question: Question) => ({...question, answers: [...question.incorrect_answer, question.correct_answer]}))}

