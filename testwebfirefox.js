const { Builder, By, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const chalk = require('chalk'); // for color highlighting
const readline = require('readline'); // for cursor manipulation
const config = require('./config'); // Import the configuration file

let scriptAttempt = 1; // Track the number of script restarts
let speed = 200;
let reset = 1200000;

function getCurrentTimestamp() {
  return new Date().toLocaleString();
}

async function launchFirefoxWithProfile() {
  let driver;
  let startTime = Date.now();

  try {
    console.log(`Script started at: ${getCurrentTimestamp()}, Attempt ${scriptAttempt}`);
    
    const options = new firefox.Options();
    options.setProfile('C:/Users/User/AppData/Roaming/Mozilla/Firefox/Profiles/0ti9w4vp.default-release');
    options.setBinary('C:/Program Files/Mozilla Firefox/firefox.exe');

    driver = await new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(options)
      .build();

    console.log("Browser launched successfully");

    await driver.get('https://gydde.com');
    console.log("Navigated to gydde.com");

    // Function to click on the specific image if found
    const clickSpecificImage = async (clickAttempt) => {
      try {
        const image = await driver.wait(until.elementLocated(By.css('img[src="/static/media/clicker.533b67c66b9b9d074526755578e3ce30.svg"]')), 60000); // Wait up to 60 seconds
        if (image) {
          await image.click();
          readline.cursorTo(process.stdout, 0); // Move cursor to the beginning of the line
          process.stdout.write(chalk.green(`Clicked attempt ${clickAttempt}`)); // Update the line
          return true;
        } else {
          console.error(`Image not found or loaded on click attempt ${clickAttempt}`);
          return false;
        }
      } catch (error) {
        if (error.name === 'ElementClickInterceptedError') {
          console.error(`ElementClickInterceptedError on click attempt ${clickAttempt}:`, error);
          // Force click using JavaScript to ensure click happens
          await driver.executeScript("arguments[0].click();", await driver.findElement(By.css('img[role="button"][src="/static/media/clicker.533b67c66b9b9d074526755578e3ce30.svg"]')));
          return true; // Retry clicking
        } else {
          console.error(`Error clicking image on click attempt ${clickAttempt}:`, error);
          return false;
        }
      }
    
    };

    // Function to continuously handle click every 0.2 seconds
    const handleActions = async () => {
      let imageClickable = true;
      let clickAttempt = 1;

      while (imageClickable) {
        try {
          imageClickable = await clickSpecificImage(clickAttempt);
          clickAttempt++;
          await new Promise(resolve => setTimeout(resolve, config.speed)); // Wait for configured speed before next action

          // Check if 30 minutes have passed since the start
          if (Date.now() - startTime >= config.reset) {
            console.log('\n20 minutes passed. Script will restart at: ${getCurrentTimestamp()}');
            break;
          }
        } catch (error) {
          console.error('Error in handleActions:', error);
        }
      }

      console.log('\nClosing browser after 30 minutes or 1000 clicks at: ${getCurrentTimestamp()}');
      await driver.quit();
      scriptAttempt++; // Increment the script attempt counter
      console.log('Restarting script at: ${getCurrentTimestamp()}, Attempt ${scriptAttempt}');
      launchFirefoxWithProfile(); // Restart the script
    };

    // Start handling actions
    await handleActions();

  } catch (error) {
    console.error('Error launching Firefox browser', error);
    if (driver) {
      await driver.quit();
    }
    // Handle error and restart script after a delay
    console.log('Restarting script after error at: ${getCurrentTimestamp()}, Attempt ${scriptAttempt}');
    await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds delay before restarting
    scriptAttempt++; // Increment the script attempt counter
    launchFirefoxWithProfile(); // Restart the script
  }
}

launchFirefoxWithProfile();