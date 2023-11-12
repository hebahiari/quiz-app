import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Difficulty, QuestionState } from "./API";
import { fetchQuizQuestions } from "./API";
import QuestionCard from "./components/QuestionCard";
import { makeStyles } from "@mui/styles";
import "./App.css";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    color: "#DBDBDB",
  },
  circularProgress: {
    color: "#bc13fe",
  },
  titleContainer: {
    textDecoration: "none",
    color: "white",
  },
  title: {
    fontSize: "2.5rem",
  },
  difficultyButton: {
    border: "1px solid white",
    color: "white",
  },
  loadingBox: {
    display: "flex",
  },
  nextButton: {
    width: "200px",
    backgroundColor: "#9A58B3ff",
    "&:hover": {
      backgroundColor: "#9A58B3bb",
    },
  },
  gameOverButton: {
    backgroundColor: "#9A58B3ff",
    "&:hover": {
      backgroundColor: "#9A58B3bb",
    },
  },
  timeLeftText: {
    variant: "subtitle1",
  },
  timeLeftGrid: {
    minHeight: "30px",
  },
  scoreText: {
    variant: "h6",
  },
}));

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState(Difficulty.EASY);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const classes = useStyles();

  const startTimer = () => {
    setTimeLeft(10);
    const newTimer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    setTimer(newTimer);
  };

  const resetTimer = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (timeLeft === 0) {
      const randomAnswer =
        questions[currentQuestionNumber].answers[
          Math.floor(
            Math.random() * questions[currentQuestionNumber].answers.length
          )
        ];
      checkAnswer(randomAnswer);
      resetTimer();
    }
  }, [timeLeft]);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    try {
      const newQuestions = await fetchQuizQuestions(totalQuestions, difficulty);

      setQuestions(newQuestions);
      setScore(0);
      setUserAnswers([]);
      setCurrentQuestionNumber(0);
      setLoading(false);
      startTimer();
    } catch (error) {
      console.error("Error fetching questions:", error);
      setLoading(false);
      setGameOver(true);
    }
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement> | string) => {
    if (!gameOver) {
      let answer = null;
      if (typeof e === "string") {
        answer = e;
      } else {
        answer = e.currentTarget.value;
      }
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

      setSelectedAnswer(answer);
      resetTimer();
    }
  };

  const nextQuestion = () => {
    resetTimer();
    const nextQuestionNumber = currentQuestionNumber + 1;

    if (nextQuestionNumber === totalQuestions) {
      setGameOver(true);
    } else {
      setCurrentQuestionNumber(nextQuestionNumber);
      setSelectedAnswer(null);
      startTimer();
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className={classes.root}
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
        className="neonBorder"
      >
        <div className="cover"></div>
        <a href="#" onClick={refreshPage} className="titleContainer">
          <h1 className="title">Trivia Night</h1>
        </a>

        {gameOver ? (
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap={1}
          >
            <Typography>Select Difficulty:</Typography>
            <Grid container gap={1} justifyContent="center">
              {Object.values(Difficulty).map((difficultyOption) => (
                <Button
                  key={difficultyOption}
                  variant="outlined"
                  size="small"
                  style={{
                    backgroundColor:
                      difficulty === difficultyOption ? "#BABABC" : "#ffffff00",
                  }}
                  classes={{ root: classes.difficultyButton }}
                  onClick={() => {
                    setDifficulty(difficultyOption);
                  }}
                >
                  {difficultyOption}
                </Button>
              ))}
            </Grid>
          </Grid>
        ) : null}

        {loading && (
          <Box className={classes.loadingBox}>
            <CircularProgress className={classes.circularProgress} />
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
              classes={{ root: classes.nextButton }}
            >
              Next Question
            </Button>
          )}
        {userAnswers.length === totalQuestions ? (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            direction="column"
          >
            <Typography variant="h6">Game Over!</Typography>
            <Typography className="score">Your score: {score}</Typography>
          </Grid>
        ) : null}
        {gameOver || userAnswers.length === totalQuestions ? (
          <Button
            size="large"
            variant="contained"
            onClick={startTrivia}
            fullWidth
            classes={{ root: classes.gameOverButton }}
          >
            {userAnswers.length === totalQuestions ? "Restart" : "Start"}
          </Button>
        ) : null}
        {!gameOver && (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            className={classes.timeLeftGrid}
          >
            {timeLeft > 0 &&
              !gameOver &&
              userAnswers.length <= currentQuestionNumber && (
                <Typography variant="subtitle1">
                  Time Left: {timeLeft} seconds
                </Typography>
              )}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default App;
