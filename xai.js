const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const chalk = require('chalk');
const readline = require('readline');

async function launchFirefoxWithProfile() {
  const addresses = [
    '0xf048F34e0dC1A99BDc89627048760D4e4a476C7a',
    '0x64251568702C811CE58019bC8A99A62e6e5af07c',
    '0x352687e1FF8E536Bd6E681E6E09ffB51d23aBD1E',
    '0x08ef043B99Da68ed4a54E24Cee723Afe8dfE8db3',
    '0xAF1fBF5F6C1Fd9dd989B37B714FC9727C25a8241',
    '0x7bb40c2Ddc0937d8Afd5f7Ae055EB4a9c02Fc5cb',
    '0x998d4A9dF557833B3EF391B75cd9aA6790bc449e',
    '0x9DE16b39cf5c0A5E6eC7D71f7Abd9aF85bcA6AC9',
    '0x93179d687B51254349611eaF4ea6aBF13B604829',
    '0x1ea577E52e0880029dfCCD0bFD1335575d430147',
    '0xb22f0bec2405de19a1078D4126eEE410814EA43e',
    '0xC6D12242211C65F5F9594850e6F4AE3C20e80B6a',
    '0x0c6bbe19aDB3F6a569Cb552C289bb4055A457A7b',
    '0x3637D5C078576223CcFb0B16AF327B481454C23d',
    '0x244F0b4b6d1166165cc51645713DD55bCCc7B7ED',
    '0xD8f945A80766640552d10915ea5720511D492a7d',
    '0x408A09Adfc21C1C9892608D956581D04925B1f01',
    '0xe18b9ea509994cE5046c9d56dAfC3e9a957eECA2',
    '0x11A838eb6A616A53C300fECFe0884369a67bf53d',
    '0xF15BDbc3ae5E93DE8dA9491655A4f797a60671c4',
    '0x94eE3CA57Bb20f8d8BD7354f40e9A652eB7EFCae',
    '0xAEf07903a6121bB06cF6BFc32609987E362824D7',
    '0xF1680D368fC1BDB185DfeB028ad08D3D8982D143',
    '0x52bfF064465a645032BE352d03aBad5cA33B5C5b',
    '0x60F3d31dB1df47c5ceFB7b2618667598ceD103E9',
    '0x4C48d19140A70bcc0FEfBe85fA869Bc5b9c0EAE2',
    '0x84f489b104Dc33a2E3849e280cB54FB82141D6a9',
    '0x5EfE4cbaB6F41FcB2281E33d0ccb5E30613B2B73',
    '0x2BEb7086Eef549dbA7Fd11D5663c662C3f70549E',
    '0xDB379F3cAB815f3b00C8e0F29bF2c546E6Fd1600',
    '0x4f7312a4c54018B522d11e67FDBC5C6C1E6cAea7',
    '0xdd9F501E1d7a11746b742b72196395740BDb2217',
    '0x32fd49abBbdb899d224c9AcaF2d3b397D099D949',
    '0x6b94e58c3F67C69Cf4d13FF40aE35857C441d930',
    '0x508E65E8f6715278CF051DbcEe0e8E5872fabD36',
    '0xE6204C591a9122720957404e4E4853F19090e403',
    '0xbFd7B93f99Fa4347208ACa3C50203b1AA0621426',
    '0x286028BF52CcB0838e206e6aCDe1e1281B76A901',
    '0x1F7300D6bA90139B8178f02DbCeD236C04dbE3D3',
    '0x0e4F3b1718c8D2E441c787Ab30365dF1f58FB16d',
    '0x90338B68761385ABe9c8E681F79a284a3d9338F7',
    '0x6690e84E662905e08D787250F634a3057dB3D94b',
    '0x2121d5BfC209D7A2d796d8fCd35bE2f13fA18f58',
    '0xd745dd7c3402240dDA18C78D592F3Fa9796C5a8E',
    '0x9523b6B0ae64Bb09d9113cb166F02b32Cca097fa',
    '0x000484930cdC65Cefb5E3b17C363F687dfc1b901',
    '0x986E52736a851604Be9fA0865Bc7d10fE6178020',
    '0x33D7289fa9109A369e208Fc94e608c9D9a1293A3',
    '0x438925f5e5F566C8107769a081738b8E63BDD036',
    '0x2a63ca2f2aeA90b51b2F7140AC58e0ae6C555f2e',
    '0xe6B37ED027264802C62F85DB02183f01Ac9b5A02',
    '0xC3910cf06C713A7F0C9483989911C1cf45CdD1b2',
    '0x63A076794200778c33B6287726e2867c90602042',
    '0x6E764881Df2Be25De228F3d87fD376fF65e9C6c8',
    '0xd564b6E38725C59E7173704e3431F0F812aF1e30',
    '0x1740c7316C9D5EFF54511471aD1E32cFAc4F4bB0',
    '0x891AE056346e78b2555FfcC963DDDd3C2d8C2375',
    '0x3d1C8a5bE661858B5260723aA328140a25dB6D3F',
    '0xC90C9edaBb265e271b433d2Cd2BE0bD71FfEA8D9',
    '0xF31D4907B4030c75aD619A02AF8A00eF21c55f0e',
    '0xD8D5Dac4FCAA36588c158f4D272EC9c65684f8c3',
    '0x4844D627341ae746cF30fe21e066eC02568A5B56',
    '0xDf8A0203df5aBd2d9C54a947F5b966467f7aEeE6',
    '0x16AcBcE53dFa862e9feb650a5ff4387EB85a7808',
    '0xCc32A3228f440C5C08F9109C4BE88d1632549DF2',
    '0x45C43F108f67c4A2DdafA7Db8cDF8f0B74285A1B',
    '0x90F95e8A74a53cDB595394850835bC465b945aA5',
    '0x5b10c8A99473079D6425099E14D718F3D37DCC7C',
    '0xAd5089123ED5575104B496B725F5c19EAA136822',
    '0x7A5CAddea5681f22e8ef7EA71e47B2aec725a01c',
    '0xE165C8dDBE7055563b2B8e1A22DBB6d5142f37c3',
    '0xDbF48AEfA7a1d6Ba22366D86ddB402d4E3791dba',
    '0x7b125960695cd1e951b9dFa579563D7932837998',
    '0xcB70cB3E8B32267480b44E8E17d0A6795227e24F',
    '0xC1406C47De317347b091Beb7A0143cf4eE1B98C3',
    '0xCB78c4801AC5dc107fc4d532c4155b916485c122',
    '0x10eF211cB6c963a91bca43CC9900BA8b4ade555d',
    '0x7D65acaCCA9FB65bAc0D946c759fc59766A88174',
    '0x2f2E84CBf6B4fB23891F4195980Ba10f13Ba8eF7',
    '0x312DA051a873E2603e52c9cc0698b8116e2CDC72',
    '0xCDF9b80921f8B2f970e3461639c8b779526B4708',
    '0x03358a5Ccaf10e200c3e0c5Bd709AB2499124bE6',
    '0xb8f73e9a793aA4B13d0E31E5a8A95bDC23086AdA',
    '0x7Ac5a807Ce8018b4E12b8A710Fff1531B3Fcffe9',
    '0x86a64C6B252707c404dD345EDFDD1057bCf98572',
    '0x09323d1b017E6f956856015F01f06CD3cdB5184B',
    '0xe6e4B570fC2BafCf38aa8E2DF9d6A09CE32B7BC0',
    '0x1576520e719d6F75B1c0C6Aa90BC56Da4302Dbbe',
    '0xa9FB8Ff41891db376EF9B862910137aa05298f06',
    '0x2e169738118B3Fa41D97Ee4380D9AaC8294505BE',
    '0xdcC62122e72922e991a17Ca5Db038f579B625f71',
    '0x80b71F9870c634F960DE0592dE1042F01b2CD226',
    '0x67C1A66827433746A09F36ba9BDB4E7b8349FdFD',
    '0xAdD7747d2A23e06f0Df2c6989387AA0295d151D7',
    '0xcDeB152478a3d58158B437484235B62C66621D46',
    '0x40E4C806b2AA85169657eC8e71F32255fe4BA980',
    '0x1Cb807711efa01678b70A9a7e2645861c3B375D9',
    '0x7517152EF6Cc72108ca1A86BF2ef4D0619f312Bd',
    '0x207A12CaC3990Ec1f8F811D19ad972C090Ec6810',
    '0x42ad87Faa9a2aD8C1702A638ddF8498E48D72Bc3',
    '0x9A979Ee2fe0E721d89b4e21F6232C1fcABE7C81F',
    '0x62E602D841dD0961D4CcA68d943BD8AEEba09233',
    '0x8fD70dCDeF7C871f473118162a39887E9AefF56d',
    '0x7c161109155f8211b50EcAA519909B3BA2D4eD60',
    '0x9eB0b6b1D50Ba2C2628eA3837687aaeD058e4367',
    '0xA9A11E14323bE42df6D52984804777C3cBdA0dC6',
    '0xad74dDafe681D75AbcA8fEdD4853D9cE8d4B510f',
    '0x4fBbA19A640141A5F7338687895bD26f98BE49A5',
    '0x4C6B697E51681ce81D97950553A01E87c9539b1b',
    '0xEb7712cD69A9b34Fcc356329593Cb0a68dDa77cc',
    '0x7AA5974D279a3D05529126D41E4B34a93E0E5a2d',
    '0xBA29D9e4e59E214061b96D691c8F78559f0a1A13',
    '0xa37B965767a2C260b063f7e0CB7307a6F0d5678E',
    '0xe0501628EF4eD30dBDb25c21B660Cc75456d81F3',
    '0x589931e822bAD79CBF8eEf89b05514D36e30BC56',
    '0x40ed00b9115cAf503a0f88dB3bC29fc07Cc55d35',
    '0x23eC7b553e0FC8b2702A93cA9421042DB5A908f9',
    '0x0C3F88cF90B9A47fa6fb8f243f944E1Ff46B697a',
    '0x33792C8c61377da118136F521F9d1Dd95d6b10Db',
    '0x9a8A40b33d424aE1d96556fc100fdDeB029b5a0E',
    '0xb171497B7Dd56BA1bB6B3B3c0Da5317d4871059f',
    '0x64a8936B6D893E8D0697f4Be949F9b3C43e9999a',
    '0x0F7f2EE17C167751e7b22c8c24E9a5ac8aC295D3',
    '0xa4B7aBa64D8F62eA128D447cC0AdECC4F2214191',
    '0x42cdE88161BAE2aAef00e0dF4EF9861113027B3E',
    '0x0361C6b28B1CBef8DfC02B2442da016922209212',
    '0x6fb43EBD3c0386b63748cf02c2007B2813D9Fd00',
    '0x363b14536E9aFf9DEdaFDbf6F2E873DAdD5299F7',
    '0x2C7366d1313e8842688072A45fe73361C8247b9c', 
    '0x9493ed50830Cbc0Ea9b690bdf349383cb31D7ca9',
    '0x58F8C66ed22e7A0aceeAE5e88947b62DEfF843CF',
    '0x39Bcd6c1cA9DE4aEc991715E1fa1faeED454751d',
    '0x51921a29eB6E0eB05260736cc327224e27985D38',
    '0x0602d4e6DbdFAABe5678be46Cf465A7376C96211',
    '0xc96A4526a34aA357dD35860D0081b0a308b5bABb',
    '0x8B2da80Db8A907CBb9bEab7f8d39c7cE77C9C585',
    '0x8850AdEAdB68696A52e562A7b90E05E519BC969a',
    '0xa2ab199bA25739d200997c523e1D1B10012aC7e6',
    '0x3e41c6222D7C830a481530F1c384206f431b3D68',
    '0xB124ca0d82392dbc69C5Bedd8050170dB933b5CF',
    '0xf092378977F2F68d4355592649043D321cf75776',
    '0x89FdA35d2e99eC47FA594F728c1d3bf611157E57',
    '0x5B588fa728182F6390B713a5b62104EECe6C1296',
    '0x1E74092a0d9ca693d0D7061Ac003b9569413fACf',
    '0x0Ff76af474125132d074A0811A9c9fE5d44Bf6d4',
    '0x16e9ae731861673FE9e42C3b401a361f1866650B',
    '0xf092c280bD6a721FC282c21e338C547233317896',
    '0xC62dAb8608c9a4Be11717C4359ea1e00eCBA9C61',
    '0x7dac22a6f0e3a46E2e8f42A9a5d157a2Ef0166D8',
    '0x6405008fbd9150f704deb3542a37a547401b8a30',
    '0x8c648437A114faa40a171cD5A9df2773Cb028bdE',
    '0x5A3C5B903724E174eed4673f7A8E243D79653A8A',
    '0xd1d0D05a0110f40AcF1c8B891835729d4B426A63',
    '0x5272Cbfd77A7D57488C0CD987f34a2fBe7feEE07',
    '0xFdbB6670B459E559158658A6Ba968eC0c1439A5E',
    '0xE3A9f2D9dC7b0B66066814005D3eEd1894744C34',
    '0xF4f8249b7b4a59b23A194c230C10915c55bfbaA2',
    '0x9a537AC709b9e42c4E29Ff016fd69c7449cF24f2',
    '0xC0767708cD8aBc4AC578b105534c3d701502B243',
    '0x7124C08009119CcA5dB5e141297A749952B46258',
    '0xF7C42bf81066e0C8048EC92D3c38F1Ce4F5Fe0D1',
    '0x1F9C2ebBB50D2344e96cD2D8662fCA67bbEFa02c',
    '0x2de5f6A3bE58Da9c1977a00927aDa2B036Ee243A',
    '0x4bfcEF12E83Ac5E3c57EDD1A293674Bac3Ab5a95',
    '0x9FA0421633c155c4bb99e8C198C8aE38F097f9A8',
    '0x0e2d1ADD21d57B307f74268e3D5d751DfaCc3bef',
    '0x1CD7d0Efb29B7712e72530D5F4deff4ca5B41f1E',
    '0x40B43460E3076DD968DDfaa82DbD134028e34a56',
    '0x389f904a3b3E8D4831DfD6260Ed3F9b44B0fe8B1',
    '0xDe0FD1194435362282aa6237364aCA405B3d1598',
    '0x4C2365838f48443eC6B233d3606a26c40Aa2e44F',
    '0xe4Dd60d60a265Bf972df0c74d9382D4F69a5Efc0',
    '0x8a57448d1168D629387F2367c70034D65C0BDf1e',
    '0x81d3Eb4DAC337E286996d5eec7Bd7de7A54Ac78A',
    '0x4551dD89f413eb813602D043E874C9083C37FC42'
];

let startIndex = 0; // Set the start index directly

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

    try {
      console.log('Launching Firefox browser...');
      
      const options = new firefox.Options();
      options.setProfile('C:/Users/User/AppData/Roaming/Mozilla/Firefox/Profiles/0ti9w4vp.default-release');
      options.setBinary('C:/Program Files/Mozilla Firefox/firefox.exe');
      options.addArguments('-headless'); // Run in headless mode
      options.addArguments('-foreground=false'); 
      // Disable image loading
      options.setPreference('permissions.default.image', 2);

      driver = await new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(options)
        .build();

      console.log('Firefox browser launched successfully.');

      // Function to click all 'Claim' buttons
      const clickAllClaimButtons = async (address) => {
        try {
          let retryCount = 0;
          while (true) {
            await driver.wait(until.elementsLocated(By.xpath("//button[text()='Claim']")), 10000);
            let buttons = await driver.findElements(By.xpath("//button[text()='Claim']"));
      
            if (buttons.length === 0) {
              console.log('🔍 No Claim buttons found. Moving to next address.');
              break;
            }
      
            console.log(`🛠️ Found ${buttons.length} Claim buttons. Attempting to click...`);
      
            for (const button of buttons) {
              try {
                await button.click();
                console.log('✔️ Successfully clicked a Claim button.');
              } catch (clickError) {
                console.error('❌ Error clicking a Claim button:', clickError);
              }
            }
      
            await driver.sleep(2000); // Short delay to allow any updates
      
            buttons = await driver.findElements(By.xpath("//button[text()='Claim']"));
            const isAnyButtonPresent = buttons.length > 0;
      
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
      
      // Function to wait for label and click on it
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

      // Function to type the address
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
        driver = await new Builder()
          .forBrowser('firefox')
          .setFirefoxOptions(options)
          .build();
        console.log('Firefox browser restarted successfully.');
        await driver.get('https://vanguard.xai.games/');
        console.log('Navigated to https://vanguard.xai.games/');
        await waitForLabelAndClick();
        await typeAddress(address);
        await clickAllClaimButtons(address); // Retry the clicking process for the same address
      };

      // Launch operations for each address starting from startIndex
      let i = startIndex;
      while (true) { // Infinite loop
        const address = addresses[i % addresses.length]; // Cycle through the addresses

        console.log(chalk.blue(`Current address (${i + 1}): ${address}`));

        if (i > startIndex) {
          console.log(`Waiting for 3 seconds before proceeding to the next address.`);
          await driver.sleep(3000); // Wait for 3 seconds before proceeding to the next address
        }

        if (i === startIndex) {
          await driver.get('https://vanguard.xai.games/');
          console.log('Navigated to https://vanguard.xai.games/');
        }

        await waitForLabelAndClick();
        await typeAddress(address);

        console.log(`Checking for 'Claim' buttons...`);
        await clickAllClaimButtons(address);

        await driver.sleep(3000);

        const queuedButtons = await driver.findElements(By.xpath("//button[contains(text(), 'Queued')]"));
        if (queuedButtons.length > 0) {
          console.log(`Queued buttons found for address ${address}. Restarting browser for the next address.`);
          await restartBrowserWithAddress(address);
        } else {
          const claimedButtons = await driver.findElements(By.xpath("//button[contains(text(), 'Claimed')]"));
          if (claimedButtons.length > 0) {
            console.log(`Claimed buttons found for address ${address}. Continuing without refreshing.`);
          } else {
            console.log(`No Claim or Queued buttons found for address ${address}. Proceeding to next address.`);
          }
        }

        i++; // Increment the index to move to the next address
      }

    } catch (error) {
      console.error('Error launching Firefox browser', error);
    } finally {
      await handleExit();
    }
  }

  startAutomation();
}

launchFirefoxWithProfile();