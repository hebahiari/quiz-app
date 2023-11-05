import React, { useState } from "react";
import { fetchQuizQuestions } from "./API";
// Components
import QuestionCard from "./components/QuestionCard";
// Types
import { Difficulty, QuestionState } from "./API";
// MUI
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState(Difficulty.EASY);
  const [totalQuestions, setTotalQuestions] = useState(10);
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
      // check if the answer is correct
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Grid
        container
        spacing={2}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <h1>Trivia</h1>
        {gameOver && (
          <Grid
            container
            spacing={2}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <p>Select Difficulty:</p>
            <Grid container justifyContent="center" gap={1}>
              <Button
                variant="outlined"
                size="small"
                style={{
                  backgroundColor:
                    difficulty === Difficulty.EASY ? "azure" : "white",
                }}
                onClick={() => {
                  setDifficulty(Difficulty.EASY);
                }}
              >
                Easy
              </Button>
              <Button
                variant="outlined"
                size="small"
                style={{
                  backgroundColor:
                    difficulty === Difficulty.MEDIUM ? "azure" : "white",
                }}
                onClick={() => {
                  setDifficulty(Difficulty.MEDIUM);
                }}
              >
                Medium
              </Button>
              <Button
                variant="outlined"
                size="small"
                style={{
                  backgroundColor:
                    difficulty === Difficulty.HARD ? "azure" : "white",
                }}
                onClick={() => {
                  setDifficulty(Difficulty.HARD);
                }}
              >
                Hard
              </Button>
            </Grid>
          </Grid>
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
            <Button
              disabled={
                userAnswers.length === currentQuestionNumber + 1 ? false : true
              }
              onClick={nextQuestion}
            >
              Next Question
            </Button>
          )}
        {userAnswers.length === totalQuestions ? (
          <>
            <h3>Game Over!</h3>
            <p className="score">Score: {score}</p>
          </>
        ) : null}
        {gameOver || userAnswers.length === totalQuestions ? (
          <Button size="large" variant="contained" onClick={startTrivia}>
            {userAnswers.length === totalQuestions ? "Restart" : "Start"}
          </Button>
        ) : null}
      </Grid>
    </div>
  );
};

export default App;
