/* --- Recipe Model --- */

import axios from 'axios';

export default class Recipe {
	constructor(id) {
		this.id = id;
	}

	async getRecipe() {
		try {
			const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
			this.title = res.data.recipe.title;
			this.author = res.data.recipe.publisher;
			this.image = res.data.recipe.image_url;
			this.url = res.data.recipe.source_url;
			this.ingredients = res.data.recipe.ingredients;
		} catch (error) {
			console.error('AJAX error occurred.', error);
		}
	}

	calcTiming() {
		// assume 3 ingred takes 15 mins
		const numIng = this.ingredients.length;
		const period = Math.ceil(numIng / 3);
		this.timings = period * 15;
	}

	calcServing() {
		this.servings = 4; // set value
	}

	parseIngred() {
		const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
		const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

		const newIngred = this.ingredients.map(elem => {
			// Maintain uniform units
			let ingredient = elem.toLowerCase();
			unitsLong.forEach((unit, i) => {
				ingredient = ingredient.replace(unit, unitShort[i]);
			});

			// Remove the parentheses
			ingredient = ingredient.replace(/ *\([^)]*\) */g, ' '); // using RegEx for parentheses

			// Parse count, unit, ingredient
			const arrIngred = ingredient.split(' ');
			const unitIndex = arrIngred.findIndex(el => unitShort.includes(el)); // includes ret T/F & findIndex ret 0/-1

			let objIngred; // for uniform obj
			if (unitIndex > -1) {
				// unit exists
				const arrCount = arrIngred.slice(0, unitIndex);

				let count; // for both cases of 1 and 2 elem
				if (arrCount.length === 1) {
					count = eval(arrIngred[0].replace('-', '+')); // replaces the string
				} else {
					count = eval(arrIngred.slice(0, unitIndex).join('+')); // evaluates the string
				}

				objIngred = {
					count,
					unit: arrIngred[unitIndex],
					ingredient: arrIngred.slice(unitIndex + 1).join(' ')
				};

			} else if (parseInt(arrIngred[0], 10)) {
				// unit doesn't exist bt count exists
				objIngred = {
					count: parseInt(arrIngred[0], 10),
					unit: '',
					ingredient: arrIngred.slice(1).join(' ') // remove 1st elem and join the arr
				}

			} else if (unitIndex === -1) {
				// unit and count both doesn't exist
				objIngred = {
					count: 1,
					unit: '',
					ingredient // default value
				}
			}

			ingredient = objIngred;
			return ingredient;
		});
		this.ingredients = newIngred;
	}

	updateServings(type) {
		// Update Serves
		const newServing = type === 'dec' ? this.servings - 1 : this.servings + 1;

		// Update Ingred
		this.ingredients.forEach(ing => {
			ing.count *= (newServing / this.servings);
		});

		this.servings = newServing;
	}
}