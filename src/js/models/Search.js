/* default export
export default 'exported from Search Model'
*/


/* --- Search Model --- */
import axios from 'axios';
import { response } from './apiRes'

export default class Search {
	constructor(query) {
		this.query = query
	}

	// AJAX call for Search Results
	async getResults() {
		// axios - returns JSON as promise
		try {
			const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
			this.results = res.data.recipes;
			// this.results = response.recipes; // JSON data for dev
		} catch (error) {
			console.error('AJAX error occurred.', error);
		}
	}
}