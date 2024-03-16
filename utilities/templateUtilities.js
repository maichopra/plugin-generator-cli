import fs from "fs";

function hydrateTemplate(file, replacementArray) {
  fs.readFile(file, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    var result = data;

    replacementArray.forEach((element) => {
      result = result.replace(element.from, element.to);
    });

    fs.writeFile(file, result, "utf8", function (err) {
      if (err) return console.log(err);
    });
  });
}

export default hydrateTemplate;
