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
const fs = require('fs');
const https = require('https');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const city = 'dover-nh';

let store = {};

store.time = new Date().getTime();
store.properties = [];


let baseURL;

//yes it's a global obj
let page;

//much easier way to do it potentially
//use the browser to directly load urls rather than clicking and stuff
const loadPages = async (page) => {
    console.log(baseURL);

    //get rid of everything after '&wants=' to get better results

    
    //better to do it in browser, https fetch is unreliable
    await page.goto(baseURL, {waitUntil: 'networkidle0'});
    await page.waitFor(5000);

    /*https.get(baseURL, res => {
        let data = '';

        // A chunk of data has been recieved.
        res.on('data', (chunk) => 
            data += chunk
        );

        // The whole response has been received. Print out the result.
        res.on('end', () => 
            //console.log(JSON.parse(data))
            console.log(data)
        );

    }).on("error", err => 
        console.log("Error: " + err.message)
    );*/
    

    fs.writeFileSync('./data.json', JSON.stringify(store));
}

const resHandler = async res => {
    if(res.url().startsWith('https://www.zillow.com/search/')){
        baseURL = res.url()
        loadPages(page);
        page.off('response', resHandler);
    }
}

// puppeteer usage as normal
puppeteer.launch({ headless: false, defaultViewport: null, args:['--start-maximized']}).then(async browser => {
    page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080});

    await page.goto(`https://www.zillow.com/${city}/sold/`, {waitUntil: 'networkidle0'});

    //problem with zillow is that they don't show more than 500 addresses
    //so let's sort by newest
    //sort by new
    await page.click('.filter-button');
    await page.waitFor(500);//just to be safe
    await page.click('a[data-value="days"]');
    await page.waitFor(500);

    //get the url that is being loaded
    //but only do this once
    page.on('response', resHandler);

    //the last click will change the url, so this works
    await page.reload({waitUntil: 'networkidle0'});

    //baseURL = await page.url();
    //await browser.close();
    
});
    

    /*
    //next part just clicks through, 
    //this is what actually saves stuff. 
    page.on('response', async res => {
        //exclude walk & transit for now, I guess
        if(res.url().startsWith('https://www.zillow.com/graphql/') && !res.url().includes('WalkAndTransitScoreQuery')){
            //console.log(res.url());
            const json = await res.json();
            //this right here has a good amount of data
            //console.log(json.data.property);
            store.propertie6797631646586%2C"north"%3A43.30453570439518}%2C"mapZoom"%3A12%2C"regionSelection"%3A[{"regionId"%3A38225%2C"regionType"%3A6}]%2C"isMapVisible"%3Atrue%2C"filterState"%3A{"isPreMarketForeclosure"%3A{"value"%3Afalse}%2C"isForSaleForeclosure"%3A{"value"%3Afalse}%2C"isAuction"%3A{"value"%3Afalse}%2C"isNewConstruction"%3A{"value"%3Afalse}%2C"isRecentlySold"%3A{"value"%3Atrue}%2C"isForSaleByOwner"%3A{"value"%3Afalse}%2C"isComingSoon"%3A{"value"%3Afalse}%2C"isPreMarketPreForeclosure"%3A{"value"%3Afalse}%2C"isForSaleByAgent"%3A{"value"%3Afalse}}%2C"isListVisible"%3Atrue}&wants=s.push({...json.data.property});
        
        }
    });


    let nextPage = false;
    
    while(true){
        
        //get all cards on the page
        //.list-card to get all the property cards
        const cards = await page.$$('.list-card');
        //console.log(cards[0]);
    
        //potentially randomize order
        //or just add a wait
        for(let i = 0; i < cards.length; i++){
            await cards[i].click();
            await page.waitForNavigation({waitUntil: 'networkidle0'});
            await page.waitFor(1000);
        }
        
        //if it's not empty, then there's nothing left
        //if it's [], then there's more
        const nextBut = await page.$('a[disabled][title="Next page"]');


        nextPage = nextBut !== [];

        if(!nextPage)
            break;

        await page.waitFor(10000);
        await page.keyboard.press('Escape');
        await page.click('a[title="Next page"]');
        await page.waitForNavigation({waitUntil: 'networkidle0'});

            


    }

    
    await browser.close()

})*/



//when you load all the sold houses, save the time. 
//then from then on, use the time filter to save time scraping
//it's not like sold data changes


