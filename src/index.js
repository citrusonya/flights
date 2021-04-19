import './styles/style.css'
import data from './moduls/flights.json'

"use strict";

const flights = data.result.flights;
const filters = document.querySelector('#filters');
filters.addEventListener('input', filterFlights);

function filterFlights() {
    
    const priceMin = document.getElementById('price_min').value,
        priceMax = document.getElementById('price_max').value,
        transfer = [...filters.querySelectorAll('input[name="filter"]:checked')].map(v => v.value),
        carrier = [...filters.querySelectorAll('input[name="airline"]:checked')].map(v => v.value);

    outputFlights(flights
        .sort((a, b) => {
            if(document.getElementById('price_up').checked) return a.flight.price.total.amount - b.flight.price.total.amount;
            if(document.getElementById('price_down').checked) return b.flight.price.total.amount - a.flight.price.total.amount;
        })
        .filter(v => (
            (!priceMin || priceMin <= v.flight.price.total.amount) &&
            (!priceMax || priceMax >= v.flight.price.total.amount) &&
            (!transfer.length || transfer == (v.flight.legs[0].segments.length && v.flight.legs[1].segments.length))) &&
            (!carrier.length || carrier.includes(v.flight.carrier.caption))

        )
    )

}

function editValue() {
    document.querySelectorAll('#transfer').forEach(function(v) {
        
        if (v.innerHTML === "2") {
            v.innerHTML = "<div>1 пересадка</div>"
        }else{
            v.innerHTML = ""
        }
    })
}

function dirrectFlight() {
    const dirrect = document.getElementById('dirrect')
    if (dirrect.checked) {
        document.querySelectorAll('#transfer').forEach(function(v) {
            if (v.innerHTML === "<div>1 пересадка</div>") {
                v.parentNode.className += " inactive"
            }
        })
    }
}

function outputFlights(result) {

    const output = document.getElementById('result');

    const dateMonth = ["янв.", "фев.","мар.","апр.","май","июн.","июл.","авг.","сен.","окт.","ноя.", "дек."]

    output.innerHTML = result.map((value => 
    `<div>
        <div class="flight__header"><img src="./img/${ value.flight.carrier.caption }.png" alt="Логотип ${ value.flight.carrier.caption }">
            <p>${ value.flight.price.total.amount } ₽</p>Стоимость для одного взрослого пассажира</div>
        <div>
            <div class="city" id="cityForward">
                ${ value.flight.legs[0].segments[0].departureCity.caption },
                ${ value.flight.legs[0].segments[0].departureAirport.caption }
                <span>(${ value.flight.legs[0].segments[0].departureAirport.uid }) →</span>
                ${ value.flight.legs[0].segments[1] === undefined ? value.flight.legs[0].segments[0].arrivalCity.caption : 
                    (value.flight.legs[0].segments[1].arrivalCity === undefined ? 
                        'ЛОНДОН' : value.flight.legs[0].segments[1].arrivalCity.caption ) },
                ${ value.flight.legs[0].segments[1] === undefined 
                    ? value.flight.legs[0].segments[0].arrivalAirport.caption : 
                    value.flight.legs[0].segments[1].arrivalAirport.caption }
                <span>(${ value.flight.legs[0].segments[1] === undefined ? 
                    value.flight.legs[0].segments[0].arrivalAirport.uid : 
                    value.flight.legs[0].segments[1].arrivalAirport.uid })</span>
            </div>
            <div class="date">
                ${ value.flight.legs[0].segments[0].departureDate.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}/, 
                    function($0, $1, $2, $3, $4, $5){ 
                        return `<p class="date__time">${$4}:${$5} <span class="date__month">${$3} ${ dateMonth[$2-1] }<span></p>`}) }
                <p class="date__hours"><img src="./img/clock.svg" alt="Часы">
                ${ ((new Date(value.flight.legs[0].segments[1] === undefined ? 
                        value.flight.legs[0].segments[0].arrivalDate : 
                        value.flight.legs[0].segments[1].arrivalDate).getHours() - 
                    new Date(value.flight.legs[0].segments[0].departureDate).getHours()).toString())
                } ч
                ${ (((new Date(value.flight.legs[0].segments[1] === undefined ? 
                        value.flight.legs[0].segments[0].arrivalDate : 
                        value.flight.legs[0].segments[1].arrivalDate).getMinutes() - 
                    new Date(value.flight.legs[0].segments[0].departureDate).getMinutes()).toString().replace('-', '')))
                }
                 мин</p>
                ${ value.flight.legs[0].segments[1] === undefined ? 
                    value.flight.legs[0].segments[0].arrivalDate.replace(
                        /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}/,
                        function($0, $1, $2, $3, $4, $5){
                            return `<p class="date__time"><span class="date__month">${$3} ${ dateMonth[$2-1] }</span> ${$4}:${$5}</p>`
                        }
                    ) : 
                    value.flight.legs[0].segments[1].arrivalDate.replace(
                        /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}/,
                        function($0, $1, $2, $3, $4, $5){
                            return `<p class="date__time"><span class="date__month">${$3} ${ dateMonth[$2-1] }</span> ${$4}:${$5}</p>`
                        }
                    )
                }
            </div>
            <div id="transfer">${ value.flight.legs[0].segments.length }</div>
            <div class="flight__footer">Рейс выполняет: ${ value.flight.legs[0].segments[0].airline.caption }</div>
        </div>
        <div>
            <div class="city" id="cityBack">
                ${ value.flight.legs[1].segments[0].departureCity === undefined ? 
                    'ЛОНДОН' : value.flight.legs[1].segments[0].departureCity.caption }, 
                ${ value.flight.legs[1].segments[0].departureAirport.caption }
                <span>(${ value.flight.legs[0].segments[0].departureAirport.uid }) →</span>
                ${ value.flight.legs[1].segments[1] === undefined ? 
                    value.flight.legs[1].segments[0].arrivalCity.caption : 
                    value.flight.legs[1].segments[1].arrivalCity.caption },
                ${ value.flight.legs[1].segments[1] === undefined ? 
                    value.flight.legs[1].segments[0].arrivalAirport.caption : 
                    value.flight.legs[1].segments[1].arrivalAirport.caption }
                <span>(${ value.flight.legs[1].segments[1] === undefined ? 
                    value.flight.legs[1].segments[0].arrivalAirport.uid : 
                    value.flight.legs[1].segments[1].arrivalAirport.uid })</span>
            </div>
            <div class="date">
                ${ value.flight.legs[1].segments[0].departureDate.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}/, 
                    function($0, $1, $2, $3, $4, $5){ 
                        return `<p class="date__time">${$4}:${$5} <span class="date__month">${$3} ${ dateMonth[$2-1] }<span></p>`}) }
                        <p class="date__hours"><img src="./img/clock.svg" alt="Часы">
                    ${ ((new Date(value.flight.legs[1].segments[1] === undefined ? 
                            value.flight.legs[1].segments[0].arrivalDate : 
                            value.flight.legs[1].segments[1].arrivalDate).getHours() - 
                        new Date(value.flight.legs[1].segments[0].departureDate).getHours()).toString())
                    } ч
                    ${ (((new Date(value.flight.legs[1].segments[1] === undefined ? 
                            value.flight.legs[1].segments[0].arrivalDate : 
                            value.flight.legs[1].segments[1].arrivalDate).getMinutes() - 
                        new Date(value.flight.legs[1].segments[0].departureDate).getMinutes()).toString().replace('-', '')))
                    }
                     мин</p>
                ${ value.flight.legs[1].segments[1] === undefined ? 
                    value.flight.legs[1].segments[0].arrivalDate.replace(
                        /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}/,
                        function($0, $1, $2, $3, $4, $5){
                            return `<p class="date__time"><span class="date__month">${$3} ${ dateMonth[$2-1] }</span> ${$4}:${$5}</p>`
                        }
                    ) : 
                    value.flight.legs[1].segments[1].arrivalDate.replace(
                        /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}/,
                        function($0, $1, $2, $3, $4, $5){
                            return `<p class="date__time"><span class="date__month">${$3} ${ dateMonth[$2-1] }</span> ${$4}:${$5}</p>`
                        }
                    )
                }
            </div>
            <div id="transfer">${ value.flight.legs[1].segments.length }</div>
            <div class="flight__footer">Рейс выполняет: ${ value.flight.legs[1].segments[0].airline.caption }</div>
        </div>
        <button class="flight__btn">Выбрать</button>
    </div>
    `))
    .join('');  
    editValue()
    dirrectFlight()
}

outputFlights(flights)

function getMinPrice(array, value, output){
    const sort = array.filter(v => v.flight.carrier.caption === value)
                        .map(value => value.flight.price.total.amount)

    const sortConvert = sort.map(v => parseInt(v))
    const min = Math.min.apply(null, sortConvert)

    document.getElementById(output).innerHTML = `от ${ min } руб.`
}

getMinPrice(flights, 'LOT Polish Airlines', 'min_price_Polish');
getMinPrice(flights, 'Аэрофлот - российские авиалинии', 'min_price_Aeroflot');