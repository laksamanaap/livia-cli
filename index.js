import * as cli from "@clack/prompts";
import { setTimeout } from "timers/promises";
import pico from "picocolors";
import { start } from "repl";
import gradient from "gradient-string";
import figlet from "figlet";
import { promisify } from "util";

const figletPromise = promisify(figlet.text);

console.log("test");

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
  const asciiArt = await figletPromise("Livia Quiz", {
    font: "ANSI Shadow",
    horizontalLayout: "default",
    verticalLayout: "default",
  });

  console.log(
    gradient([
      "#8be9fd", // cyan
      "#bd93f9", // purple
      "#ff5555", // red
      "#f1fa8c", // yellow
      "#50fa7b", // green
    ])(asciiArt)
  );

  const startGame = await cli.confirm({
    message: "Pick 'yes' to start the game",
  });

  if (startGame) {
    const spinner = cli.spinner();
    spinner.start("Loading questions...");
    await setTimeout(1000);
    spinner.stop("Here we go!...");

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

          const spinner = cli.spinner();
          spinner.start();
          await setTimeout(500);
          spinner.stop();

          if (answerIndex === question.correctAnswerIndex) {
            correctAnswer++;
          }

          responses[`question ${index + 1}`] =
            question.answersArray[answerIndex];
        };

        return acc;
      }, {}),
    });

    console.log(`You answered ${correctAnswer} question(s) correctly.`);
    console.log(responses);
  } else {
    const spinner = cli.spinner();
    spinner.start("Quitting...");
    await setTimeout(1500);
    spinner.stop("Thankyou!");
  }
};

main();
