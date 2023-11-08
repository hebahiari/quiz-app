import React from "react";
import { Button, Typography, Grid } from "@mui/material";
import { AnswerObject } from "../App";

type Props = {
  question: string;
  answers: string[];
  callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
  userAnswer: AnswerObject | undefined;
  questionNumber: number;
  totalQuestions: number;
};

const QuestionCard: React.FC<Props> = ({
  question,
  answers,
  callback,
  userAnswer,
  questionNumber,
  totalQuestions,
}) => (
  <Grid container direction="column" alignItems="center">
    <Typography variant="subtitle1">
      Question: {questionNumber} / {totalQuestions}
    </Typography>
    <p dangerouslySetInnerHTML={{ __html: question }}></p>
    <Grid container direction="column">
      {answers.map((answer) => {
        const userClicked = userAnswer ? userAnswer.answer === answer : false;
        const isCorrect = userAnswer
          ? userAnswer.correctAnswer === answer
          : false;

        return (
          <div key={answer}>
            <Button
              disabled={userAnswer ? true : false}
              onClick={callback}
              value={answer}
              variant="contained"
              size="large"
              fullWidth
              style={{
                backgroundColor: isCorrect
                  ? "green"
                  : userClicked
                  ? "red"
                  : "default",
                color: userClicked ? "white" : "default",
              }}
            >
              <Typography variant="subtitle1">
                <span dangerouslySetInnerHTML={{ __html: answer }} />
              </Typography>
            </Button>
          </div>
        );
      })}
    </Grid>
  </Grid>
);

export default QuestionCard;
