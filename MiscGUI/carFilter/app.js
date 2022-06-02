const data = {  
  cars: [
    { make: 'Honda', image: 'https://platform.cstatic-images.com/large/in/v2/stock_photos/05fbf9ef-45e2-46d0-a30f-2d3bb13a4aef/a63b6601-3faa-4e82-a090-bb8a283bbcb9.png', model: 'Accord', year: 2005, price: 7000 },
    { make: 'Honda', image: 'https://cdn.jdpower.com/Models/640x480/2008-Honda-AccordSdn-EX.jpg', model: 'Accord', year: 2008, price: 11000 },
    { make: 'Toyota', image: 'https://cars.usnews.com/static/images/Auto/izmo/295961/2009_toyota_camry_angularfront.jpg', model: 'Camry', year: 2009, price: 12500 },
    { make: 'Toyota', image: 'https://cfx-vrf-main-imgs.imgix.net/4/5/1/a75771174f953efafe2e01b1c3eb09b715053154.png?auto=format&fit=clip&w=420', model: 'Corolla', year: 2016, price: 15000 },
    { make: 'Suzuki', image: 'https://carsguide-res.cloudinary.com/image/upload/f_auto,fl_lossy,q_auto,t_cg_hero_low/v1/cg_vehicle/ds/2014_suzuki_swift.jpg', model: 'Swift', year: 2014, price: 9000 },
    { make: 'Audi', image: 'https://cars.usnews.com/static/images/Auto/izmo/352135/2013_audi_a4_angularfront.jpg', model: 'A4', year: 2013, price: 25000 },
    { make: 'Audi', image: 'https://platform.cstatic-images.com/xlarge/in/v2/stock_photos/12f36b79-d7ce-4906-8640-4d71b0b1ad3c/54e0d5c0-1090-4d6e-9187-ab8dcaa87178.png', model: 'A4', year: 2013, price: 26000 },
  ]
};

class CarApp {
  constructor() {
    this.templates = {};
    this.compileTemplates();
    this.registerPartials();
    this.data = data;
    this.filters = {};
    this.generateFilters();
    this.renderPage();
    this.bindEventListeners();
  }

  compileTemplates() {
    let templateScripts = document.querySelectorAll("[type='text/x-handlebars']");
    templateScripts.forEach(script => {
      this.templates[script.id] = Handlebars.compile(script.innerHTML);
    });
  }

  registerPartials() {
    let partialScripts = document.querySelectorAll("[data-type='partial']");
    partialScripts.forEach(partial => {
      Handlebars.registerPartial(partial.id, partial.innerHTML);
    });
  }

  generateFilters() {
    let keys = Object.keys(this.data.cars[0]);
    keys = keys.filter(key => key !== 'image');
    keys.forEach(key => this.filters[key] = []);

    this.data.cars.forEach(car => {
      keys.forEach(key => {
        if (this.filters[key].includes(car[key])) return;
        this.filters[key].push(car[key]);
      });
    });
  }

  renderPage() {
    this.renderHeader();
    this.renderCars();
  }

  renderHeader() {
    let filtersDiv = document.querySelector('#filters');
    filtersDiv.innerHTML = this.templates['make-filters'](this.filters);
  }

  filterCars(valuesObject = { make: 'All', model: 'All', price: 'All', year: 'All'}) {
    let filteredCars = [...this.data.cars];
    for (let filter in valuesObject) {
      if (valuesObject[filter] === 'All') continue;
      filteredCars = filteredCars.filter(car => {
        return car[filter] === valuesObject[filter];
      });
    }
    return { cars: filteredCars };
  }

  renderCars(carData = this.data) {
    let carsDiv = document.querySelector('#cars');
    carsDiv.innerHTML = this.templates['make-cars'](carData);
  }

  bindEventListeners() {
    this.bindFilterEventListener();
    this.bindBuyEventListener();
    this.bindSelectMakeEventListener();
  }

  bindFilterEventListener() {
    let filterButton = document.querySelector('.filter-btn');
    document.addEventListener('click', filterEventHandler);

    const app = this;
    function filterEventHandler(e) {
      if (e.target.classList.contains('filter-btn')) {
        e.preventDefault();
      let selections = Array.from(document.querySelectorAll("[id*='-select']"));
  
      let valuesObject = {};
      selections.forEach(selection => {
        let selectionId = selection.id;
        let label = document.querySelector(`[for='${selectionId}']`);
        let key = label.textContent.toLowerCase();
        let value = selection.value;
        if ((key === 'price' || key === 'year') && value !== 'All') {
          valuesObject[key] = Number(value);
        } else {
          valuesObject[key] = value;
        }
      });
      
      app.renderCars(app.filterCars(valuesObject));
      }
    }
  }

  bindSelectMakeEventListener() {
    document.addEventListener('change', selectMakeEventHandler);

    const app = this;
    function selectMakeEventHandler(e) {
      if (e.target.id === 'make-select') {
        let selectedValue = e.target.value;
        let selectedOptionElement = document.querySelector(`#make-select option[value='${selectedValue}']`);
        let selectedIndex = Array.from(document.querySelectorAll('#make-select option')).indexOf(selectedOptionElement);
        app.renderHeader();
        let selectMakeElement = document.querySelector('#make-select');
        selectMakeElement.options.selectedIndex = selectedIndex;
      
        if (selectedValue === 'All') return;
        let filteredData = app.filterCars({ make: selectedValue });
        let availableModels = filteredData.cars.map(car => car.model);
        let modelOptionElements = document.querySelectorAll('#model-select option');
        modelOptionElements.forEach(option => {
          let optionValue = option.value
          if (optionValue === 'All' || availableModels.includes(optionValue)) return;
          option.remove();
        });
      }
    }
  }

  bindBuyEventListener() {
    // out of scope for this project
  }
}

document.addEventListener('DOMContentLoaded', function(e) {
  let app = new CarApp();
});