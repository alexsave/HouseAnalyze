// first step is to download a bunch of data
// we will look at house sale prices and try to fit a model
// then look at rent in the area and run it on the same houses to predict rent
// ??
// profit

//Starting small with Dover NH
//there are many house listing things but zillow sounds fine to start with
//starting with sold

//best way might be to do this with puppeteer


const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
    const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const city = 'dover-nh';

// puppeteer usage as normal
puppeteer.launch({ headless: false, defaultViewport: null, args:['--start-maximized']}).then(async browser => {
    console.log('Running tests..')
    const page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080});

    await page.goto(`https://www.zillow.com/${city}/sold/`, {waitUntil: 'networkidle0'});
    await page.waitFor(5000)

    //.list-card to get all the property cards
    const cards = await page.$$('.list-card');
    //console.log(cards[0]);

    //potentially randomize order
    //or just add a wait
    for(let i = 0; i < cards.length; i++){
        await cards[i].click();
        await page.waitForNavigation({waitUntil: 'networkidle0'});
        await page.waitFor(3000);
        break;
    }


    
    await browser.close()
})


//when you load all the sold houses, save the time. 
//then from then on, use the time filter to save time scraping
//it's not like sold data changes


