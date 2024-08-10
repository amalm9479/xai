const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const chalk = require('chalk');
const readline = require('readline');

const addresses = [
  '0xf048F34e0dC1A99BDc89627048760D4e4a476C7a'
];

let startIndex = 0; // Default start index

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask user for input
rl.question('Choose an option:\n1. Start from the beginning\n2. Start from a specific index\nEnter your choice: ', async (answer) => {
  if (answer === '2') {
    rl.question(`Enter the index to start from (0 to ${addresses.length - 1}): `, (index) => {
      const inputIndex = parseInt(index, 10);
      if (!isNaN(inputIndex) && inputIndex >= 0 && inputIndex < addresses.length) {
        startIndex = inputIndex;
        rl.close();
        startAutomation();
      } else {
        console.error('Invalid start index provided. Starting from the beginning.');
        rl.close();
        startAutomation();
      }
    });
  } else {
    rl.close();
    startAutomation();
  }
});

async function startAutomation() {
  let driver;

  const startTime = new Date();
  console.log(`Script started at: ${startTime.toISOString()}`);

  const handleExit = async () => {
    if (driver) {
      await driver.quit();
    }
    const endTime = new Date();
    console.log(`Script ended at: ${endTime.toISOString()}`);
    const totalTime = (endTime - startTime) / 1000; // in seconds
    console.log(`Total execution time: ${totalTime} seconds`);
    process.exit();
  };

  process.on('SIGINT', async () => {
    await handleExit();
  });

  const launchBrowser = async () => {
    console.log('Launching Firefox browser...');
    
    const options = new firefox.Options();
    options.setProfile('C:/Users/User/AppData/Roaming/Mozilla/Firefox/Profiles/0ti9w4vp.default-release-v2');
    options.setBinary('C:/Program Files/Mozilla Firefox/firefox.exe');
    options.addArguments('-headless'); // Run in headless mode
    options.addArguments('-foreground=false'); 
    // Disable image loading
    options.setPreference('permissions.default.image', 2);

    return new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(options)
      .build();
  };

  const clickAllClaimButtons = async (address) => {
    try {
      let retryCount = 0;
      while (true) {
        // Wait for all 'Claim' buttons to be present
        await driver.wait(until.elementsLocated(By.xpath("//button[text()='Claim']")), 10000);
        let buttons = await driver.findElements(By.xpath("//button[text()='Claim']"));

        // If no 'Claim' buttons are found, break the loop and move to the next address
        if (buttons.length === 0) {
          console.log('🔍 No Claim buttons found. Moving to next address.');
          break;
        }

        console.log(`🛠️ Found ${buttons.length} Claim buttons. Attempting to click...`);

        // Click all 'Claim' buttons
        for (const button of buttons) {
          try {
            await button.click();
            console.log('✔️ Successfully clicked a Claim button.');
          } catch (clickError) {
            console.error('❌ Error clicking a Claim button:', clickError);
          }
        }

        // Wait and check if any buttons are still present
        await driver.sleep(2000); // Short delay to allow any updates

        buttons = await driver.findElements(By.xpath("//button[text()='Claim']"));
        const isAnyButtonPresent = buttons.length > 0;

        // If no 'Claim' buttons are found, break the loop and move to the next address
        if (!isAnyButtonPresent) {
          console.log('✅ All Claim buttons are claimed. Moving to next address.');
          break;
        }

        console.log('🔄 Some Claim buttons are still present. Retrying...');
        retryCount++;

        if (retryCount >= 5) {
          console.log('🔄 Retrying limit reached. Restarting browser for the same address...');
          await restartBrowserWithAddress(address);
          retryCount = 0; // Reset the retry counter
        }
      }
    } catch (error) {
      if (error.name !== 'TimeoutError') {
        console.error('🚨 Error clicking Claim buttons:', error);
      }
    }
  };

  // Function to wait for label and click on it, with retry mechanism
  const waitForLabelAndClick = async () => {
    const maxRetries = 3;
    let retries = 0;
    while (retries < maxRetries) {
      try {
        await driver.wait(until.elementLocated(By.xpath("//label[contains(., 'Wallet Address')]")), 2000);
        const label = await driver.findElement(By.xpath("//label[contains(., 'Wallet Address')]"));
        await label.click();
        console.log('Label with text "Wallet Address" has been clicked');
        break; // Exit loop on success
      } catch (error) {
        console.error('Error clicking label or waiting for element:', error);
        retries++;
        console.log(`Retrying... (${retries}/${maxRetries})`);
      }
    }
    if (retries === maxRetries) {
      throw new Error('Max retries exceeded. Unable to click on label.');
    }
  };

  // Function to type the address, with retry mechanism
  const typeAddress = async (address) => {
    const maxRetries = 3;
    let retries = 0;
    while (retries < maxRetries) {
      try {
        await driver.wait(until.elementLocated(By.css('input[placeholder="Wallet Address..."]')), 2500);
        const input = await driver.findElement(By.css('input[placeholder="Wallet Address..."]'));
        await input.clear();
        await input.sendKeys(address);
        console.log(`Address ${address} has been typed`);
        break; // Exit loop on success
      } catch (error) {
        console.error('Error typing address or waiting for input element:', error);
        retries++;
        console.log(`Retrying... (${retries}/${maxRetries})`);
      }
    }
    if (retries === maxRetries) {
      throw new Error('Max retries exceeded. Unable to type address.');
    }
  };

  // Function to restart browser with a new address
  const restartBrowserWithAddress = async (address) => {
    if (driver) {
      await driver.quit();
    }
    console.log(`🔄 Restarting browser for address: ${address}`);
    driver = await launchBrowser();
    console.log('Firefox browser restarted successfully.');
    await driver.get('https://vanguard.xai.games/');
    console.log('Navigated to https://vanguard.xai.games/');
    await waitForLabelAndClick();
    await typeAddress(address);
    await clickAllClaimButtons(address); // Retry the clicking process for the same address
  };

  const processAddresses = async () => {
    try {
      driver = await launchBrowser();
      console.log('Firefox browser launched successfully.');

      while (true) { // Infinite loop
        for (let i = startIndex; i < addresses.length; i++) {
          const address = addresses[i];

          console.log(chalk.blue(`Current address (${i + 1}): ${address}`));

          if (i > startIndex) {
            console.log(`Waiting for 3 seconds before proceeding to the next address.`);
            await driver.sleep(3000); // Wait for 3 seconds before proceeding to the next address
          }

          // Navigate to the site only for the first address, otherwise stay on the current page
          if (i === startIndex) {
            await driver.get('https://vanguard.xai.games/');
            console.log('Navigated to https://vanguard.xai.games/');
          }

          await waitForLabelAndClick();
          await typeAddress(address);

          // Continuous click all 'Claim' buttons until none are clickable
          console.log(`Checking for 'Claim' buttons...`);
          await clickAllClaimButtons(address);

          // Wait for 2 seconds after all buttons are claimed before closing the browser
          await driver.sleep(3000);

          // Check if any button is clickable (not claimed or queued)
          const queuedButtons = await driver.findElements(By.xpath("//button[contains(text(), 'Queued')]"));
          if (queuedButtons.length > 0) {
            console.log(`Queued buttons found for address ${address}. Restarting browser for the next address.`);
            await restartBrowserWithAddress(address);
            continue; // Skip the rest of the loop iteration
          }

          const claimedButtons = await driver.findElements(By.xpath("//button[contains(text(), 'Claimed')]"));
          if (claimedButtons.length > 0) {
            console.log(`Claimed buttons found for address ${address}. Continuing without refreshing.`);
          } else {
            console.log(`No Claim or Queued buttons found for address ${address}. Proceeding to next address.`);
          }
        }

        // Restart the process after finishing the list
        console.log('All addresses processed. Restarting...');
        startIndex = 0; // Reset start index
        await driver.quit(); // Close the browser
        driver = await launchBrowser(); // Relaunch the browser
      }

    } catch (error) {
      console.error('Error launching Firefox browser', error);
    } finally {
      await handleExit();
    }
  };

  processAddresses();
}
