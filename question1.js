// Import Packages

import * as p from "@clack/prompts";

const questions = await p.group(
  {
    path: () =>
      p.text({
        message: "This is my custom question 1",
        placeholder: "./sparkling-solid",
        validate: (value) => {
          if (!value) return "Please enter a path.";
          if (value[0] !== ".") return "Please enter a relative path.";
        },
      }),
    generate: () =>
      p.confirm({
        message: "Confrim template generation",
        initialValue: false,
      }),
  },
  {
    onCancel: () => {
      p.cancel("Operation cancelled.");
      process.exit(0);
    },
  }
);

export default questions;
