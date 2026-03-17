import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";

chromium.use(stealth());

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

function extractLocation(query){
  const parts = query.split(" ");
  return parts.slice(-2).join(" ");
}

export async function scrapeLeads(searchQuery){

  if (!searchQuery){
    throw new Error("No search query provided");
  }

  const location = extractLocation(searchQuery);

  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage();

  await page.goto("https://www.google.com",{waitUntil:"domcontentloaded"});
  await sleep(1500);

  await page.fill('textarea[name="q"]', searchQuery);
  await page.keyboard.press("Enter");

  await page.waitForSelector("#search");
  await sleep(2000);

  const moreButton = await page.$('a:has-text("More businesses")');

  if(!moreButton){
    await browser.close();
    return [];
  }

  await Promise.all([
    page.waitForNavigation({waitUntil:"domcontentloaded"}),
    moreButton.click()
  ]);

  await sleep(2500);

  let leads = [];
  let seenPhones = new Set();
  let pageNumber = 0;
  let position = 0;

  while(true){

    await page.waitForSelector('div[data-hveid]');
    const cards = await page.$$('div[data-hveid]:has([role="heading"])');

    for(const card of cards){

      try{
        const data = await card.evaluate(el => {

          const text = el.innerText;

          if(text.toLowerCase().includes("sponsored")) return null;

          const name = el.querySelector('[role="heading"]')?.innerText || "";

          const websiteEl = el.querySelector('a[href^="http"]');
          const website = websiteEl ? websiteEl.href : "";

          if(website.includes("google.com/aclk")) return null;

          const phoneMatch = text.match(/(\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);

          return {
            name,
            phone: phoneMatch ? phoneMatch[0].trim() : "",
            website
          };

        });

        if(!data) continue;
        if(!data.phone) continue;
        if(seenPhones.has(data.phone)) continue;

        seenPhones.add(data.phone);
        position++;

        leads.push({
          position,
          ...data
        });

      }catch(e){}
    }

    const nextButton = await page.$('#pnnext');
    if(!nextButton) break;

    pageNumber++;

    const nextURL =
      `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&start=${pageNumber*20}`;

    await page.goto(nextURL,{waitUntil:"domcontentloaded"});
    await sleep(1500);
  }

  await browser.close();

  return leads;
}