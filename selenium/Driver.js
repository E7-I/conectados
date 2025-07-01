const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { v4: uuidv4 } = require('uuid');

/**
 * Creates a new Selenium WebDriver with a unique Chrome profile.
 * @returns {Promise<WebDriver>}
 */
async function createDriver() {
  const uniqueProfile = `/tmp/selenium-profile-${uuidv4()}`;
  const options = new chrome.Options().addArguments(
    '--headless=new',  
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--user-data-dir=${uniqueProfile}`
  );
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  return driver;
}

module.exports = { createDriver };
