#! /usr/bin/env node

// Import Packages
import fs from "fs";
import { setTimeout } from "node:timers/promises";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Import External Packages
import * as p from "@clack/prompts";
import color from "picocolors";


// Import Utility Files
import createDirectoryContents from "./utilities/createDirectoryContents.js";

// Define Variables
const CURR_DIR = process.cwd();
const __dirname = dirname(fileURLToPath(import.meta.url));


// Main
async function main() {
  console.clear();

  await setTimeout(1000);

  p.intro(`${color.bgCyan(color.black(" d365-plugin-generator "))}`);

  // Get Available Templates
  const CHOICES = fs.readdirSync(`${__dirname}/templates`);
  let choiceOptions = CHOICES.map((choice) => ({
    value: choice,
    label: choice,
  }));

  const switchProj = await p.group({
    template: () =>
      p.select({
        message: "Select the project template you want to clone.",
        options: choiceOptions,
      }),
  });

  if (switchProj.template != null) {
   
    // Dynamic Module Import
    const module = await import(
      `./templates/${switchProj.template}/_config.js`
    );

    // Import relevant questions from Template _config file
    const questions = module.questions;

    // If generate confirmation is receivied
    // TODO: Implement generic check 
    if (questions.generate) {
      const s = p.spinner();

      // TODO: Implement Note passed back from Config File
      p.note(
        `
      Generating plugin in ${questions.path}.
      With a namespace of ${questions.namespace}.
      With a class name of ${questions.classname}.
      For entity ${questions.entity}.
    `,
        `
    Configuration`
      );

      s.start("Generating Files");

      // Create Folder at specififed directory
      fs.mkdirSync(`${CURR_DIR}/${questions.path}`);

      // Copy content from Template Folder to specified directory
      await createDirectoryContents(
        `${__dirname}/templates/${switchProj.template}`,
        `${questions.path}`,
        switchProj.template,
        questions
      );

      await setTimeout(2500);
      s.stop("Files Generated");
    }

    // TODO: Implement Next Steps passed back from Config File
    let nextSteps = `
      cd ${questions.path}
      Update plugin file.
      Build.
      Register.`;

    p.note(nextSteps, "Next steps.");

    p.outro(
      `Problems? ${color.underline(color.cyan("https://github.com/maichopra/plugin-generator-cli/issues"))}`
    );
  }
}
main().catch(console.error);
