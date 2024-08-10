const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const chalk = require('chalk'); // For colored logging

async function navigateAndJoinDraw(driver, index) {
  try {
    console.log(`Launching tab ${index + 1}...`);

    await driver.get('https://debank.com/stream?filter=create_at%3D1%26types%5B%5D%3Ddraw&sort=latest');
    console.log(`Navigated to the Debank stream page in tab ${index + 1}.`);

    // Set zoom level to 50%
    //await driver.executeScript('document.body.style.zoom = "50%";');
    //console.log(`Set zoom level to 50% in tab ${index + 1}.`);

    // Wait for some time to allow initial content to load
    await driver.sleep(5000); // Adjust this delay based on your needs

    let successfulJoins = 0;
    let lastRefreshTime = Date.now();

    while (true) {
      try {
        // Refresh the page every 20 minutes
        if (Date.now() - lastRefreshTime > 30 * 60 * 1000) { // 20 minutes in milliseconds
          await driver.navigate().refresh();
          console.log(`Refreshed the page in tab ${index + 1}.`);
          lastRefreshTime = Date.now();
          
          // Wait for some time to allow content to load after refresh
          await driver.sleep(5000); // Adjust this delay based on your needs
        }

        // Function for manual-like scrolling
        const scrollDownManually = async () => {
          await driver.executeScript('window.scrollBy(0, window.innerHeight / 6);'); // Scroll down by one-sixth of the viewport height
          await driver.sleep(500); // Wait for 0.5 seconds to allow content to load
        };

        // Scroll down the page manually
        await scrollDownManually();

        // Locate all available "Join the Draw" buttons
        const joinDrawButtons = await driver.findElements(By.xpath("//button[contains(@class, 'DrawCard_joinBtn__FB6CR') and not(@aria-disabled='true')]"));

        for (const joinDrawButton of joinDrawButtons) {
          try {
            // Pause for 0.25 seconds before checking the button
            await driver.sleep(250);

            // Get the parent element of the button to locate prize and attempt information
            const parentCard = await joinDrawButton.findElement(By.xpath("ancestor::div[contains(@class, 'DrawCard')]"));

            // Check if the card has "CUSTOM PRIZE" title
            const customPrizeTitle = await parentCard.findElements(By.xpath(".//div[contains(@class, 'DrawCard_prizeTitle__sZ4oF') and contains(text(), 'CUSTOM PRIZE')]"));
            if (customPrizeTitle.length > 0) {
              // Skip this button if "CUSTOM PRIZE" is present
              //console.log(chalk.yellow(`Skipping button in tab ${index + 1} due to "CUSTOM PRIZE".`));
              continue;
            }

            // Check the prize amount
            let prizeAmount = 0;
            try {
              const prizeElement = await parentCard.findElement(By.xpath(".//span[contains(@class, 'DrawCard_prizeName__wQDZ-')]"));
              const prizeText = await prizeElement.getText();
              prizeAmount = parseFloat(prizeText.replace('$', ''));
            } catch (prizeError) {
              console.error(`Error finding prize element in tab ${index + 1}:`, prizeError);
            }

            // Check the attempts amount
            let attemptsAmount = 0;
            try {
              const attemptsElement = await parentCard.findElement(By.xpath(".//span[contains(@class, 'DrawCard_prizeCount__L+xaL')]"));
              const attemptsText = await attemptsElement.getText();
              attemptsAmount = parseInt(attemptsText.replace('× ', ''));
            } catch (attemptsError) {
              console.error(`Error finding attempts element in tab ${index + 1}:`, attemptsError);
            }

            // Click the "Join the Draw" button if prize > $0 or attempts > 0
            if (prizeAmount > 0 || attemptsAmount > 0) {
              await joinDrawButton.click();
              //console.log(chalk.green(`Clicked "Join the Draw" button in tab ${index + 1}.`));

              // Wait for the "Join the Lucky Draw" button to appear and be clickable
              const luckyDrawButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(@class, 'JoinDrawModal_submitBtn__lP87P') and not(@aria-disabled='true')]")), 5000);
              await luckyDrawButton.click();
              //console.log(chalk.green(`Clicked "Join the Lucky Draw" button in tab ${index + 1} with Prize: $${prizeAmount} and Attempts: ${attemptsAmount}`));

              // Log the prizeAmount and attemptsAmount
              console.log(chalk.blue(`Joined the draw in tab ${index + 1} with Prize: $${prizeAmount} and Attempts: ${attemptsAmount}`));

              // Wait a bit to see if the join was successful
              await driver.sleep(2000);

              // Check for the close button and click it if found
              const closeButton = await driver.findElements(By.xpath("//img[@src='https://assets.debank.com/static/media/close-modal.77c8e6752e4c58210957dc6d3f66a6ea.svg' and @alt='close']"));
              if (closeButton.length > 0) {
                await closeButton[0].click();
                //console.log(chalk.green(`Clicked the close button in tab ${index + 1}.`));
              }

              // Log successful join
              successfulJoins++;
              console.log(chalk.blue(`Total Successful Joins in tab ${index + 1}: ${successfulJoins}`));
            }
          } catch (clickError) {
            console.error(`Error processing the "Join the Draw" button in tab ${index + 1}:`, clickError);
          }
        }

        // Check if the page height has changed
        let previousHeight = await driver.executeScript('return document.body.scrollHeight');
        await scrollDownManually();
        let currentHeight = await driver.executeScript('return document.body.scrollHeight');

        // If the scroll height hasn't changed, wait a bit for new content to load
        if (currentHeight === previousHeight) {
          await driver.sleep(2000); // Wait for 2 seconds before continuing to scroll
        }

      } catch (error) {
        console.error(`Error during scrolling or button interaction in tab ${index + 1}:`, error);
      }
    }
  } catch (navigationError) {
    console.error(`Error navigating to the page in tab ${index + 1}:`, navigationError);
  }
}

async function main() {
  try {
    console.log('Launching Firefox browser...');

    const options = new firefox.Options();
    options.setProfile('C:/Users/User/AppData/Roaming/Mozilla/Firefox/Profiles/3bav3yf0.debank1');
    options.setBinary('C:/Program Files/Mozilla Firefox/firefox.exe');
    // options.addArguments('-headless'); // Uncomment to run in headless mode
    // options.addArguments('-foreground=false'); // Uncomment to run in the background

    let drivers = [];

    for (let i = 0; i < 10; i++) {
      let driver = await new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(options)
        .build();

      drivers.push(driver);
    }

    await Promise.all(drivers.map((driver, index) => navigateAndJoinDraw(driver, index)));
  } catch (error) {
    console.error('Error launching Firefox browser:', error);
  }
}

main();
