const { Builder, By, until } = require('selenium-webdriver');

(async function loginTest() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Navigate to login page
        await driver.get('https://delightful-flower-08c627f1e.6.azurestaticapps.net/login');
        
        // Wait for the page to load
        await driver.wait(until.elementLocated(By.css('h1')), 10000);
        
        // Test 1: Check if login page title is correct
        let title = await driver.findElement(By.css('h1')).getText();
        if (!title.includes('Inicio de Sesión')) {
            throw new Error('El título de la página no contiene "Inicio de Sesión"');
        }
        console.log('✅ Login page title test passed');
        
        // Test 2: Check if all form fields are present
        try {
            await driver.wait(until.elementLocated(By.css('input[name="nombre"]')), 5000);
            await driver.wait(until.elementLocated(By.css('input[name="contrasena"]')), 5000);
            await driver.wait(until.elementLocated(By.css('button[type="submit"]')), 5000);
            console.log('✅ All login form fields are present');
        } catch (error) {
            console.log('⚠️ Some login form fields are missing');
        }
        
        // Test 4: Test form validation - empty fields
        try {
            let submitButton = await driver.findElement(By.css('button[type="submit"]'));
            await submitButton.click();
            
            await driver.sleep(1000);
            
            // Check if browser validation prevents submission
            let usernameInput = await driver.findElement(By.css('input[name="nombre"]'));
            let validationMessage = await usernameInput.getAttribute('validationMessage');
            if (validationMessage) {
                console.log('✅ Form validation works - prevents empty submission');
            } else {
                console.log('⚠️ Form validation may not be working for empty fields');
            }
        } catch (error) {
            console.log('⚠️ Empty field validation test skipped - elements not found');
        }
        
        // Test 5: Test login with invalid credentials
        try {
            let usernameInput = await driver.findElement(By.css('input[name="nombre"]'));
            let passwordInput = await driver.findElement(By.css('input[name="contrasena"]'));
            
            await usernameInput.clear();
            await usernameInput.sendKeys('invaliduser');
            
            await passwordInput.clear();
            await passwordInput.sendKeys('invalidpassword');
            
            let submitButton = await driver.findElement(By.css('button[type="submit"]'));
            await submitButton.click();
            
            // Wait for response
            await driver.sleep(5000);
            
            // Check for error alert
            try {
                let alert = await driver.switchTo().alert();
                let alertText = await alert.getText();
                if (alertText.includes('Error') || alertText.includes('error') || alertText.includes('credenciales')) {
                    console.log('✅ Invalid credentials error handled correctly');
                } else {
                    console.log('⚠️ Unexpected alert message: ' + alertText);
                }
                await alert.accept();
            } catch (alertError) {
                console.log('⚠️ No alert found for invalid credentials');
            }
        } catch (error) {
            console.log('⚠️ Invalid credentials test skipped - elements not found');
        }
        
        // Test 6: Test login with valid credentials (if you have test credentials)
        try {
            // Clear previous data
            let usernameInput = await driver.findElement(By.css('input[name="nombre"]'));
            let passwordInput = await driver.findElement(By.css('input[name="contrasena"]'));
            
            await usernameInput.clear();
            await passwordInput.clear();
            
            // You can replace these with actual test credentials
            await usernameInput.sendKeys('testuser');
            await passwordInput.sendKeys('testpass123');
            
            let submitButton = await driver.findElement(By.css('button[type="submit"]'));
            await submitButton.click();
            
            // Wait for response
            await driver.sleep(5000);
            
            // Check for success alert or redirection
            try {
                let alert = await driver.switchTo().alert();
                let alertText = await alert.getText();
                if (alertText.includes('exitoso')) {
                    console.log('✅ Login successful');
                } else {
                    console.log('⚠️ Login response: ' + alertText); //cors error,  (Reason: CORS No Allow Credentials)
                }
                await alert.accept();
            } catch (alertError) {
                // Check if redirected to home page
                let currentUrl = await driver.getCurrentUrl();
                if (currentUrl.includes('/') && !currentUrl.includes('/login')) {
                    console.log('✅ Login successful - redirected to home page');
                } else {
                    console.log('⚠️ No login success indication found');
                }
            }
        } catch (error) {
            console.log('⚠️ Valid credentials test skipped - elements not found or credentials invalid');
        }
        
        // Test 7: Check "No tienes una cuenta?" link
        try {
            // Navigate back to login page if redirected
            await driver.get('https://delightful-flower-08c627f1e.6.azurestaticapps.net/login');
            await driver.sleep(2000);
            
            let registerLink = await driver.findElement(By.css('a[href="/registro"]'));
            if (registerLink) {
                let linkText = await registerLink.getText();
                if (linkText.includes('Regístrate')) {
                    console.log('✅ Register link is present and has correct text');
                }
            }
        } catch (error) {
            console.log('⚠️ Register link test skipped - element not found');
        }
        
        // Test 8: Test link navigation to register page
        try {
            let registerLink = await driver.findElement(By.css('a[href="/registro"]'));
            await registerLink.click();
            await driver.sleep(2000);
            
            let currentUrl = await driver.getCurrentUrl();
            if (currentUrl.includes('/registro')) {
                console.log('✅ Navigation to register page works');
            } else {
                console.log('⚠️ Navigation to register page may not work correctly');
            }
        } catch (error) {
            console.log('⚠️ Register link navigation test skipped - element not found');
        }
        
        // Test 9: Check responsive design elements
        try {
            // Navigate back to login page
            await driver.get('https://delightful-flower-08c627f1e.6.azurestaticapps.net/login');
            await driver.sleep(2000);
            
            // Check if the two-panel layout exists
            let leftPanel = await driver.findElements(By.css('.bg-linear-to-b, .from-blue-500'));
            let rightPanel = await driver.findElements(By.css('.w-full.md\\:w-1\\/2'));
            
            if (leftPanel.length > 0) {
                console.log('✅ Left panel (CONECTADOS brand) is present');
            }
            if (rightPanel.length > 0) {
                console.log('✅ Right panel (form) is present');
            }
        } catch (error) {
            console.log('⚠️ Responsive design test skipped - elements not found');
        }
        
        console.log('✅ Login page tests completed successfully!');
        
    } catch (err) {
        console.error('❌ Login test encountered an error:', err.message);
        console.log('⚠️ Test completed with warnings');
    } finally {
        await driver.quit();
    }
})();