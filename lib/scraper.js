const { chromium } = require("playwright-extra");
const stealth = require("puppeteer-extra-plugin-stealth")();
const fs = require("fs");

chromium.use(stealth);

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* 🔥 Extract location from query */
function extractLocation(query){
  const parts = query.split(" ");
  return parts.slice(-2).join(" ");
}

async function scrapeLeads(){

  /* ✅ INPUT */
  const searchQuery = process.argv.slice(2).join(" ");

  if (!searchQuery){
    console.log("❌ Please provide a search query.");
    console.log('Example: node leadScraper.js "plumber phoenix"');
    process.exit(1);
  }

  const location = extractLocation(searchQuery);

  console.log("Query:", searchQuery);
  console.log("Location:", location);

  const browser = await chromium.launchPersistentContext("./chrome-profile",{
    headless:false,
    viewport:null,
    args:[
      "--start-maximized",
      "--disable-blink-features=AutomationControlled"
    ]
  });

  const page = await browser.newPage();

  console.log("Opening Google...");

  await page.goto("https://www.google.com",{waitUntil:"domcontentloaded"});
  await sleep(2000);

  console.log("Searching...");

  await page.click('textarea[name="q"]');
  await page.keyboard.type(searchQuery,{delay:100});
  await sleep(800);
  await page.keyboard.press("Enter");

  console.log("Waiting for results...");
  await page.waitForSelector("#search");
  await sleep(2000);

  /* CLICK MORE BUSINESSES */

  console.log("Looking for More Businesses...");

  const moreButton = await page.$('a:has-text("More businesses")');

  if(!moreButton){
    console.log("No 'More businesses' button found.");
    await browser.close();
    return;
  }

  console.log("Clicking More Businesses...");

  await Promise.all([
    page.waitForNavigation({waitUntil:"domcontentloaded"}),
    moreButton.click()
  ]);

  await page.waitForURL(/search/);
  await sleep(3000);

  /* STORAGE */

  let leads = [];
  let seenPhones = new Set();

  fs.writeFileSync("leads.csv","Position,Name,Phone,Website,Reviews\n");

  let pageNumber = 0;
  let position = 0;

  /* PAGINATION LOOP */

  while(true){

    console.log(`\nScraping page ${pageNumber+1}...`);

    await page.waitForSelector('div[data-hveid]',{timeout:15000});
    await sleep(1200);

    const cards = await page.$$(
      'div[data-hveid]:has([role="heading"])'
    );

    console.log("Cards found:",cards.length);

    for(const card of cards){

      try{

        const data = await card.evaluate(el => {

          const text = el.innerText;

          /* ❌ skip ads */
          if(text.toLowerCase().includes("sponsored") || text.includes("Ad")){
            return null;
          }

          const name = el.querySelector('[role="heading"]')?.innerText || "";

          const reviewsMatch = text.match(/\((\d+)\)/);
          const reviews = reviewsMatch ? reviewsMatch[1] : "";

          const websiteEl = el.querySelector('a[href^="http"]');
          const website = websiteEl ? websiteEl.href : "";

          /* ❌ remove ad links */
          if(website.includes("google.com/aclk")){
            return null;
          }

          const phoneMatch = text.match(/(\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);

          return {
            name,
            reviews,
            phone: phoneMatch ? phoneMatch[0].trim() : "",
            website
          };

        });

        if(!data) continue;
        if(!data.phone) continue;
        if(seenPhones.has(data.phone)) continue;

        seenPhones.add(data.phone);

        position++;

        const lead = {
          position,
          ...data
        };

        console.log(lead);

        leads.push(lead);

        fs.appendFileSync(
          "leads.csv",
          `"${position}","${data.name}","${data.phone}","${data.website}","${data.reviews}"\n`
        );

        await sleep(300 + Math.random()*400);

      }catch(err){
        console.log("Skipped card");
      }

    }

    /* NEXT PAGE */

    const nextButton = await page.$('#pnnext');

    if(!nextButton){
      console.log("No next page. Done.");
      break;
    }

    pageNumber++;

    console.log("Loading next page...");

    const nextURL =
      `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}
      &udm=1
      &near=${encodeURIComponent(location)}
      &hl=en
      &gl=us
      &start=${pageNumber*20}`;

    await page.goto(nextURL,{waitUntil:"domcontentloaded"});
    await sleep(2000);

  }

  console.log(`\n🔥 Total leads collected: ${leads.length}`);

  await browser.close();

}

scrapeLeads();