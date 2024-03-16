// Code derivied from https://github.com/leoroese/template-cli/blob/master/createDirectoryContents.js

import * as fs from "fs";
const CURR_DIR = process.cwd();

async function createDirectoryContents(templatePath, newProjectPath) {
  const filesToCreate = fs.readdirSync(templatePath);

  const _config = await import(`../templates/simple-plugin/_config`);
  let x = _config.default();
  console.log(x);

  filesToCreate.forEach((file) => {
    const origFilePath = `${templatePath}/${file}`;

    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, "utf8");

      // Rename
      if (file === ".npmignore") file = ".gitignore";

      if (file === "_config.js") return;

      const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
      fs.writeFileSync(writePath, contents, "utf8");

      // TODO: Hydrate File with Updated Content
      // Load Configuration from _config.js

      let importArray = mapping.filter((record) => {
        return record.file === "simplePlugin.cs";
      });

      let hydrationArray = importArray[0].hydrationArray;
      console.log(hydrationArray);
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
