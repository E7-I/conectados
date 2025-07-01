// selenium-tests/smokeHomePage.test.js
const { Builder, By, until } = require('selenium-webdriver');
const { createDriver } = require('./Driver'); 


(async function smokeTest() {
    let driver = await createDriver();
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
