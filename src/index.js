let dogList = [];
let dogButton = [];
let dogFilter = false;
//Event Listeners
document.addEventListener('DOMContentLoaded', event => {
    fetchDogs();
    let dogFilterButton = document.getElementById('good-dog-filter');
    dogFilterButton.addEventListener('click', event => {
        filterDogList(event);
    });
});
//Functions
function fetchDogs() {
    fetch('http://localhost:3000/pups')
    .then (response => response.json())
    .then (json => {
        dogList = json;
        displayDogs(dogList)
    });
}
function displayDogs(dogList) {
    let dogBar = document.getElementById('dog-bar');
    dogBar.innerHTML = '';
    dogList.forEach(dog => {
        if (dogFilter) {
            if (dog.isGoodDog) {
            dogBar.appendChild(createDogCard(dog));
            }
        } else {
            dogBar.appendChild(createDogCard(dog));
        }
    })
    dogButton = document.querySelectorAll('.dog-button');
    dogButton.forEach(item => {
        item.addEventListener('click', event => showDog(event.target.innerText));
    });
}
function showDog(aDog) {
    clearDog();
    const newDog = dogList.find(f => f.name === aDog);
    let showDogName = document.createElement('h2');
    showDogName.innerText = newDog.name;
    let showDogImg = document.createElement('img');
    showDogImg.src = newDog.image;
    let showDogBtn = document.createElement('button');
    showDogBtn.innerText = newDog.isGoodDog;
    showDogBtn.className = 'good-dog-btn';
    showDogBtn.id = `dog-${newDog.id}`;
    let dogInfo = document.getElementById('dog-info');
    dogInfo.appendChild(showDogImg);
    dogInfo.appendChild(showDogName);
    dogInfo.appendChild(showDogBtn);
    showDogBtn.addEventListener('click', event => {
        let dogInfoId = event.target.id.split('-');
        let dogId = parseInt(dogInfoId[1]);
        let dogBtnText = event.target.innerText;
        if (dogBtnText === 'true') {
            dogBtnText = false;
        } else {
            dogBtnText = true;
        }
        fetch(`http://localhost:3000/pups/${dogId}`,{
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "isGoodDog": dogBtnText
            })
        })
        .then(response => response.json())
        .then(json => {
            showDogBtn.innerText = json.isGoodDog;
            fetchDogs();
        });
    });
}
function clearDog() {
    const dogContainer = document.getElementById('dog-info');
    dogContainer.innerHTML = '';
}
function clearDogBar() {
    const dogBar = document.getElementById('dog-bar');
    dogBar.innerHTML = '';
}
function createDogCard(dog) {
    const newDog = document.createElement('span');
    newDog.innerText = dog.name;
    newDog.className = 'dog-button';
    return(newDog);
}
function filterDogList(event) {
    if (!dogFilter) {
    event.target.innerText = 'Filter good dogs: ON';
    dogFilter = true;
    } else {
        event.target.innerText = 'Filter good dogs: OFF';
        dogFilter = false;
    }
    displayDogs(dogList);
}