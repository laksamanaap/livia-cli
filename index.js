import * as cli from "@clack/prompts";
import { setTimeout } from "timers/promises";
import color from "picocolors";

let questionDatas = [
  ["Is Madrid the best team in the world?", ["Yes", "No"], 0],
  [
    "Why is Madrid the best team in the world?",
    ["Because of their history", "Because of their current squad"],
    0,
  ],
];

class Question {
  constructor(question, answersArray, correctAnswerIndex) {
    this.question = question;
    this.answersArray = answersArray;
    this.correctAnswerIndex = correctAnswerIndex;
  }
}

const main = async () => {
  const questions = [];
  let correctAnswer = 0;
  const responses = {};

  for (let index = 0; index < questionDatas.length; index++) {
    const [questionText, answersArray, correctAnswerIndex] =
      questionDatas[index];
    questions.push(
      new Question(questionText, answersArray, correctAnswerIndex)
    );
  }

  const group = await cli.group({
    ...questions.reduce((acc, question, index) => {
      acc[`question ${index + 1}`] = async () => {
        const answerIndex = await cli.select({
          message: question.question,
          options: question.answersArray.map((answer, i) => ({
            value: i,
            label: answer,
          })),
        });

        if (answerIndex === question.correctAnswerIndex) {
          correctAnswer++;
        }

        responses[`question ${index + 1}`] = question.answersArray[answerIndex];
      };

      return acc;
    }, {}),
  });

  console.log(`You answered ${correctAnswer} question(s) correctly.`);
  console.log(responses);
};

main();
