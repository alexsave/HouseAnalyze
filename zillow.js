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

//yes it's a global obj
let page;
let _b;

let modes = ['sale', 'rent', 'sold'];
let m;

//much easier way to do it potentially

//use the browser to directly load urls rather than clicking and stuff
const loadProperties = async (page, baseURL) => {
    let store = {};
    store.time = new Date().getTime();
    store.properties = [];

    baseURL = decodeURIComponent(baseURL);

    //you can't win, zillow
    baseURL = baseURL.replace('includeList=false', 'includeList=true');
    if(baseURL.includes("&wants="))
        baseURL = baseURL.substring(0, baseURL.lastIndexOf("&wants=") + 1);

    let pageNum = 1;
    baseURL = baseURL.replace('"pagination":{}', `"pagination":{"currentPage":${pageNum}}`);

    while(pageNum <= 20){ 
        //console.log(baseURL);
        //better to do it in browser, https fetch is unreliable
        await page.goto(baseURL, {waitUntil: 'networkidle0'});
        //await page.waitFor(5000);

        //now we parse
        const elem = await page.$('pre');
        const raw = await (await elem.getProperty('textContent')).jsonValue();
        //console.log(raw);

        const obj = JSON.parse(raw);
        const list = obj.searchResults.listResults;

        //console.log(list[0].address);
        
        for(let i = 0; i < list.length; i++)
            store.properties.push({...list[i]});

        //now do it again for the rest of the 20 pages
        //increment pagenumber and update the url
        baseURL = baseURL.replace(`"pagination":{"currentPage":${pageNum}}`, `"pagination":{"currentPage":${++pageNum}}`);
        //pageNum++;
    } 

    fs.writeFileSync(`${mode}.json`, JSON.stringify(store));
    //await _b.close();
    
    //next mode
    loadPage();
    
}

const resHandler = async res => {
    if(res.url().startsWith('https://www.zillow.com/search/')){
        baseURL = res.url()
        loadProperties(page, baseURL);
        page.off('response', resHandler);
        
    }
}


const loadPage = async () => {
    //lets see what we're loading
    if(modes.length === 0)
        _b.close();

    mode = modes.shift();
    await page.goto(`https://www.zillow.com/${city}/${mode}/`, {waitUntil: 'networkidle0'});

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
}


//fuck it, just load everything without checking stored

// puppeteer usage as normal
puppeteer.launch({ headless: false, defaultViewport: null, args:['--start-maximized']}).then(async browser => {
    _b = browser;
    page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080});

    loadPage();
});
