// Code derivied from https://github.com/leoroese/template-cli/blob/master/createDirectoryContents.js

import * as fs from "fs";
import replace from 'replace-in-file';

const CURR_DIR = process.cwd();

async function createDirectoryContents(templatePath, newProjectPath, project, questions) {
  const filesToCreate = fs.readdirSync(templatePath);

  // Dynamic Module Import
  const module = await (import(
    `../templates/${project}/_config.js`
  ));

  let processorArray = module.processors(questions);

  filesToCreate.forEach((file) => {
    const origFilePath = `${templatePath}/${file}`;

    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {

      // Read the Template File
      const contents = fs.readFileSync(origFilePath, "utf8");

      // Rename or Ignore
      if (file === ".npmignore") file = ".gitignore";

      if (file === "_config.js") return;

      // Write the New File
      const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
      fs.writeFileSync(writePath, contents, "utf8");

      // Hydrate File with Updated Content
      let fileConfig = processorArray.find(item => item.files === file);

      // If Configuration found for current file
      if(fileConfig != null){

        let filePath = `${CURR_DIR}/${newProjectPath}/${file}`;

        // Update filepath structure
        filePath = filePath.replace(/[\\/]+/g, '/');

        // Implement File Hydration
        const results = replace.sync({
          files: filePath,
          processor: fileConfig.processor,
          countMatches: true,
        });
      };

    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);

      // recursive call
      createDirectoryContents(
        `${templatePath}/${file}`,
        `${newProjectPath}/${file}`
      );
    }
  });
}

export default createDirectoryContents;
