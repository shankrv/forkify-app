/* --- Likes View --- */
import { elements } from './base';
import { limRecipe } from './searchView';

// toggle like button
export const toggleLikeBtn = isLiked => {
	// href="img/icons.svg#icon-heart-outlined"
	const iconStr = isLiked ? 'icon-heart' : 'icon-heart-outlined';
	document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconStr}`);
};

// toggle like menu
export const toggleLikeMenu = numLikes => {
	elements.likeMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

// render like
export const renderLike = like => {
	const markup = `
		<li>
			<a class="likes__link" href="#${like.id}">
				<figure class="likes__fig">
					<img src="${like.image}" alt="${like.title}">
				</figure>
				<div class="likes__data">
					<h4 class="likes__name">${limRecipe(like.title)}</h4>
					<p class="likes__author">${like.author}</p>
				</div>
			</a>
		</li>
	`;

	elements.likeList.insertAdjacentHTML('beforeend', markup);
};

// delete like
export const deleteLike = id => {
	const elem = document.querySelector(`.likes__link[href='#${id}']`).parentElement; // selects the list-iten
	if (elem) elem.parentElement.removeChild(elem);
};