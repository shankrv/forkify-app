/* classNames for DOM elements */

export const elements = {
	searchForm: document.querySelector('.search'),
	searchInput: document.querySelector('.search__field'),
	searchResults: document.querySelector('.results'),
	searchList: document.querySelector('.results__list'),
	searchPages: document.querySelector('.results__pages'),
	recipe: document.querySelector('.recipe'),
	shopList: document.querySelector('.shopping__list'),
	likeMenu: document.querySelector('.likes__field'),
	likeList: document.querySelector('.likes__list')
};


// Elem Strings for non-exist classes
const elemStr = {
	loader: 'loader' // spin-loader
};


// Render Loader
export const renderLoader = parent => {
	const loader = `
	<div class='${elemStr.loader}'>
		<svg>
			<use href='img/icons.svg#icon-cw'></use>
		</svg>
	</div>
	`;
	parent.insertAdjacentHTML('afterbegin', loader);
};


// Clear Loader
export const clearLoader = () => {
	const loader = document.querySelector(`.${elemStr.loader}`);
	if (loader) loader.parentElement.removeChild(loader);
};