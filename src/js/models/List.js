/* --- List Model --- */
import uniqid from 'uniqid';

export default class List {
	constructor() {
		this.items = []; // to be added in the list
	}

	// add an item
	addItem(count, unit, ingred) {
		const item = {
			id: uniqid(), // unique
			count, unit, ingred
		}
		this.items.push(item);
		return item;
	}

	// delete an item
	deleteItem(id) {
		const index = this.items.findIndex(el => el.id === id); // index of item
		this.items.splice(index, 1); // mutates the orig arr
	}

	// update the count
	updateCount(id, newCount) {
		this.items.find(el => el.id === id).count = newCount;
	}
}