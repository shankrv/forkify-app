/* --- Recipe View --- */
import { elements } from './base';
import { Fraction } from 'fractional';

// Get ID from URL
export const getHash = () => window.location.hash.replace('#', '');
export const clearRecipe = () => elements.recipe.innerHTML = '';

// Format Count
const frmtCount = count => {
	if (count) {
		const limCount = Math.round(count * 10) / 10; // for 2 digit fractions

		// segregate int and dec
		const [int, dec] = limCount.toString().split('.').map(el => parseInt(el, 10)); // ret arr of Int (destr)

		// no decimal value
		if (!dec) return limCount;

		// count : 0.1 - 0.9
		if (int === 0) {
			const fr = new Fraction(limCount); // using fractional
			return `${fr.numerator}/${fr.denominator}`;

		} else {
			// count : 1.1 onwards
			const fr = new Fraction(limCount - int); // using fractional
			return `${int} ${fr.numerator}/${fr.denominator}`;
		}
	}
	return '?'
};

// Create Ingredient
const createIngred = ingredient =>
	`<li class="recipe__item">
			<svg class="recipe__icon">
					<use href="img/icons.svg#icon-check"></use>
			</svg>
			<div class="recipe__count">${frmtCount(ingredient.count)}</div>
			<div class="recipe__ingredient">
					<span class="recipe__unit">${ingredient.unit}</span>
					${ingredient.ingredient}
			</div>
	</li>
`;

// Render the recipe
export const renderRecipe = (recipe, isLiked) => {
	const markup = `
		<figure class="recipe__fig">
				<img src="${recipe.image}" alt="${recipe.title}" class="recipe__img">
				<h1 class="recipe__title">
						<span>${recipe.title}</span>
				</h1>
		</figure>
		<div class="recipe__details">
				<div class="recipe__info">
						<svg class="recipe__info-icon">
								<use href="img/icons.svg#icon-stopwatch"></use>
						</svg>
						<span class="recipe__info-data recipe__info-data--minutes">${recipe.timings}</span>
						<span class="recipe__info-text"> minutes</span>
				</div>
				<div class="recipe__info">
						<svg class="recipe__info-icon">
								<use href="img/icons.svg#icon-man"></use>
						</svg>
						<span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
						<span class="recipe__info-text"> servings</span>

						<div class="recipe__info-buttons">
								<button class="btn-tiny btn-decrease">
										<svg>
												<use href="img/icons.svg#icon-circle-with-minus"></use>
										</svg>
								</button>
								<button class="btn-tiny btn-increase">
										<svg>
												<use href="img/icons.svg#icon-circle-with-plus"></use>
										</svg>
								</button>
						</div>

				</div>
				<button class="recipe__love">
						<svg class="header__likes">
								<use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
						</svg>
				</button>
		</div>

		<div class="recipe__ingredients">
				<ul class="recipe__ingredient-list">
					${recipe.ingredients.map(ingred => createIngred(ingred)).join('')}
				</ul>

				<button class="btn-small recipe__btn recipe__btn-add">
						<svg class="search__icon">
								<use href="img/icons.svg#icon-shopping-cart"></use>
						</svg>
						<span>Add to shopping list</span>
				</button>
		</div>

		<div class="recipe__directions">
				<h2 class="heading-2">How to cook it</h2>
				<p class="recipe__directions-text">
						This recipe was carefully designed and tested by
						<span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
				</p>
				<a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
						<span>Directions</span>
						<svg class="search__icon">
								<use href="img/icons.svg#icon-triangle-right"></use>
						</svg>
				</a>
		</div>
	`;

	elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

// Update Servings and Ingredients
export const updateIngred = recipe => {
	// Update Serves
	document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

	// Update Ingred
	const arrCount = Array.from(document.querySelectorAll('.recipe__count'));
	arrCount.forEach((el, i) => {
		el.textContent = frmtCount(recipe.ingredients[i].count);
	});
};