// selenium-tests/smokeHomePage.test.js
const { Builder} = require('selenium-webdriver');
const chrome =  require('selenium-webdriver/chrome');
const {v4: uuidv4} = require('uuid');



(async function smokeTest() {
    const uniqueProfile = `/tmp/selenium-profile-${uuidv4()}`;
    const options = new chrome.Options().addArguments(`--user-data-dir=${uniqueProfile}`);
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    try {
        await driver.get('https://delightful-flower-08c627f1e.6.azurestaticapps.net/');
        await driver.wait(until.elementLocated(By.css('h1')), 10000);
        let title = await driver.findElement(By.css('h1')).getText();
        if (!title.includes('Bienvenido')) {
            throw new Error('El título no contiene "Bienvenido"');
        }
        console.log('✅ Test passed');
    } catch (err) {
        console.error('❌ Test failed:', err);
        //process.exit(1);  
    } finally {
        await driver.quit();
    }
})();
