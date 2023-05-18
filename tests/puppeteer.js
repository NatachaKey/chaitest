const puppeteer = require("puppeteer"); //headless (?)browser use
require("dotenv").config();
const chai = require("chai"); //assertions
const { server } = require("../app"); // what we test

// Sleep function to introduce delays in asynchronous operations
//to be sure- why do we need it? to wait until the previous test is executed?
//creates a promise that is executed 1 time in time we specify later- 2s on line 79
//in the time of execution is more than 200ms- it appears in red  for example(259ms)
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//nables the Chai assertion style that allows to use natural language assertions
chai.should();

//immediately invoked async function expression to encapsulate test login 
//what does encapsulation mean? are we "closing the fn until it is done?"
(async () => {
  //here we are grouping related tests together by the title of Functional Tests..
  describe("Functional Tests with Puppeteer", function () {
    let browser = null;
    let page = null;

    // Before hook to set up the browser and page before the tests are executed
    before(async function () {
      this.timeout(5000);// before fn should be completed in 5 seconds?
      browser = await puppeteer.launch();
      page = await browser.newPage(); //create new page 
      await page.goto("http://localhost:3000"); //navigato to localhost
    });

     // After hook to close the browser and server after the tests finish
    after(async function () {
      this.timeout(5000); //in 5 s
      await browser.close(); //close browser
      server.close(); //stop server
      return;
    });

 // Test case for checking the connection to the site


 //How does this code checks the connection to a browser? there is no login inside, why does 'done' is passed as an argumento to the fn?
    describe("got to site", function () {
      it("should have completed a connection", function (done) {
        done();
      });
    });

     // Test suite for the people form
    describe("people form", function () {
      this.timeout(5000); // do we set time to see if it´s running fast and is ok for the user??
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
        await sleep(200); // async fn is expected to be completed in 2s
        const resultData = await (
          await this.resultHandle.getProperty("textContent")
        ).jsonValue();
        console.log("at 1, resultData is ", resultData);
        resultData.should.include("A person record was added"); //exprected text set up in app.js line 25
        //how do these two lines work?
        //we take resultDatas which is a JSON string and select ondex property
        //why is it between curly brackets?{}
        const { index } = JSON.parse(resultData);//Parses resultData as JSON to extract the index property.
        this.lastIndex = index;
      });

      //same logic for other test cases
//line 102 is it from app.js line 17 ? 
// await page.$eval("#age", (el) => (el.value = "")); 
      it("should not create a person record without an age", async function () {
        await this.nameField.type("Fred");
       // WRONG- DELETE THIS LINE , BUT WHY IT IS NOT WORKING IF WE PASS AN EMPTY STRING? await this.ageField.type("");
        await page.$eval("#age", (el) => (el.value = "")); 
        await this.addPerson.click();
        await sleep(200);
        //why do we have two await here? I don´t get how do we get Please provide age from resultHandle?
        //does this line mean just a json string that we get as a result?
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


//I just passed all the tests without adding code to puppeteer.js -  do we need them both?
//it seems like mocha chai are testing on backend and puppeteer (using mocha chai) on frontend(clicks, input events that user can create)?
//is that right? 