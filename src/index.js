import './styles/style.css'
import data from './moduls/flights.json'

"use strict";

const flights = data.result.flights;
console.log(flights)
//const variant = flights.map(value => value.flight.carrier.caption)
//console.log(variant)

const filters = document.querySelector('#filters');

filters.addEventListener('input', filterFlights);

function filterFlights() {
      
    const
        sort = Array.from(document.querySelectorAll('#sort > input.radio:checked')).map(v => v.value),
        filter = Array.from(document.querySelectorAll('#filter > input.radio:checked')).map(v => v.value),
        priceMin = document.querySelector('#price-min').value,
        priceMax = document.querySelector('#price-max').value,
        carrier = Array.from(document.querySelectorAll('#carrier > input.radio:checked')).map(v => v.value);

    outputFlights(flights.filter(v => (
        //(!sort || v.sort === country) &&
        //(!filter.length || filter.includes(v.filter)) &&
        (!priceMin || priceMin <= v.flight.price.total.amount) &&
        (!priceMax || priceMax >= v.flight.price.total.amount)// &&
        //(!carrier.length || carrier.includes(v.carrier))
    ))
    );

    if(document.getElementById('price_up').checked) {
        return outputFlights(flights.filter(v => v.flight.price.total.amount)
        .sort(function (a, b){
            return a.flight.price.total.amount - b.flight.price.total.amount;
        }))
    }

    if(document.getElementById('price_down').checked) {
        return outputFlights(flights.filter(v => v.flight.price.total.amount)
        .sort(function (a, b){
            return b.flight.price.total.amount - a.flight.price.total.amount;
        }))
    }
}

function outputFlights(result) {
    document.getElementById('result').innerHTML = result.map(value => 
    `<div>
        <div class="flight__header"><img src="./img/${ value.flight.carrier.caption }.png" alt="Логотип ${ value.flight.carrier.caption }"><p>${ value.flight.price.total.amount } ₽</p>Стоимость для одного взрослого пассажира</div>
        <div class="city" id="cityForward"></div>
        <div class="date"></div>
        <div id="transfer"></div>
        <div class="flight__footer">Рейс выполняет: ${ value.flight.legs[0].segments[0].airline.caption }</div>
        <div class="city" id="cityBack"></div>
        <div class="date"></div>
        <div id="transfer"></div>
        <div class="flight__footer">Рейс выполняет: ${ value.flight.legs[1].segments[0].airline.caption }</div>
        <button class="flight__btn">Выбрать</button>
    </div>
    `).join('');
}

outputFlights(flights)