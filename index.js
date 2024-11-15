import * as cli from "@clack/prompts";
import { setTimeout } from "timers/promises";
import color from "picocolors";

let questionDatas = ["Is madrid best team in the world?"];

class Question {
  constructor(question, answersArray, correctAnswerIndex) {
    (this.question = question),
      (this.answersArray = answersArray),
      (this.correctAnswerIndex = correctAnswerIndex);
  }
}

// Temporary
async function main() {
  const group = await cli.group(
    {
      name: () => cli.text({ message: "What is your name?" }),
      age: () => cli.text({ message: "What is your age?" }),
      color: ({ results }) =>
        cli.multiselect({
          message: `What is your favorite color ${results.name}?`,
          options: [
            { value: "red", label: "Red" },
            { value: "green", label: "Green" },
            { value: "blue", label: "Blue" },
          ],
        }),
    },
    {
      onCancel: ({ results }) => {
        cli.cancel("Operation cancelled.");
        process.exit(0);
      },
    }
  );

  console.log(group.name, group.age, group.color);
}

main();
