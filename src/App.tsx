import React, { useState } from "react";
import { fetchQuizQuestions } from "./API";
import QuestionCard from "./components/QuestionCard";
import { Difficulty, QuestionState } from "./API";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

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
      const answer = e.currentTarget.value;
      const correct =
        questions[currentQuestionNumber].correct_answer === answer;
      if (correct) setScore((prev) => prev + 1);

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
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <Typography variant="h4">Trivia</Typography>
        {gameOver ? (
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography>Select Difficulty:</Typography>
            <Grid container spacing={1}>
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
        ) : null}
        {loading && (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        )}
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
                userAnswers.length <= currentQuestionNumber ? true : false
              }
              onClick={nextQuestion}
              variant="contained"
              size="large"
              fullWidth
            >
              Next Question
            </Button>
          )}
        {userAnswers.length === totalQuestions ? (
          <div>
            <Typography variant="h6">Game Over!</Typography>
            <Typography className="score">Score: {score}</Typography>
          </div>
        ) : null}
        {gameOver || userAnswers.length === totalQuestions ? (
          <Button
            size="large"
            variant="contained"
            onClick={startTrivia}
            fullWidth
          >
            {userAnswers.length === totalQuestions ? "Restart" : "Start"}
          </Button>
        ) : null}
      </Grid>
    </Grid>
  );
};

export default App;
