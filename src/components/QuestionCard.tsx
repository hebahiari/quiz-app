import React from "react";

type Props = {
  question: string;
  answers: string[];
  callback: any;
  userAnswer: any;
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
  <div>
    <p className="number">
      Question: {questionNumber} / {totalQuestions}
    </p>
    {/* <p dangerouslySetInnerHTML={{ __html: question }}></p> */}
    <p>{question}</p>
    <div className="answers">
      {answers.map((answer) => (
        <div className="answer">
          <button disabled={userAnswer} onClick={callback}>
            {/* <span dangerouslySetInnerHTML={{ __html: answer }} /> */}
            <span>{answer}</span>
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default QuestionCard;
