const puppeteer = require('puppeteer-core');

async function launchFirefoxWithProfile() {
  let browser;

  try {
    console.log('Launching Firefox browser...');
    browser = await puppeteer.launch({
      executablePath: 'C:/Program Files/Mozilla Firefox/firefox.exe',
      product: 'firefox',
      headless: true, // Run Puppeteer in headless mode
      args: [
        '--profile',
        'C:/Users/User/AppData/Roaming/Mozilla/Firefox/Profiles/0ti9w4vp.default-release',
      ]
    });

    console.log('Firefox browser launched successfully.');

    const pages = await browser.pages();
    const page = pages.length > 0 ? pages[0] : await browser.newPage();
    console.log('New page created.');

    // Navigate to your desired page
    await page.goto('https://gydde.com/game');
    console.log('Navigated to gydde.com');

    // Function to click on the specific image if found
    const clickSpecificImage = async () => {
      try {
        console.log('Checking for the image...');
        const imageSelector = 'img[alt="clicker"][src="/static/media/clicker.b86eae90ee37133e883d09d668ffc10d.svg"]';
        await page.waitForSelector(imageSelector, { visible: true, timeout: 60000 }); // Wait up to 60 seconds for the image to be visible
        const image = await page.$(imageSelector);
        if (image) {
          console.log('Image found, clicking...');
          await page.evaluate((img) => {
            img.scrollIntoView(); // Ensure the image is in the viewport
          }, image);
          await image.click({ delay: 100 }); // Click the image
          console.log('Image clicked');
        } else {
          console.error('Image not found or loaded');
        }
      } catch (error) {
        console.error('Error clicking image:', error);
      }
    };

    // Function to continuously handle click every second
    const handleActions = async () => {
      let startTime = Date.now();
      while (true) {
        try {
          // Click on the image once every second if found
          await clickSpecificImage();
          
          // Check if 5 minutes have passed since the start
          if (Date.now() - startTime >= 300000) { // 5 minutes in milliseconds
            console.log('Restarting script after 5 minutes...');
            await browser.close(); // Close the browser instance
            return launchFirefoxWithProfile(); // Restart the script
          }

          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before next action
        } catch (error) {
          console.error('Error in handleActions:', error);
        }
      }
    };

    // Start handling actions
    handleActions();

    // Handle page navigation events to reapply actions after navigation
    page.on('request', async request => {
      if (request.isNavigationRequest() && request.frame() === page.mainFrame() && request.url() !== 'about:blank') {
        console.log('Page navigation detected, reapplying actions...');
        try {
          await handleActions();
        } catch (error) {
          console.error('Error in navigation event handler:', error);
        }
      }
    });

  } catch (error) {
    console.error('Error launching Firefox browser', error);
    if (browser) {
      await browser.close();
    }
  }
}

launchFirefoxWithProfile();
