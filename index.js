import * as cli from "@clack/prompts";
import { setTimeout } from "timers/promises";
import pico from "picocolors";
import { start } from "repl";
import gradient from "gradient-string";
import figlet from "figlet";
import { promisify } from "util";

const figletPromise = promisify(figlet.text);

let questionDatas = [
  [
    "Why did the chicken cross the road?",
    ["Looking for free WiFi", "Going to the gym"],
    0,
  ],
  [
    "What does a programmer do when stressed?",
    ["Deletes System32", "Tries to Ctrl+Z life"],
    1,
  ],
  [
    "Why is Earth round?",
    ["It ate too much pizza", "So aliens can use it for bowling"],
    1,
  ],
  [
    "Why did dinosaurs go extinct?",
    ["Forgot to pay their Netflix", "Failed their meteor diet"],
    1,
  ],
  [
    "Why do cats sleep all day?",
    ["Secret TikTok career", "Practicing for Olympics"],
    0,
  ],
  ["Why is the ocean salty?", ["Fish dropped their chips", "Whale sweat"], 1],
  [
    "What does the moon do when no one's watching?",
    ["Updates its Instagram", "Changes its batteries"],
    1,
  ],
  [
    "Why don't aliens visit Earth?",
    ["Bad Yelp reviews", "Visa got rejected"],
    1,
  ],
  [
    "What do ghosts do during the day?",
    ["WFH (Work From Haunted)", "Take selfies"],
    0,
  ],
  [
    "Why does Zidane often rub his head when he is a coach?",
    ["Hot", "Finding inspiration from his bald head"],
    0,
  ],
];

let correctAnswer = 0;
const responses = [];
let questions = [];

// Question Class
class Question {
  constructor(question, answersArray, correctAnswerIndex) {
    this.question = question;
    this.answersArray = answersArray;
    this.correctAnswerIndex = correctAnswerIndex;
  }
}

// Handle spinner
const handleSpinner = async (
  startMessage = "",
  stopMessage = "",
  duration = 1000
) => {
  const spinner = cli.spinner();
  spinner.start(startMessage);
  await setTimeout(duration);
  spinner.stop(stopMessage);
};

// Handle set question
const setQuestionDatas = () => {
  questions = [];
  for (let index = 0; index < questionDatas.length; index++) {
    const [question, answerArray, correctAnswerIndex] = questionDatas[index];
    questions.push(new Question(question, answerArray, correctAnswerIndex));
  }
};

// Handle Question
const createQuestionHandler = () =>
  questions.reduce((acc, question, index) => {
    acc[`question ${index + 1}`] = async () => {
      const indexAnswer = await cli.select({
        message: question.question,
        options: question.answersArray.map((answer, i) => ({
          label: answer,
          value: i,
        })),
      });

      await handleSpinner();

      if (indexAnswer === question.correctAnswerIndex) {
        correctAnswer++;
      }

      responses[`question ${index + 1}`] = question.answersArray[indexAnswer];
    };
    return acc;
  }, {});

// Handle Start Game
const startGame = async () => {
  let keepPlaying = true;

  console.log("\n \n");

  while (keepPlaying) {
    const asciiArt = await figletPromise("Livia Quiz", {
      font: "ANSI Shadow",
      horizontalLayout: "default",
      verticalLayout: "default",
    });

    console.log(
      gradient(["#8be9fd", "#bd93f9", "#ff5555", "#f1fa8c", "#50fa7b"])(
        asciiArt
      )
    );

    const startGame = await cli.confirm({
      message: "Pick 'yes' to start the game",
    });

    if (startGame) {
      await handleSpinner("Loading Question...", "Here we go!", 1500);
      setQuestionDatas();

      const questionHandlers = createQuestionHandler();
      await cli.group(questionHandlers);

      console.log(`You answered ${correctAnswer} question(s) correctly.`);
      console.log("\n");

      if (correctAnswer === 10) {
        const asciiArt = await figletPromise("You Won!", {
          font: "ANSI Shadow",
          horizontalLayout: "default",
          verticalLayout: "default",
        });

        console.log(
          gradient(["#8be9fd", "#bd93f9", "#ff5555", "#f1fa8c", "#50fa7b"])(
            asciiArt
          )
        );

        keepPlaying = false;
      } else {
        const asciiArt = await figletPromise("Hahaha! Noob!", {
          font: "ANSI Shadow",
          horizontalLayout: "default",
          verticalLayout: "default",
        });

        console.log(
          gradient(["#8be9fd", "#bd93f9", "#ff5555", "#f1fa8c", "#50fa7b"])(
            asciiArt
          )
        );

        keepPlaying = await cli.confirm({
          message: "Do you want to try again?",
        });
      }
    } else {
      await handleSpinner("Quitting...", "Thankyou!");
      keepPlaying = false;
    }
  }
};

const main = async () => {
  await startGame();
};

main().catch(console.error);
