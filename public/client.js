document.addEventListener("DOMContentLoaded", () => {
  const addPerson = document.getElementById("addPerson");
  const getPerson = document.getElementById("getPerson");
  const listPeople = document.getElementById("listPeople");
  const name = document.getElementById("name");
  const age = document.getElementById("age");
  const index = document.getElementById("index");
  const result = document.getElementById("result");
  
  addPerson.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/v1/people", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.value, age: Number(age.value) }),
      });
      const data = await response.json();
      result.textContent = JSON.stringify(data);
    } catch (err) {
      result.textContent = err.message;
    }
  });

  listPeople.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/v1/people", {
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      result.textContent = JSON.stringify(data);
    } catch (err) {
      result.textContent = err.message;
    }
  });
  getPerson.addEventListener("click", async (event) => {
    event.preventDefault();
    // this line means that we are encoding index.value and assign it to a index1 variable to use it later (so it can be compatible with URLs, databases etc..)
    const index1 = encodeURIComponent(index.value);
// it's a good practice to encode the value if it's something a user is arbitrarily giving you, before you use it in a URL. 
// The encodeURIComponent function will replace any characters that are not compatible with URLs with an "escaped" verison of that character that is compatible with URLs.
// So any booleans and numbers will become strings. Any values that mean something else in a URL, like colons (:, usually used to separate the hostname from the port), slashes (/, usually used to separate paths in a URL), etc will be converted into their "URL-encoded" format. So : becomes %3A and / becomes %2F, and the boolean true becomes the string "true" and the number 123 becomes a string "123".
    console.log("index 1 is ", index1);
    try {
      const response = await fetch(`/api/v1/people/${index1}`, {
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      result.textContent = JSON.stringify(data);
    } catch (err) {
      result.textContent = err.message;
    }
  });
});

// If the entry is created, a JSON document with a message saying that "A person entry was added" is returnedalong with the index of the entry just added. 
//To retrieve the array, the front end does a get request to the URI /api/v1/people, and a JSON document containing the array is returned.
//To retrieve a single entry, the front end does a get request to /api/v1/people/:id , where the :id is the index of the entry to be retrieved.
//A JSON document with the entry is returned, unless the index is out of range, in which case an error message and a 404 result code is returned.

//routes for each of these operations have not been implemented.