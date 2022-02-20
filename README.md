# cypress-reports
Add add-files-to-report.js and generate-cucumber-report.js under cypress/reporting folder
To directly run the add-files-to-json and generate report add them to after:run hook of cypress in plugins index.js file

```
const addFilesToJson = require('../reporting/add-files-to-report.js');
const reporting = require('../reporting/generate-cucumber-report.js');

module.exports = (on, config) => {
  on('after:run', (results) => {
       const browserName= results.browser.name+' '+results.browser.version;
       const baseUrl=results.config.baseUrl;
       addFilesToJson.addFilesToCucumberJson(browserName,baseUrl);
       reporting.generateReport();
  })
}
```

JenkinsBuild.png:- jenkins Build Cucumber reports snapshot
