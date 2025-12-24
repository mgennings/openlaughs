# Show Scraper Options & Implementation Guide

## Quick Comparison

| Option                                      | Difficulty  | Cost         | Maintenance | Best For                   |
| ------------------------------------------- | ----------- | ------------ | ----------- | -------------------------- |
| **No-Code Tools** (ParseHub, Octoparse)     | ⭐ Easy     | Free-$149/mo | Medium      | Quick start, non-technical |
| **Scraping APIs** (ScraperAPI, ScrapingBee) | ⭐⭐ Medium | $29-$99/mo   | Low         | Production, reliable       |
| **Custom Scraper** (Puppeteer/Playwright)   | ⭐⭐⭐ Hard | Free         | High        | Full control, custom logic |

---

## Recommended Approach: Start Simple, Scale Up

### Phase 1: Quick Win with No-Code Tool (This Week)

**Use ParseHub or Browser Extension** to extract a few shows and see the data
structure:

1. Go to Comedy Mothership website
2. Use ParseHub or Web Scraper extension
3. Extract show data (title, date, time, comedians, ticket link)
4. Export as JSON
5. Manually import first batch to understand data format

**Time**: 1-2 hours  
**Cost**: Free  
**Benefit**: See what data is available, understand structure

---

### Phase 2: Build Custom Scraper in DevTools (Next Week)

Once you understand the data structure, build a scraper in
`src/pages/devtools/scraper/`:

**Tech Stack Options:**

#### Option A: Puppeteer (Node.js) - Recommended

- Handles JavaScript-heavy sites
- Can take screenshots for debugging
- Good for dynamic content

```typescript
// Example structure
import puppeteer from 'puppeteer';

async function scrapeComedyMothership() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://comedymothership.com/shows');

  const shows = await page.evaluate(() => {
    // Extract data from DOM
    return Array.from(document.querySelectorAll('.show-card')).map(card => ({
      title: card.querySelector('.title')?.textContent,
      date: card.querySelector('.date')?.textContent,
      // ... etc
    }));
  });

  await browser.close();
  return shows;
}
```

#### Option B: Cheerio (Node.js) - Simpler

- Faster, lighter
- Good for static HTML
- Can't handle JavaScript-rendered content

```typescript
import * as cheerio from 'cheerio';
import axios from 'axios';

async function scrapeStaticSite() {
  const response = await axios.get('https://example.com/shows');
  const $ = cheerio.load(response.data);

  const shows = $('.show')
    .map((i, el) => ({
      title: $(el).find('.title').text(),
      date: $(el).find('.date').text(),
    }))
    .get();

  return shows;
}
```

#### Option C: Playwright (Node.js) - Most Modern

- Similar to Puppeteer but more features
- Better for complex sites
- Good TypeScript support

---

## Implementation Plan

### Step 1: Create Scraper Service Structure

```
src/pages/devtools/scraper/
├── ScraperPage.tsx              # Main UI
├── ScraperConfig.tsx            # Configure target sites
├── ScraperResults.tsx           # Review imported shows
├── services/
│   ├── comedyMothership.ts     # Comedy Mothership scraper
│   ├── baseScraper.ts          # Base scraper class
│   └── matcher.ts              # Match venues/comedians to DB
└── hooks/
    └── useScraper.ts            # Scraper state management
```

### Step 2: Scraper Features

**Must Have:**

- ✅ Extract show data (title, date, time, venue, comedians)
- ✅ Match venues to existing DB records
- ✅ Match comedians to existing DB records
- ✅ Preview before importing
- ✅ Manual review queue
- ✅ Duplicate detection

**Nice to Have:**

- ⭐ Schedule automatic runs (daily/hourly)
- ⭐ Email notifications for new shows
- ⭐ Support multiple venues
- ⭐ Handle different website formats

### Step 3: Data Matching Logic

**Venue Matching:**

```typescript
// Match scraped venue name to DB venue
async function matchVenue(scrapedVenueName: string): Promise<Venue | null> {
  // Try exact match
  // Try fuzzy match (Levenshtein distance)
  // Try Google Places ID if available
  // Return null if no match (prompt user to create)
}
```

**Comedian Matching:**

```typescript
// Match scraped comedian name to DB comedian
async function matchComedian(scrapedName: string): Promise<Comedian | null> {
  // Try exact match on stageName
  // Try fuzzy match
  // Return null if no match (prompt user to create)
}
```

---

## Online Tools That Return JSON Directly

### 1. **Apify** (Best for Pre-built Scrapers)

- Check if someone already built a scraper for Comedy Mothership
- If yes, just use their API:
  `GET https://api.apify.com/v2/acts/{actorId}/runs/last/dataset/items`
- Returns JSON directly
- **Cost**: Free tier available, then pay-per-use

### 2. **ScraperAPI** (Best for Custom Sites)

- Send URL, get HTML back
- You parse HTML to JSON
- Handles proxies, CAPTCHAs automatically
- **Cost**: $29/month for 25k requests

### 3. **ScrapingBee** (Similar to ScraperAPI)

- Can extract JSON directly with CSS selectors
- **Cost**: $49/month for 25k requests

### 4. **Browser Extensions** (Quick Testing)

- **Web Scraper** (Chrome): Point-and-click, exports JSON
- **Data Miner** (Chrome): Visual scraper, exports JSON
- **Scraper** (Chrome): Simple, exports CSV/JSON

---

## Quick Start: Browser Extension Method (5 minutes)

1. Install "Web Scraper" Chrome extension
2. Go to Comedy Mothership shows page
3. Create new sitemap
4. Select show elements (title, date, etc.)
5. Run scraper
6. Export as JSON
7. Use that JSON to understand data structure

**Then** build custom scraper based on what you learned.

---

## Custom Scraper Implementation Example

### Backend: Lambda Function (Recommended)

```typescript
// amplify/backend/function/showScraper/src/index.ts
import { Handler } from 'aws-lambda';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const handler: Handler = async event => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
  });

  const page = await browser.newPage();
  await page.goto('https://comedymothership.com/shows');

  const shows = await page.evaluate(() => {
    // Your extraction logic
  });

  await browser.close();

  return {
    statusCode: 200,
    body: JSON.stringify(shows),
  };
};
```

### Frontend: DevTools UI

```typescript
// src/pages/devtools/scraper/ScraperPage.tsx
const ScraperPage = () => {
  const [scraping, setScraping] = useState(false);
  const [results, setResults] = useState<ScrapedShow[]>([]);

  const handleScrape = async () => {
    setScraping(true);
    // Call Lambda function or run in browser
    const shows = await scrapeComedyMothership();
    setResults(shows);
    setScraping(false);
  };

  return (
    <div>
      <button onClick={handleScrape} disabled={scraping}>
        {scraping ? 'Scraping...' : 'Scrape Shows'}
      </button>
      <ScraperResults shows={results} />
    </div>
  );
};
```

---

## Cost Comparison

| Solution           | Monthly Cost | Setup Time | Maintenance |
| ------------------ | ------------ | ---------- | ----------- |
| Browser Extension  | Free         | 5 min      | Manual runs |
| ParseHub Free      | Free         | 30 min     | Low         |
| ParseHub Pro       | $149         | 30 min     | Low         |
| ScraperAPI         | $29          | 1 hour     | Low         |
| Custom Puppeteer   | Free         | 1-2 days   | Medium      |
| Lambda + Puppeteer | ~$5-10       | 2-3 days   | Medium      |

---

## Recommendation

**Start Here:**

1. **This Week**: Use Web Scraper extension to extract 10-20 shows, export JSON
2. **Next Week**: Build simple Puppeteer scraper in devtools
3. **Later**: Move to Lambda function for scheduled runs

**Why This Approach:**

- ✅ Learn the data structure first (no guessing)
- ✅ Build scraper with real data examples
- ✅ Iterate quickly in devtools
- ✅ Scale to Lambda when ready

---

## Legal Considerations

⚠️ **Always check:**

- Website's `robots.txt` file
- Terms of Service
- Rate limiting (don't hammer servers)
- Respect copyright

**Best Practices:**

- Add delays between requests (1-2 seconds)
- Use proper User-Agent headers
- Don't scrape too frequently
- Consider reaching out to venues for API access

---

## Next Steps

1. **Today**: Try Web Scraper extension on Comedy Mothership
2. **This Week**: Export JSON, understand data structure
3. **Next Week**: Build basic Puppeteer scraper in devtools
4. **Later**: Add Lambda function for scheduled scraping

Want me to help you build the scraper once you've tested with the browser
extension?
