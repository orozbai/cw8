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
                let instruction = drink.strInstructions;
                let alcoholic = drink.strAlcoholic;
                let category = drink.strCategory;
                let formData = new FormData();
                formData.append('category', category);
                formData.append('alcoholic', alcoholic);
                formData.append('instruction', instruction)
                formData.append('drinkName', drinkName);
                formData.append('drinkImage', drinkImage);
                formData.append('idDrink', idDrink);
                createDrink(formData);
                modalWindow(formData);
                for (const property in drink) {
                    if (property.startsWith("strIngredient")) {
                        const value = drink[property];
                        if (value !== null) {
                            formData.append(property, value);
                        }
                    }
                }
                for (const property in drink) {
                    if (property.startsWith("strMeasure")) {
                        const value = drink[property];
                        if (value !== null) {
                            formData.append(property, value);
                        }
                    }
                }
                createIngredients(formData);
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
    img.setAttribute("onclick", "modalOpen(" + formData.get('idDrink') + ")");

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardBody.setAttribute("onclick", "modalOpen(" + formData.get('idDrink') + ")");

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

function modalOpen(id) {
    let modal = document.getElementById(id);
    modal.style.display = 'block';
}

function modalClose(id) {
    let modal = document.getElementById(id);
    modal.style.display = 'none';
}

function modalWindow(formData) {
    const modalDialog = document.createElement('div');
    modalDialog.classList.add('modal');
    modalDialog.id = formData.get('idDrink');

    const modal = document.createElement('div');
    modal.classList.add('modal-content');
    modalDialog.appendChild(modal);

    const closeSpan = document.createElement('span');
    closeSpan.textContent = 'Ingredients';
    closeSpan.setAttribute("onclick", "modalClose(" + formData.get('idDrink') + ")");
    closeSpan.classList.add('close');

    const br = document.createElement('hr');
    modalDialog.appendChild(br);

    const closeText = document.createElement('p');
    closeText.textContent = 'Close';
    closeText.classList.add('close-modal');
    closeText.setAttribute("onclick", "modalClose(" + formData.get('idDrink') + ")");
    modal.appendChild(closeSpan);

    const text = document.createElement('div');
    text.classList.add('card-information');
    text.id = 'ingredient' + formData.get('idDrink');
    const alcoholic = document.createElement('p');
    alcoholic.textContent = 'alcoholic: ' + formData.get('alcoholic');
    text.appendChild(alcoholic);
    const category = document.createElement('p');
    category.textContent = 'category: ' + formData.get('category');
    text.appendChild(category);
    modal.appendChild(text);
    modal.appendChild(closeText);

    let container = document.getElementById('container');
    container.appendChild(modalDialog);
}

async function createIngredients(formData) {
    const ingredients = [];
    for (const [key, value] of formData.entries()) {
        if (key.startsWith('strIngredient') && value !== '') {
            ingredients.push(value);
        }
    }
    const measure = [];
    for (const [key, value] of formData.entries()) {
        if (key.startsWith('strMeasure') && value !== '') {
            measure.push(value);
        }
    }
    const maxLength = Math.max(ingredients.length, measure.length)
    for (let i = 0; i < maxLength; i++) {
        let ingredientName = ingredients[i];
        let measureName = measure[i];
        let div = document.getElementById('ingredient' + formData.get('idDrink'));
        const divElem = document.createElement('div')
        divElem.classList.add('card-body-elem');
        const img = document.createElement('img');
        img.src = 'https://www.thecocktaildb.com/images/ingredients/' + ingredientName + '-Small.png';
        img.alt = 'ingredient image';
        divElem.appendChild(img);
        const text = document.createElement('p');
        text.textContent = ingredientName + " ( " + measureName + " )";
        divElem.appendChild(text);
        div.appendChild(divElem);
    }
}

document.getElementById('search-form-ingredients').addEventListener('submit', async function () {
    let inputIng = document.getElementById('search-ingredients')
    await fetch('www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + inputIng)
        .then(respon => respon.json()).then(data => {
            console.log(data)
                for (let i = 0; i < data.ingredients.length; i++) {
                    let ing = data.ingredients[i];
                    let id = ing.idIngredient;
                    let ingredientName = ing.strIngredient;
                    let description = ing.strDescription;
                    let strType = ing.strType;
                    let strAlcohol = ing.strAlcohol;
                    let strABV = ing.strABV;
                    const newFormData = new FormData();
                    newFormData.append('id', id);
                    newFormData.append('ingredient', ingredientName);
                    newFormData.append('description', description);
                    newFormData.append('type', strType);
                    newFormData.append('alcohol', strAlcohol);
                    newFormData.append('abv', strABV);
                    createModal(newFormData);
                    console.log(newFormData);
                }
            }
        )
})

function createModal(formData) {
    const modalDialog = document.createElement('div');
    modalDialog.classList.add('modal-ingredient');
    modalDialog.id = formData.get('id');

    const modal = document.createElement('div');
    modal.classList.add('modal-content-ingredient');
    const img = document.createElement('img');
    img.src = 'www.thecocktaildb.com/images/ingredients/' + formData.get('ingredient') + '-Small.png'
    img.alt = 'name image';
    modal.appendChild(img);
    const desc = document.createElement('p');
    desc.textContent = formData.get('description');
    modal.appendChild(desc);
    const type = document.createElement('p');
    type.textContent = formData.get('type');
    modal.appendChild(type);
    const alcohol = document.createElement('p');
    alcohol.textContent = formData.get('alcohol');
    modal.appendChild(alcohol);
    modalDialog.appendChild(modal);

    const getId = document.getElementById('ingredients-container');
    getId.appendChild(modalDialog);
}