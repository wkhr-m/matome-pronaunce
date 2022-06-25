const fs = require("fs");
const marked = require("marked");

const INPUTPUT_PATH = "content";
const OUTPUT_PATH = "src/generated/docs";
const OUTPUT_CONTENT = {
  id: "",
  title: "",
  contents: "",
};

// /content配下のファイルを読み込んでhtmlに変換し、jsonの形にして/src/generatedに移動
const converter = (directoryName, fileName) => {
  const file = fs.readFileSync(
    `./${INPUTPUT_PATH}/${directoryName}/${fileName}`,
    {
      encoding: "utf8",
    }
  );
  const html = marked.parse(file);
  const fileTitle = fileName.slice(0, -3);

  OUTPUT_CONTENT.contents = html;
  OUTPUT_CONTENT.id = `${directoryName}/${fileTitle}`;
  OUTPUT_CONTENT.title = fileTitle;

  const directoryPath = `${OUTPUT_PATH}/${directoryName}`;

  try {
    fs.readdirSync(directoryPath);
  } catch (error) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  fs.writeFileSync(
    `${directoryPath}/${fileTitle}.json`,
    JSON.stringify(OUTPUT_CONTENT)
  );
};

// ディレクトリーを初期化
fs.rmSync("src/generated", { recursive: true, force: true });
fs.mkdirSync(OUTPUT_PATH, { recursive: true });

fs.readdir(`${INPUTPUT_PATH}`, { withFileTypes: true }, (err, directories) => {
  for (const directory of directories) {
    if (directory.isDirectory()) {
      const files = fs.readdirSync(`./${INPUTPUT_PATH}/${directory.name}`);
      for (const file of files) {
        converter(directory.name, file);
      }
    }
  }
});

// navigation.jsonをコピー
fs.copyFileSync("content/navigation.json", "src/generated/navigation.json");
