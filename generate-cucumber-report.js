var reporter = require('cucumber-html-reporter');


function generateReport(browser,baseUrl){
    var options = {
        theme: 'bootstrap',
        jsonDir: '../build/reporting/cucumber-json',
        output: '../build/reporting/cucumber_report.html',
        reportSuiteAsScenarios: true,
        scenarioTimestamp: true,
        launchReport: true,
        metadata: {
            "App Version":"0.3.2",
            "Application Url":baseUrl,
            "Test Environment": "LOCAL",
            "Browser": browser,
        }
    };

    reporter.generate(options);
}

exports.generateReport=generateReport;