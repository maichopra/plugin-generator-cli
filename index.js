#! /usr/bin/env node

// Import Packages
import fs from "fs";
import * as p from "@clack/prompts";
import { setTimeout } from "node:timers/promises";
import color from "picocolors";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Import Utility Files
import createDirectoryContents from "./utilities/createDirectoryContents.js";
import generateFiles from "./utilities/generateTemplateContent.js";
import hydrateTemplate from "./utilities/templateUtilities.js";

// Define Variables
const CURR_DIR = process.cwd();
const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  console.clear();

  await setTimeout(1000);

  p.intro(`${color.bgCyan(color.black(" d365-plugin-generator "))}`);

  const CHOICES = fs.readdirSync(`${__dirname}/templates`);
  let choiceOptions = CHOICES.map((choice) => ({
    value: choice,
    label: choice,
  }));

  const switchProj = await p.group({
    questionSelect: () =>
      p.select({
        message: "Which question set do you want to use?",
        options: [
          { value: "question1.js", label: "Q1" },
          { value: "question2.js", label: "Q2" },
        ],
      }),
  });

  if (switchProj.questionSelect != null) {
    const project = await import(`./${switchProj.questionSelect}`);
  }

  // const project = await p.group(
  //   {
  //     path: () =>
  //       p.text({
  //         message: "Where should we generate the template file?",
  //         placeholder: "./sparkling-solid",
  //         validate: (value) => {
  //           if (!value) return "Please enter a path.";
  //           if (value[0] !== ".") return "Please enter a relative path.";
  //         },
  //       }),
  //     template: () =>
  //       p.select({
  //         message: "Select the project template you want to clone.",
  //         options: choiceOptions,
  //       }),
  //     namespace: () =>
  //       p.text({
  //         message: "What is the Namespace of the Plugin?",
  //         placeholder: "DTT.Plugins.Entity",
  //         validate: (value) => {
  //           if (!value) return "Please provide a Namespace.";
  //         },
  //       }),
  //     classname: () =>
  //       p.text({
  //         message: "What is the Class Name of the Plugin?",
  //         placeholder: "EntityNamePlugin",
  //         validate: (value) => {
  //           if (!value) return "Please provide a Class Name.";
  //         },
  //       }),
  //     entity: () =>
  //       p.text({
  //         message: "What entity do you want to generate a plugin for?",
  //         placeholder: "dtt_application",
  //         validate: (value) => {
  //           if (!value.startsWith("dtt_"))
  //             return "Please enter the logical name of an entity (beggining with dtt_)";
  //         },
  //       }),
  //     configuration: () =>
  //       p.groupMultiselect({
  //         message: "Which configuration do you wish to include?",
  //         options: {
  //           create: [
  //             { value: "create-pre-validation", label: "pre-validation" },
  //             { value: "create-pre-operation", label: "pre-operation" },
  //             { value: "create-post-operation", label: "post-operation" },
  //           ],
  //           update: [
  //             { value: "update-pre-validation", label: "pre-validation" },
  //             { value: "update-pre-operation", label: "pre-operation" },
  //             { value: "update-post-operation", label: "post-operation" },
  //           ],
  //           delete: [
  //             { value: "delete-pre-validation", label: "pre-validation" },
  //             { value: "delete-pre-operation", label: "pre-operation" },
  //             { value: "delete-post-operation", label: "post-operation" },
  //           ],
  //         },
  //       }),
  //     generate: () =>
  //       p.confirm({
  //         message: "Confrim template generation",
  //         initialValue: false,
  //       }),
  //   },
  //   {
  //     onCancel: () => {
  //       p.cancel("Operation cancelled.");
  //       process.exit(0);
  //     },
  //   }
  // );

  if (project.generate) {
    const s = p.spinner();

    p.note(
      `
      Generating plugin in ${project.path}.
      With a namespace of ${project.namespace}.
      With a class name of ${project.classname}.
      For entity ${project.entity}.
    `,
      `
    Configuration`
    );

    s.start("Generating Files");

    // generateFiles(
    //   project.path,
    //   project.namespace,
    //   project.classname,
    //   project.entity,
    //   project.configuration
    // );

    fs.mkdirSync(`${CURR_DIR}/${project.path}`);

    await createDirectoryContents(
      `${__dirname}/templates/${project.template}`,
      `${project.path}`
    );

    // hydrateTemplate("testFile.js", [
    //   { from: /NAME/g, to: project.namespace },
    //   { from: /DATE/g, to: project.classname },
    //   { from: /COMPANY/g, to: project.entity },
    // ]);

    // console.log(await import("./test/_config.js"));
    // hydrateTemplate("testFile.js", await import("./test/_config.js").default);

    await setTimeout(2500);
    s.stop("Files Generated");
  }

  let nextSteps = `
  cd ${project.path}
  Update plugin file.
  Build.
  Register.`;

  p.note(nextSteps, "Next steps.");

  p.outro(
    `Problems? ${color.underline(color.cyan("https://example.com/issues"))}`
  );
}

main().catch(console.error);
