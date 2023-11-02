import React, { useState } from "react";
import { fetchQuizQuestions } from "./API";
//Components
import QuestionCard from "./components/QuestionCard";

//Types
import { Difficulty, QuestionState } from "./API";

type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const TOTAL_QUESTIONS = 10;

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

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.HARD
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setCurrentQuestionNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {};

  const nextQuestion = () => {};

  return (
    <div className="App">
      <h1>React Quiz</h1>
      {gameOver || userAnswers.length == TOTAL_QUESTIONS ? (
        <button className="start" onClick={startTrivia}>
          Start
        </button>
      ) : null}

      {!gameOver ? <p className="score">Score:</p> : null}
      {loading ? <p>Loading Questions ... </p> : null}
      {/* <QuestionCard
        questionNumber={currentQuestionNumber + 1}
        totalQuestions={TOTAL_QUESTIONS}
        question={questions[currentQuestionNumber].question}
        answers={questions[currentQuestionNumber].answers}
        userAnswer={
          userAnswers ? userAnswers[currentQuestionNumber] : undefined
        }
        callback={checkAnswer}
      /> */}
      <button className="next" onClick={nextQuestion}>
        Next Question
      </button>
    </div>
  );
};

export default App;
