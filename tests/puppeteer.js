const puppeteer = require("puppeteer"); //headless == "without a graphical user interface". browser use
require("dotenv").config();
const chai = require("chai"); //assertions
const { server } = require("../app"); // what we test

// Sleep function to introduce delays in asynchronous operations
//it will tell puppeteer to wait the given amount of milliseconds before moving to the next line in the test.
//creates a promise that is executed 1 time in time we specify later- 2s on line 80
//if the time of execution is more than 200ms- it appears in red  for example(259ms)
// here it is mainly used to wait for the result of asynchrnous operations like when you click on a button. Since it takes a few milliseconds for the browser to take that click event, send the API request, and do something with the result. In the test we want to make sure we give the browser the time to do all that, before we check the output. 
//check other methods to wait for async operations  https://stackoverflow.com/questions/46919013/puppeteer-wait-n-seconds-before-continuing-to-the-next-line
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//enables the Chai assertion style that allows to use natural language assertions
chai.should();

//immediately invoked async function expression to encapsulate test login 
//this approach allows immediately running a function but without saving it to a variable or giving it a name; so after it's been run once; no other code in the file/application can run it again or access any variables that were defined inside the IIFE.
//Encapsulation = A concept from object-oriented-programming (OOP). It's the idea of combining data and methods in some format that makes access to that data/methods restricted from the outside. Common ways of achieving encapsulation in Javascript are using objects, closures, IIFEs, and classes.
//In this case, we're encapsulating all the test logic; in order to group them together and make the variables not accessible from the outside. 
(async () => {
  //here we are grouping related tests together by the title of Functional Tests..
  describe("Functional Tests with Puppeteer", function () {
    let browser = null;
    let page = null;

    // Before hook to set up the browser and page before the tests are executed
    before(async function () {
      this.timeout(5000);// 5s  for Puppeteer to launch and navigate to our server's home page. generally for a straightforward server application we probably won't need to adjust the default timeout like this.
      browser = await puppeteer.launch();
      page = await browser.newPage(); //create new page= headless Chrome browser is opening a new tab.
      await page.goto("http://localhost:3000"); //navigate to localhost
    });

     // After hook to close the browser and server after the tests finish
    after(async function () {
      this.timeout(5000); //in 5 s
      await browser.close(); //close browser
      server.close(); //stop server
      return;
    });

 //Test case for checking the connection to the site


 //This test isn't really validating anything; but if it completes successfully, then we know that no errors or issues happened with the before hook. 
    describe("got to site", function () {
      it("should have completed a connection", function (done) {
        done();
      });
    });
//or:
//describe("got to site", function () {
  // it("should have completed a connection to the server home page", function (done) {
  //   const currentUrl = page.url(); // Access the page.url method: https://pptr.dev/api/puppeteer.page.url
  //     chai.expect(currentUrl).to.equal("http://localhost:3000/");
  //     done();
  //   });
  // });


     // Test suite for the people form
    describe("people form", function () {
      this.timeout(5000); // we're allowing each test in this describe block 5 seconds to complete.
      // Test case to check the presence of various form elements
      it("should have various elements", async function () {
        // Code to select and assert the presence of form elements
        // uses page.$() to select specific elements on the page using CSS selectors
        this.nameField = await page.$("input[name=name]");
        this.nameField.should.not.equal(null);// verify that the selected elements are not null, indicating their presence on the page.
        this.ageField = await page.$("input[name=age]");
        this.ageField.should.not.equal(null);
        this.resultHandle = await page.$("#result");
        this.resultHandle.should.not.equal(null);
        this.addPerson = await page.$("#addPerson");
        this.addPerson.should.not.equal(null);
        this.personIndex = await page.$("#index");
        this.personIndex.should.not.equal(null);
        this.getPerson = await page.$("#getPerson");
        this.getPerson.should.not.equal(null);
        this.listPeople = await page.$("#listPeople");
        this.listPeople.should.not.equal(null);
      });

      // Test case to create a person record given name and age
      it("should create a person record given name and age", async function () {
        // Code to interact with the form, submit values, and assert the result
        await this.nameField.type("Fred");
        await this.ageField.type("10");
        await this.addPerson.click();
        await sleep(200); // async fn is expected to be completed in 0.2s
        const resultData = await (
          await this.resultHandle.getProperty("textContent")
        ).jsonValue();
        console.log("at 1, resultData is ", resultData);
        resultData.should.include("A person record was added"); //exprected text set up in app.js line 25

        //we take resultDatas which is a JSON string and select index property
        //the value of resultData will be a string like: '{"message":"A person record was added.","index":0}'
        const { index } = JSON.parse(resultData);//Parses resultData as JSON to extract the index property (index:index).
        this.lastIndex = index;
      });

      //same logic for other test cases
//line 106 is it from app.js line 17 ? 

      it("should not create a person record without an age", async function () {
        await this.nameField.type("Fred");
        //another way to clear the input:
       // await this.ageField.click();
       // await page.keyboard.press('Backspace')
      //  await page.keyboard.press('Backspace')
        await page.$eval("#age", (el) => (el.value = "")); 
        await this.addPerson.click();
        await sleep(200);
        const resultData = await(
          await this.resultHandle.getProperty("textContent")
          ).jsonValue();
          console.log("at 2, resultData is ", resultData);
          resultData.should.include("Please provide age.");
      });
      it("should return the entries just created", async function () {
          await this.listPeople.click();
          await sleep(200);
          const resultData = await(
          await this.resultHandle.getProperty("textContent")
          ).jsonValue();
          console.log("at 3, resultData is ", resultData);
          resultData.should.include("Fred");
      });
      it("should return the last entry.", async function () {
          await this.personIndex.type(`${this.lastIndex}`);
          await this.getPerson.click();
          await sleep(200);
          const resultData = await(
            await this.resultHandle.getProperty("textContent")
          ).jsonValue();
          console.log("at 4, resultData is ", resultData);
          resultData.should.include("Fred");
      });
    });
  });
})();

 