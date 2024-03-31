const searchForm = document.querySelector(".search");
const favoriteList = document.querySelector(".favorite__list");
const inputForm = searchForm.querySelector(".search__input");
const suggestionForm = searchForm.querySelector(".search__suggestions");

function debounce(callee, timeoutMs) {
  return function perform(...args) {
    let previousCall = this.lastCall;
    this.lastCall = Date.now();

    if (previousCall && this.lastCall - previousCall <= timeoutMs) {
      clearTimeout(this.lastCallTimer);
    }
    this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
  };
}

function createFavorite(value) {
  let favourite = document.createElement("div");
  let deleteButton = document.createElement("button");
  let name = document.createElement("p");
  let stars = document.createElement("p");
  let host = document.createElement("p");

  name.textContent = value.name;
  name.classList.add("favorite__name");

  host.textContent = value.owner.login;
  host.classList.add("favorite__host");

  stars.textContent = `${value.stargazers_count} Stars`;
  stars.classList.add("favorite__stars");

  deleteButton.textContent = "X";
  deleteButton.classList.add("favorite__delete");
  favourite.classList.add("favorite__item");

  deleteButton.addEventListener("click", () => {
    favourite.remove();
  })

  favourite.append(name, deleteButton, host, stars);
  favoriteList.append(favourite);
}

function createSuggestion(value) {
  value.forEach((value) => {
    let suggestion = document.createElement("button");
    suggestion.classList.add("search__suggestion");
    suggestion.textContent = value.name;
    suggestionForm.append(suggestion);
    console.log(value);
    suggestion.addEventListener("click", () => {
      addFavorite(value)
    })
  });
  
}

function addFavorite(value) {

  suggestionForm.innerHTML = "";
  inputForm.value = "";

  createFavorite(value);
}

async function getData(event) {
  try {
    if (!event.target.value.trim()) {
      suggestionForm.innerHTML = "";
      return;
    }
    const request = await fetch(
      `https://api.github.com/search/repositories?q=${event.target.value}`
    );
    const suggestions = document.querySelectorAll(".search__suggestion");
    suggestions.forEach((suggestion) => suggestion.remove());
    const answer = await request.json();
    const topFive = answer.items.slice(0, 5);
    createSuggestion(topFive);
  }
  catch (error) {
    alert(error);
  }
}

const getDataDebounced = debounce(getData, 500);

inputForm.addEventListener("input", (event) => {
  getDataDebounced(event);
});

