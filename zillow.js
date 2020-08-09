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
    const page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080});

    await page.goto(`https://www.zillow.com/${city}/sold/`, {waitUntil: 'networkidle0'});

    //sort by new
    await page.click('.filter-button');
    await page.waitFor(500);//just to be safe
    await page.click('a[data-value="days"]');
    await page.waitFor(500);
    //the last click will change the url, so this works
    await page.reload({waitUntil: 'networkidle0'});
    

    //.list-card to get all the property cards
    const cards = await page.$$('.list-card');
    //console.log(cards[0]);

    //next part just clicks through, 
    //this is what actually saves stuff. 
    page.on('response', async res => {
        //exclude walk & transit for now, I guess
        if(res.url().startsWith('https://www.zillow.com/graphql/') && !res.url().includes('WalkAndTransitScoreQuery')){
            //console.log(res.url());
            const json = await res.json();
            //this right here has a good amount of data
            //console.log(json.data.property);
        
        }
    });

    //potentially randomize order
    //or just add a wait
    /*for(let i = 0; i < cards.length; i++){
        await cards[i].click();
        await page.waitForNavigation({waitUntil: 'networkidle0'});
        await page.waitFor(3000);
        break;
    }*/

    //problem with zillow is that they don't show more than 500 addresses
    //so let's sort by newest


    
    await browser.close()
})


//when you load all the sold houses, save the time. 
//then from then on, use the time filter to save time scraping
//it's not like sold data changes


