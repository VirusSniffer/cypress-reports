const fs = require("fs");
const path = require("path");

function addFilesToCucumberJson() {
  const cucumberJsonDir = "../../build/reporting/cucumber-json";
  const screenshotsDir = "../../build/screenshots";
  const videosDir = "../../build/videos";
  const logsDir = "../../build/cypress-logs";

  const cukeMap = {};
  const jsonNames = {};
  const videosMap = {};
  const logsMap = {};

  const jsonPath = path.join(__dirname, "..", cucumberJsonDir);
  const screenshotsPath = path.join(__dirname, "..", screenshotsDir);
  const videosPath = path.join(__dirname, "..", videosDir);
  const logsPath = path.join(__dirname, "..", logsDir);
  const files = fs.readdirSync(jsonPath);

  const videos = fs.readdirSync(videosPath);
  videos.forEach((vid) => {
    const arr = vid.split(".");
    const featureName = `${arr[0]}.${arr[1]}`;
    videosMap[featureName] = vid;
  });

  const logs = fs.readdirSync(logsPath);
  logs.forEach((log) => {
    const arr = log.split(".");
    const featureName = `${arr[0]}.feature`;
    logsMap[featureName] = log;
  });

  files.forEach((file) => {
    const json = JSON.parse(
      fs.readFileSync(path.join(jsonPath, file)).toString()
    );
    const feature = json[0].uri.split("/").reverse()[0];
    jsonNames[feature] = file;
    cukeMap[feature] = json;
  });

  const failingFeatures = fs.readdirSync(screenshotsPath);
  let count = 0;
  failingFeatures.forEach((feature) => {
    const screenshots = fs.readdirSync(path.join(screenshotsPath, feature));
    screenshots.forEach((screenshot) => {
      const regex = /(?:.*--\s)(.*)(?:\s\(failed\).png)/g;
      const scenarioName = regex.exec(screenshot)[1];
      const myScenario = cukeMap[feature][0].elements.find(
        (e) => e.name === scenarioName
      );
      const myStep = myScenario.steps.find(
        (step) => step.result.status !== "passed"
      );
      myStep.embeddings = [];
      myScenario.embeddings = [];
      
      // Get and add screenshots
      const data = fs.readFileSync(path.join(screenshotsPath, feature, screenshot));
      if (data) {
        const base64Image = Buffer.from(data, "binary").toString("base64");
        myStep.embeddings.push({ data: base64Image, mime_type: "image/png" });
      }

      // find my video
      const vidData = fs
        .readFileSync(path.join(videosPath, videosMap[feature]))
        .toString("base64");
      if (vidData) {
        const html = `<video controls width="500"><source type="video/mp4" src="data:video/mp4;base64,${vidData}"> </video>`;
        const encodedHtml = Buffer.from(html, "binary").toString("base64");
        myStep.embeddings.push({ data: encodedHtml, mime_type: "text/html" });
      }

      // To add log files
      const logData = fs
        .readFileSync(path.join(logsPath, logsMap[feature]))
        .toString("ascii");
      if (logData) {
        myStep.embeddings.push({ data: logData, mime_type: "text/plain" });
      }

      // write me back out again
      fs.writeFileSync(
        path.join(jsonPath, jsonNames[feature]),
        JSON.stringify(cukeMap[feature], null, 2)
      );
    });
  });
}

exports.addFilesToCucumberJson=addFilesToCucumberJson;