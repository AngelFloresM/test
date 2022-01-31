const puppeteer = require("puppeteer");

const URL = "https://randomtodolistgenerator.herokuapp.com/library";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(URL);

  const todoList = await page.$$(".taskCard");

  console.log(todoList.length);

  await browser.close();
})();
