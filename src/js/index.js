/* ES6 : Modules
import str from './models/Search'; // default
import {add, sub, val} from './views/searchView'; // named
// import {add as a, sub as s, val as v} from './views/searchView';
// import * as search from './views/searchView';
console.log(`Using Exports : ${str} as default and ${add(val, 8)} and ${sub(val, 8)} and ${val} as named exports.`)
*/


/* --- App Controller --- */
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

import { elements, renderLoader, clearLoader } from './views/base';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';


/* Global State */
const state = {}; // for Search, Recipe, List, Likes


/* SEARCH Control */
const searchControl = async () => {
	// Get Input from the UI
	const inputQ = searchView.getInput();

	if (inputQ) {
		// Create a new Search obj
		state.search = new Search(inputQ);

		// Clear UI items for results
		searchView.clearInp();
		searchView.clearRes();
		renderLoader(elements.searchResults);

		try {
			// Search for Recipe using AJAX
			await state.search.getResults(); // returns promise
			clearLoader();
			searchView.renderRes(state.search.results);
		} catch (error) {
			console.error('API Error Occurred!', error);
			clearLoader();
			alert('No results found.');
		}
	}
}


/* RECIPE Control */
const recipeControl = async () => {
	// Get Recipe ID
	const id = recipeView.getHash();

	if (id) {
		// Prepare UI for Recipe
		recipeView.clearRecipe();
		renderLoader(elements.recipe);

		// Highlight selected recipe
		if (state.search) {
			searchView.highlight(id);
		}

		// Init Recipe Object
		state.recipe = new Recipe(id);

		// Recipe data from API
		try {
			await state.recipe.getRecipe();
			state.recipe.parseIngred();

			// Calc timing/serving
			state.recipe.calcTiming();
			state.recipe.calcServing();

			// Render recipe on UI
			clearLoader();
			recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

		} catch (error) {
			console.error('API Error Occurred!', error);
			alert('No recipe found.');
		}
	}
}


/* LIST Control */
const listControl = () => {
	// case : list doesn't exist
	if (!state.list) state.list = new List();

	// case : list already exists
	state.recipe.ingredients.forEach(el => {
		// add items(ingred) to the list
		const item = state.list.addItem(el.count, el.unit, el.ingredient);

		// render the list-items on UI
		listView.renderItem(item);
	});
};


/* LIKE Control */
const likeControl = () => {
	if (!state.likes) state.likes = new Likes();

	const currId = state.recipe.id;

	// check if recipe is liked
	if (!state.likes.isLiked(currId)) {
		// add the like
		const newLike = state.likes.addLike(
			currId, state.recipe.title, state.recipe.author, state.recipe.image
		);

		// toggle like button
		likesView.toggleLikeBtn(true);

		// add like on UI
		likesView.renderLike(newLike);

	} else {
		// del the like
		state.likes.deleteLike(currId);

		// toggle like button
		likesView.toggleLikeBtn(false);

		// del like from UI
		likesView.deleteLike(currId);

	}
	likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// Event Listeners
elements.searchForm.addEventListener('submit', e => {
	e.preventDefault();
	searchControl();
});

elements.searchPages.addEventListener('click', e => {
	const btn = e.target.closest('.btn-inline'); // returns closest elem w. spec class
	if (btn) {
		const goToPage = parseInt(btn.dataset.goto, 10); // parse page as Int to base 10
		searchView.clearRes(); // clear results for goto page
		searchView.renderRes(state.search.results, goToPage); // render results per page
	}
});

// Event Listeners for multiple events w. single fx
['load', 'hashchange'].forEach(event => window.addEventListener(event, recipeControl));

elements.recipe.addEventListener('click', e => {
	// Update Servings
	if (e.target.matches('.btn-decrease, .btn-decrease *')) {

		// decrease the serving
		if (state.recipe.servings > 1) {
			state.recipe.updateServings('dec');
			recipeView.updateIngred(state.recipe);

		}
	} else if (e.target.matches('.btn-increase, .btn-increase *')) {
		// increase the serving
		state.recipe.updateServings('inc');
		recipeView.updateIngred(state.recipe);

	} else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
		// add to shop-list
		listControl();

	} else if (e.target.matches('.recipe__love, .recipe__love *')) {
		// add/del like
		likeControl();

	}
});

elements.shopList.addEventListener('click', e => {
	const id = e.target.closest('.shopping__item').dataset.itemid;

	// delete item
	if (e.target.matches('.shopping__delete, .shopping__delete *')) {
		state.list.deleteItem(id); // from list
		listView.deleteItem(id); // from UI
	}

	// update count
	if (e.target.matches('.shopping__count-value')) {
		const val = parseFloat(e.target.value, 10);

		if (val > 0) {
			// val exists -> update
			state.list.updateCount(id, val);

		} else if (val === 0) {
			// val equals 0 -> delete
			state.list.deleteItem(id); // from list
			listView.deleteItem(id); // from UI

		}
	}
});

window.addEventListener('load', () => {
	// page on load events
	state.likes = new Likes();
	state.likes.readStorage(); // add likes from storage

	likesView.toggleLikeMenu(state.likes.getNumLikes()); // toggle like menu

	state.likes.likes.forEach(like => likesView.renderLike(like)); // render likes

});


/* State Access (for Testing) */
// window.state = state;