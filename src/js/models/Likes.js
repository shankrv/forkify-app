/* --- Likes Model --- */

export default class Likes {
	constructor() {
		this.likes = []; // to add likes
	}

	// add a like
	addLike(id, title, author, image) {
		const like = {
			id, title, author, image
		}
		this.likes.push(like); // add like to arr
		this.persistData();

		return like;
	}

	// delete a like
	deleteLike(id) {
		const index = this.likes.findIndex(el => el.id === id); // index of like
		this.likes.splice(index, 1); // mutates the orig arr
		this.persistData();
	}

	// check like
	isLiked(id) {
		return this.likes.findIndex(el => el.id === id) !== -1; // returns boolean
	}

	// num of likes
	getNumLikes() {
		return this.likes.length;
	}

	// persist data
	persistData() {
		localStorage.setItem('likes', JSON.stringify(this.likes)); // store in localStorage | JSON -> Str
	}

	// read storage
	readStorage() {
		const storage = JSON.parse(localStorage.getItem('likes')); // read from localStorage | Str -> JSON
		if (storage) this.likes = storage;
	}
}