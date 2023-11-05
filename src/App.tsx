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

const TOTAL_QUESTIONS = 10;
const DIFFICULTY = Difficulty.EASY;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS, DIFFICULTY);

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

    if (nextQuestionNumber === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setCurrentQuestionNumber(nextQuestionNumber);
    }
  };

  return (
    <div className="App">
      <h1>React Quiz</h1>
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
        <button className="start" onClick={startTrivia}>
          Start
        </button>
      ) : null}

      {!gameOver ? <p className="score">Score: {score}</p> : null}
      {loading && <p>Loading Questions ... </p>}
      {!loading && !gameOver && (
        <QuestionCard
          questionNumber={currentQuestionNumber + 1}
          totalQuestions={TOTAL_QUESTIONS}
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
        userAnswers.length === currentQuestionNumber + 1 &&
        currentQuestionNumber !== TOTAL_QUESTIONS - 1 && (
          <button className="next" onClick={nextQuestion}>
            Next Question
          </button>
        )}
    </div>
  );
};

export default App;
