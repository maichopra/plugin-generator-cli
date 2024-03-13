import * as p from "@clack/prompts";
import { setTimeout } from "node:timers/promises";
import color from "picocolors";
import { generateFiles } from "./generate.js";

async function main() {
  console.clear();

  await setTimeout(1000);

  p.intro(`${color.bgCyan(color.black(" create-app "))}`);

  const project = await p.group(
    {
      path: () =>
        p.text({
          message: "Where should we generate your plugin?",
          placeholder: "./sparkling-solid",
          validate: (value) => {
            if (!value) return "Please enter a path.";
            if (value[0] !== ".") return "Please enter a relative path.";
          },
        }),
      namespace: () =>
        p.text({
          message: "What is the Namespace of the Plugin?",
          placeholder: "DTT.Plugins.Entity",
          validate: (value) => {
            if (!value) return "Please provide a Namespace.";
          },
        }),
      classname: () =>
        p.text({
          message: "What is the Class Name of the Plugin?",
          placeholder: "EntityNamePlugin",
          validate: (value) => {
            if (!value) return "Please provide a Class Name.";
          },
        }),
      entity: () =>
        p.text({
          message: "What entity do you want to generate a plugin for?",
          placeholder: "dtt_application",
          validate: (value) => {
            if (!value.startsWith("dtt_"))
              return "Please enter the logical name of an entity (beggining with dtt_)";
          },
        }),
      configuration: () =>
        p.groupMultiselect({
          message: "Which configuration do you wish to include?",
          options: {
            create: [
              { value: "create-pre-validation", label: "pre-validation" },
              { value: "create-pre-operation", label: "pre-operation" },
              { value: "create-post-operation", label: "post-operation" },
            ],
            update: [
              { value: "update-pre-validation", label: "pre-validation" },
              { value: "update-pre-operation", label: "pre-operation" },
              { value: "update-post-operation", label: "post-operation" },
            ],
            delete: [
              { value: "delete-pre-validation", label: "pre-validation" },
              { value: "delete-pre-operation", label: "pre-operation" },
              { value: "delete-post-operation", label: "post-operation" },
            ],
          },
        }),
      helper: () =>
        p.confirm({
          message: "Do you want to initialise a helper file?",
          initialValue: false,
        }),
      install: () =>
        p.confirm({
          message: "Install dependencies?",
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

  if (project.install) {
    const s = p.spinner();

    p.note(
      `
      Generating plugin in ${project.path}.
      With a namespace of ${project.namespace}.
      With a class name of ${project.classname}.
      For entity ${project.entity}.
      ${project.helper ? `Initialising helper file` : ``}
    `,
      `
    Configuration`
    );

    s.start("Generating Files");

    generateFiles(
      project.path,
      project.namespace,
      project.classname,
      project.entity,
      project.configuration,
      project.helper
    );

    await setTimeout(2500);
    s.stop("Files Generated");
  }

  let nextSteps = `cd ${project.path}        \n${
    project.install ? "" : "pnpm install\n"
  }pnpm dev`;

  p.note(nextSteps, "Next steps.");

  p.outro(
    `Problems? ${color.underline(color.cyan("https://example.com/issues"))}`
  );
}

main().catch(console.error);
