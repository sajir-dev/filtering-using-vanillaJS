const cars = [  {id: 101, type:"Fiat", model:"500", color:"white"},
                {id: 102, type:"Suzuki", model:"600", color:"white"},   
                {id: 103, type:"Tata", model:"800", color:"black"},
                {id: 104, type:"Tata", model:"800", color:"black"},
                {id: 105, type:"Fiat", model:"600", color:"red"},
                {id: 106, type:"GM", model:"500", color:"red"}]

const container = document.querySelector(".container");
const dropDownItems = document.querySelectorAll(".dropdown-item");
const dropdown = document.querySelectorAll(".dropdown");
const dropDownArray = Array.from(dropDownItems);
const carsDiv = document.querySelector(".cars");

// updates UI when user clicks a filter
function updateUI (carsArr) {
    let displayCars = "";
    carsArr.forEach(car => {
        displayCars += `<p>Maker : ${car.type}<br>
        Model : ${car.model}<br>
        Color: ${car.color}</p>`;
    });
    carsDiv.innerHTML = displayCars;
}

// The filters are hardcoded to as in the collection to match the filters provided. The key of filter object is getting copied from HTML is getting copied from button text of the HTML
function generateFilterDOM() {
    const filters = ["GM", "Suzuki", "Tata", "Fiat", "500", "600", "800", "white","black", "red"];
    const specificFilters = [];
    let start = 0;
    for (let i = 0; i < dropdown.length; i++) {
        let end = start + dropdown[i].childNodes[3].children.length;
        let currentFilter = []
        for (let j = start; j<end; j++) {
            // console.log("j", j);
            if (dropDownArray[j].firstElementChild.checked) {
                currentFilter.push({[`${dropdown[i].childNodes[1].innerText}`]: filters[j]});
            }
        }
        start = end;
        specificFilters.push(currentFilter);
    }
    return specificFilters;
}

// Filtering function: Combination of parallel filtering and series filtering 
function Filtering (cars, filtersArr) {
    let filtered = [];
    for (let i = 0; i < filtersArr.length; i++) {
        if (filtersArr[i].length === 0) {
            filtered[i] = cars;
            continue;
        } else {
            for (let j = 0; j < filtersArr[i].length; j++) {
                let filteredBySingleFilter = singleFilter(filtersArr[i][j], cars);
                if (!filtered[i]) {
                    filtered[i]= filteredBySingleFilter;
                } else {
                    filtered[i].splice(filtered[i].length, filteredBySingleFilter.length, ...filteredBySingleFilter);
                }
            }
            filtered[i] = removeDuplicate(filtered[i]);
        }
    }

    let intersection1 = intersection(filtered[0], filtered[1]);
    let result = intersection(intersection1, filtered[2]);
    return result;
}

function singleFilter (filterObj, ItemsArr) {
    let filtered;
    for (let key in filterObj) {
        filtered = ItemsArr.filter(item =>
                filterObj[key] === item[key]
            );
    }
    return filtered;
}

function removeDuplicate (arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i+1 ; j < arr.length; j++) {
            if (arr[i].id === arr[j].id) {
                arr.splice(j,1);
                j = i;
            }
        }
    }
    return arr;
}

function intersection (a, b) {
    const arr = [...a, ...b]
    let intersection = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i].id === arr[j].id) {
                intersection.push(arr[i])
            }
        }
    }
    return intersection;
}

container.addEventListener("click", (e) => {
    if (e.target.matches ("input") && (e.target.checked === true || e.target.checked === false)) {
        const filtersObjArr = generateFilterDOM();
        const projectToDisplay = Filtering(cars, filtersObjArr);
        updateUI(projectToDisplay);
    }
});

// Initial data presentation
window.addEventListener('DOMContentLoaded', (event) => {
    const filtersObjArr = generateFilterDOM();
    const projectToDisplay = Filtering(cars, filtersObjArr);
    updateUI(projectToDisplay);
});

