import puppeteer from "puppeteer";

export async function listTopSolanaMindshareTokens() {
  const url =
    "https://www.cookie.fun/api/trpc/agents.getAgentsTableDetails?batch=1&input=" +
    encodeURIComponent(
      JSON.stringify({
        "0": {
          json: {
            page: 1,
            limit: 15,
            orderColumn: "TwitterMindshare",
            orderByAscending: false,
            orderDataPoint: "_7DaysAgo",
            tags: [],
            projectsFilter: {
              blockchainFilter: { chains: [-2] },
              categoriesFilter: { values: [] },
              creationDateFilter: null,
              frameworkFilter: { values: [] },
              metricFilters: [],
              projectTypeFilter: { values: [] },
              searchFilter: "",
              tagsFilter: { values: [] },
            },
            isWatchlist: false,
          },
        },
      }),
    );

  const browser = await puppeteer.launch({ headless: true }); // Use headless: false for debugging
  const page = await browser.newPage();

  // Set headers and user agent
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
  );
  await page.setExtraHTTPHeaders({
    Accept: "application/json",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9",
    Connection: "keep-alive",
  });

  await page.goto(url, { waitUntil: "networkidle2" }); // Wait for requests to settle

  // Extract response from page
  const response = await page.evaluate(() => document.body.innerText);

  await browser.close();

  return response;
}
