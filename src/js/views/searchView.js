/* named exports
export const add = (a, b) => a + b; 
export const sub = (a, b) => a - b;
export const val = 10;
*/


/* --- Search View --- */
import { elements } from './base'

export const getInput = () => elements.searchInput.value;

export const clearInp = () => elements.searchInput.value = '';
export const clearRes = () => {
	elements.searchList.innerHTML = '';
	elements.searchPages.innerHTML = '';
};

// Highlight Selected
export const highlight = id => {
	// remove highlight
	const arrRes = Array.from(document.querySelectorAll('.results__link'));
	arrRes.forEach(elem => elem.classList.remove('results__link--active'));

	// highlight select
	document.querySelector(`.results__link[href='#${id}']`).classList.add('results__link--active');
};

// Limit Recipe Title
export const limRecipe = (title, lim = 18) => {
	const newTitle = [];
	if (title.length > lim) {
		title.split(' ').reduce((acc, cur) => {
			if (acc + cur.length <= lim) {
				newTitle.push(cur);
				return acc + cur.length; // to update the acc
			}
		}, 0);
		return (`${newTitle.join(' ')} ...`);
	}
	return title;
};


// Render Recipe
const renderRecipe = recipe => {
	const markup = `
	<li>
		<a class="results__link" href="#${recipe.recipe_id}">
				<figure class="results__fig">
						<img src="${recipe.image_url}" alt="${recipe.title}">
				</figure>
				<div class="results__data">
						<h4 class="results__name">${limRecipe(recipe.title)}</h4>
						<p class="results__author">${recipe.publisher}</p>
				</div>
		</a>
	</li>
	`;
	elements.searchList.insertAdjacentHTML('beforeend', markup);
};


// Render buttons
const createBtns = (page, type) => `
	<button class="btn-inline results__btn--${type}" data-goto='${type === 'prev' ? page - 1 : page + 1}'>
		<span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
		<svg class="search__icon">
			<use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
		</svg>
	</button>
`;

const renderBtns = (page, numRes, perPage) => {
	const pages = Math.ceil(numRes / perPage);

	let button = '';
	if (page === 1 && pages > 1) {
		// Next Button
		button = createBtns(page, 'next');
	} else if (page < pages) {
		// Both Buttons
		button = `
			${createBtns(page, 'prev')}
			${createBtns(page, 'next')}
		`;
	} else if (page === pages && pages > 1) {
		// Prev Button
		button = createBtns(page, 'prev');
	}
	elements.searchPages.insertAdjacentHTML('afterbegin', button);
};


// Render Recipes w/. Pagination
export const renderRes = (recipes, page = 1, resPerPage = 10) => {
	// decl var for arr slice
	const start = (page - 1) * resPerPage;
	const limit = page * resPerPage;
	recipes.slice(start, limit).forEach(renderRecipe); // slice res per page
	renderBtns(page, recipes.length, resPerPage);
};