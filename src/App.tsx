import React, { useState } from "react";
import { fetchQuizQuestions } from "./API";
//Components
import QuestionCard from "./components/QuestionCard";
//Types
import { Difficulty, QuestionState } from "./API";

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState(Difficulty.EASY)
  const [totalQuestions, setTotalQuestions] = useState(10)
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(totalQuestions, difficulty);

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setCurrentQuestionNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      // users answer
      const answer = e.currentTarget.value;
      // check if answer is correct
      const correct =
        questions[currentQuestionNumber].correct_answer === answer;
      if (correct) setScore((prev) => prev + 1);
      // save user answer
      const answerObject = {
        question: questions[currentQuestionNumber].question,
        answer: answer,
        correct: correct,
        correctAnswer: questions[currentQuestionNumber].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    const nextQuestionNumber = currentQuestionNumber + 1;

    if (nextQuestionNumber === totalQuestions) {
      setGameOver(true);
    } else {
      setCurrentQuestionNumber(nextQuestionNumber);
    }
  };

  return (
    <div className="flex flex-col	justify-end items-center gap-2">
      <h1 className="text-3xl font-bold">Trivia</h1>

{gameOver && (
  <div>
    <p>Select Difficulty:</p>
    <button onClick={() => {setDifficulty(Difficulty.EASY)}}>Easy</button>
    <button onClick={() => {setDifficulty(Difficulty.MEDIUM)}}>Meduim</button>
    <button onClick={() => {setDifficulty(Difficulty.HARD)}}>Hard</button>
  </div>
)}

      {loading && <p>Loading Questions ... </p>}
      {!loading && !gameOver && (
        <QuestionCard
          questionNumber={currentQuestionNumber + 1}
          totalQuestions={totalQuestions}
          question={questions[currentQuestionNumber].question}
          answers={questions[currentQuestionNumber].answers}
          userAnswer={
            userAnswers ? userAnswers[currentQuestionNumber] : undefined
          }
          callback={checkAnswer}
        />
      )}
      {!loading &&
        !gameOver &&
        
        currentQuestionNumber !== totalQuestions - 1 && (
          <button disabled={userAnswers.length === currentQuestionNumber + 1 ? false : true} className="bg-white hover:bg-gray-100 hover:disabled:bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 disabled:border-gray-200 rounded shadow disabled:text-gray-300" onClick={nextQuestion}>
            Next Question
          </button>
        )}
              {userAnswers.length === totalQuestions ? (<><h3>Game Over!</h3><p className="score">Score: {score}</p></>) : null}
              {gameOver || userAnswers.length === totalQuestions ? (
        <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={startTrivia}>
          {userAnswers.length === totalQuestions ? "Restart" : "Start"}
        </button>
      ) : null}
    </div>
  );
};

export default App;
