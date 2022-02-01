const puppeteer = require("puppeteer");
require("dotenv").config();

async function fetchTodoList() {
  
  const URL = "https://randomtodolistgenerator.herokuapp.com/library";
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(URL);

  const todoListTitles = await page.$$eval(".task-title > div", (nodes) =>
    nodes.map((el) => el.textContent)
  );
  const todoListDescriptions = await page.$$eval(".card-text", (nodes) =>
    nodes.map((el) => el.textContent)
  );

  await browser.close();

  return todoListTitles.map((elem, i) => {
    return { title: elem, description: todoListDescriptions[i] };
  });
  
}

async function accessTodoist(todosToAdd) {
  // console.log(todosToAdd);

  let err = { msg: "" };

  const URL = "https://todoist.com/users/showlogin";
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(URL);

  // Selecting email and password field
  const emailField = await page.$("#email");
  const passwordField = await page.$("#password");

  // Typing on each field its correspondence values
  await emailField.type(`${process.env.email}`);
  await passwordField.type(`${process.env.password}`);

  await (await page.$(".submit_btn")).click();

  for (let i = 0; i < todosToAdd.length; i++) {
    do {
      try {
        await page.waitForTimeout(2000);

        const addTodoBtn = await page.$(".plus_add_button");
        await addTodoBtn.click();

        const titleField = await page.$(".DraftEditor-editorContainer > div");
        const descriptionField = await page.$(
          ".task_editor__description_field"
        );

        await titleField.type(`${todosToAdd[i].title}`);
        await descriptionField.type(`${todosToAdd[i].description}`);

        err.msg = "";
      } catch (error) {
        await page.reload();
        err.msg = error;
        console.log(err.msg);
      }
    } while (err.msg !== "");

    await (await page.$(".reactist_button")).click();
  }

  await browser.close();
}

fetchTodoList().then(async (data) => {
  await accessTodoist(data);
});
