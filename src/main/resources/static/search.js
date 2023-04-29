'use strict'

document.getElementById('search-form-cocktail').onsubmit = async (e) => {
    e.preventDefault();
    let searchCocktail = document.getElementById('search-cocktail').value;
    await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + searchCocktail)
        .then(response => response.json().then(data => {
            for (let i = 0; i < data.drinks.length; i++) {
                let drink = data.drinks[i];
                let drinkName = drink.strDrink;
                let drinkImage = drink.strDrinkThumb;
                let idDrink = drink.idDrink;
                let formData = new FormData();
                formData.append('drinkName', drinkName);
                formData.append('drinkImage', drinkImage);
                formData.append('idDrink', idDrink);
                createDrink(formData);
            }
        }))
}

function createDrink(formData) {
    const div = document.createElement('div');
    div.classList.add('col', 'mb-4');

    const card = document.createElement('div');
    card.classList.add('card', 'h-100');

    const img = document.createElement('img');
    img.classList.add('card-img-top');
    img.setAttribute('src', formData.get('drinkImage'));
    img.setAttribute('alt', 'drinkImage');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardBody.setAttribute("onclick", "modalWindow('" + formData.get('idDrink') + "')");

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = formData.get('drinkName');

    cardBody.appendChild(cardTitle);
    card.appendChild(img);
    card.appendChild(cardBody);
    div.appendChild(card);

    const container = document.getElementById('cocktail-container');
    container.appendChild(div);
}