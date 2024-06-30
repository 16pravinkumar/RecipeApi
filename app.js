let bodyElement = document.body;
let searchBox = document.querySelector(".searchBoxField");
let searchBtn = document.querySelector(".button");
let recipeContainer = document.querySelector(".recipe-container");

let recipeDetailsContainer = document.querySelector(
  ".recipe-details-container"
);
let recipeCloseBtn = document.querySelector(".recipe-close-btn");

let overlay = document.querySelector(".overlay");

let fetchRecipes = async (searchValue ) => {
  try {
    recipeContainer.innerHTML = `<h2 class="whitestGrey">Fetching <span class="darkYellowColor">"recipe" </span>...</h2>`;

    console.log(searchValue);
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();

    // Clear previous results
    recipeContainer.innerHTML = "";

    let meals = data.meals;
    if (meals) {
      meals.forEach((getMeal) => {
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");
        recipeDiv.innerHTML = `
                        <img
                    src="${getMeal.strMealThumb}"
                    alt="${getMeal.strMeal}"
                  />
                  <div class="container__text">
                    <h1>${getMeal.strMeal}</h1>
                    <p>
                    ${getMeal.strInstructions.slice(0, 100)}...
                    </p>
                    <div class="container__text__timing">
                    <div class="container__text__timing_time">
                      <h2>Category</h2>
                      <p>${getMeal.strCategory}</p>
                    </div>
                    <div class="container__text__timing_time">
                      <h2>Street Area</h2>
                      <p>${getMeal.strArea}</p>
                    </div>
                    <div class="container__text__timing_time">
                      <h2>Youtube Link</h2>
                      <a class="button " href="${
                        getMeal.strYoutube
                      }" target="_blank">Watch Now</a>
                    </div>
                    </div>
                    <button class="button  btn viewRecipe">view recipe</button>
                  </div>
        `;
        recipeDiv
          .querySelector(".viewRecipe")
          .addEventListener("click", (e) => {
            e.preventDefault();
            openViewRecipePopUp(getMeal);
          });
        recipeContainer.appendChild(recipeDiv);
      });
    } else {
      recipeContainer.innerHTML = `<h2 class="whitestGrey">The <span class="darkYellowColor">"recipe" </span> you are searching is not present</h2>`;
    }
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
  }
};

let fetchIngredients = (getMeal) => {
  let ingredientList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = getMeal[`strIngredient${i}`];

    if (ingredient) {
      const measure = getMeal[`strMeasure${i}`];
      ingredientList += `
        <li>${ingredient} - ${measure}
        </li>
        `;
    } else {
      break;
    }
  }
  return ingredientList;
};

// open View Recipe
let openViewRecipePopUp = (getMeal) => {
  recipeDetailsContainer.innerHTML = `

    <h2 class="recipeName">Dish name : ${getMeal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul>${fetchIngredients(getMeal)}</ul>

    <div class="recipeInstruction">
    <h3>Instructions:</h3>
       <p >${getMeal.strInstructions}</p>

    </div>

`;
  overlay.style.display = "block";

  recipeDetailsContainer.parentElement.style.display = "block";
};

let closeViewRecipePopUp = () => {
  recipeDetailsContainer.parentElement.style.display = "none";
  overlay.style.display = "none";
};

// close View Recipe
recipeCloseBtn.addEventListener("click", () => {
  closeViewRecipePopUp();
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    closeViewRecipePopUp();
  }
});

// close View Recipe

// Trigger fetchRecipes on input event
searchBox.addEventListener("input", () => {
  let searchValue = searchBox.value.trim();
  if (searchValue.length > 0) {
    fetchRecipes(searchValue);
  } else {
    // Clear the recipe container if search box is empty
    recipeContainer.innerHTML = "";
  }
});

// Optionally, you can keep the button functionality
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let searchValue = searchBox.value.trim();
  if (searchValue !== "") fetchRecipes(searchValue);
  else
    recipeContainer.innerHTML = `<h2 class="whitestGrey">Please write the <span class="darkYellowColor">"recipe" </span> name </h2>`;
});
