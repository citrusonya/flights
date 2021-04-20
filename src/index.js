import './styles/style.css'
import data from './moduls/flights.json'

'use strict';

const flights = data.result.flights;

document.querySelector('#filters').addEventListener('input', filterFlights);

function filterFlights() {
    
    const priceMin = document.getElementById('price_min').value,
        priceMax = document.getElementById('price_max').value,
        transfer = [...filters.querySelectorAll('input[name="filter"]:checked')].map(v => v.value),
        carrier = [...filters.querySelectorAll('input[name="airline"]:checked')].map(v => v.value);

    outputFlights(flights
        .sort((a, b) => {

            if(document.getElementById('price_up').checked) return a.flight.price.total.amount - b.flight.price.total.amount;
            if(document.getElementById('price_down').checked) return b.flight.price.total.amount - a.flight.price.total.amount;
            if(document.getElementById('time').checked) {
                const aForward = ((new Date(a.flight.legs[0].segments[1] === undefined ? 
                    a.flight.legs[0].segments[0].arrivalDate : 
                    a.flight.legs[0].segments[1].arrivalDate).getTime() - 
                new Date(a.flight.legs[0].segments[0].departureDate).getTime()) / 60 / 1000) 
                    +
                ((new Date(a.flight.legs[1].segments[1] === undefined ? 
                    a.flight.legs[1].segments[0].arrivalDate : 
                    a.flight.legs[1].segments[1].arrivalDate).getTime() - 
                new Date(a.flight.legs[1].segments[0].departureDate).getTime()) / 60 / 1000);
                const aBack = ((new Date(a.flight.legs[0].segments[1] === undefined ? 
                    a.flight.legs[0].segments[0].arrivalDate : 
                    a.flight.legs[0].segments[1].arrivalDate).getTime() - 
                new Date(a.flight.legs[0].segments[0].departureDate).getTime()) / 60 / 1000) 
                const aSum = aForward + aBack
                const bForward = ((new Date(b.flight.legs[0].segments[1] === undefined ? 
                    b.flight.legs[0].segments[0].arrivalDate : 
                    b.flight.legs[0].segments[1].arrivalDate).getTime() - 
                new Date(b.flight.legs[0].segments[0].departureDate).getTime()) / 60 / 1000) 
                    +
                ((new Date(b.flight.legs[1].segments[1] === undefined ? 
                    b.flight.legs[1].segments[0].arrivalDate : 
                    b.flight.legs[1].segments[1].arrivalDate).getTime() - 
                new Date(a.flight.legs[1].segments[0].departureDate).getTime()) / 60 / 1000);
                const bBack = ((new Date(b.flight.legs[0].segments[1] === undefined ? 
                    b.flight.legs[0].segments[0].arrivalDate : 
                    b.flight.legs[0].segments[1].arrivalDate).getTime() - 
                new Date(b.flight.legs[0].segments[0].departureDate).getTime()) / 60 / 1000) 
                const bSum = bForward + bBack
                    return aSum - bSum
            }
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

        if (v.innerHTML === '2') v.innerHTML = "<div>1 пересадка</div>"
        if (v.innerHTML === '1') v.innerHTML = ""
    })
}

function dirrectFlight() {
    const dirrect = document.getElementById('dirrect'),
        connecting = document.getElementById('connecting'),
        polishAirline = document.querySelector('input[value="LOT Polish Airlines"]')
    
    if (dirrect.checked) {
        polishAirline.checked = false;
        polishAirline.disabled = true;
        document.querySelectorAll('#transfer').forEach(function(v) {

            if (v.innerHTML === "<div>1 пересадка</div>") {
                v.parentNode.className += " inactive";
            }
        })
    }

    if (connecting.checked) polishAirline.disabled = false;
}

function getMinPrice(array, value, output){
    const sort = array.filter(v => v.flight.carrier.caption === value)
                        .map(value => value.flight.price.total.amount)

    const sortConvert = sort.map(v => parseInt(v))
    const min = Math.min.apply(null, sortConvert)

    document.getElementById(output).innerHTML = `от ${ min } руб.`
}

getMinPrice(flights, 'LOT Polish Airlines', 'minPricePolish');
getMinPrice(flights, 'Аэрофлот - российские авиалинии', 'minPriceAeroflot');

function wrapper() {
    let data = Array.from(document.querySelectorAll('#flight')),
    step = 2,
    item = 0;

    data.slice(step).forEach(e => e.style.display = 'none');
    item += step;
    
    document.querySelector('#loadMore').addEventListener('click', function(e){
        let tmp = data.slice(item, item + step);

        tmp.forEach(e => e.style.display = 'block');
        item += step;
    
        if(tmp.length < 2){
            this.remove();
        }
    });
}

function outputFlights(result) {

    const output = document.getElementById('result'),
        control = result.length,
        dateMonth = ['янв.','фев.','мар.','апр.','май','июн.','июл.','авг.','сен.','окт.','ноя.','дек.'],
        dateDay = ['пн','вт','ср','чт','пт','сб','вс']

    output.innerHTML = control ? (result.map((value =>
    `<div id="flight">
        <div class="flight__header"><img src="./img/${ value.flight.carrier.caption }.png" alt="Логотип ${ value.flight.carrier.caption }">
            <p>${ value.flight.price.total.amount } ₽</p>Стоимость для одного взрослого пассажира 
        </div>
        <div class="flight__forward">
            <div class="flight__city" id="cityForward">
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
            <div class="flight__date">
                ${ value.flight.legs[0].segments[0].departureDate.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}/, 
                    function($0, $1, $2, $3, $4, $5){ 
                        return `<p class="date__time">${$4}:${$5} <span class="date__month">${$3} ${ dateMonth[$2-1] } 
                            ${ dateDay[(new Date(value.flight.legs[0].segments[0].departureDate)).getDay()-1] }<span></p>`}) }
                <p class="date__range"><img src="./img/clock.svg" alt="Часы">
                <span id="dateRange"> ${ ((Math.floor((new Date(value.flight.legs[0].segments[1] === undefined ? 
                            value.flight.legs[0].segments[0].arrivalDate : 
                            value.flight.legs[0].segments[1].arrivalDate).getTime() - 
                        new Date(value.flight.legs[0].segments[0].departureDate).getTime()) / 3600 / 1000)).toString())
                    } ч
                        ${ (((new Date(value.flight.legs[0].segments[1] === undefined ? 
                            value.flight.legs[0].segments[0].arrivalDate : 
                            value.flight.legs[0].segments[1].arrivalDate).getMinutes() - 
                        new Date(value.flight.legs[0].segments[0].departureDate).getMinutes()).toString().replace('-', '')))
                    }
                     мин</span></p>
                ${ value.flight.legs[0].segments[1] === undefined ? 
                    value.flight.legs[0].segments[0].arrivalDate.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}/,
                        function($0, $1, $2, $3, $4, $5){
                            return `<p class="date__time"><span class="date__month">${$3} ${ dateMonth[$2-1] } 
                                ${ dateDay[(new Date(value.flight.legs[0].segments[0].arrivalDate)).getDay()-1] }</span> 
                                ${$4}:${$5}</p>`
                            }
                    ) : 
                    value.flight.legs[0].segments[1].arrivalDate.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}/,
                        function($0, $1, $2, $3, $4, $5){
                            return `<p class="date__time"><span class="date__month">${$3} ${ dateMonth[$2-1] } 
                                ${ dateDay[(new Date(value.flight.legs[0].segments[1].arrivalDate)).getDay()-1] }</span> 
                                ${$4}:${$5}</p>`
                            }
                        )
                    }
            </div>
            <div id="transfer">${ value.flight.legs[0].segments.length }</div>
            <div class="flight__footer">Рейс выполняет: ${ value.flight.legs[0].segments[0].airline.caption }</div>
        </div>
        <div>
            <div class="flight__city" id="cityBack">
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
            <div class="flight__date">
                ${ value.flight.legs[1].segments[0].departureDate.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}/, 
                    function($0, $1, $2, $3, $4, $5){ 
                        return `<p class="date__time">${$4}:${$5} <span class="date__month">${$3} ${ dateMonth[$2-1] } 
                            ${ dateDay[(new Date(value.flight.legs[1].segments[0].departureDate)).getDay()-1] }<span></p>`}) }
                <p class="date__range"><img src="./img/clock.svg" alt="Часы">
                <span id="dateRange">${ ((Math.floor((new Date(value.flight.legs[1].segments[1] === undefined ? 
                        value.flight.legs[1].segments[0].arrivalDate : 
                        value.flight.legs[1].segments[1].arrivalDate).getTime() - 
                        new Date(value.flight.legs[1].segments[0].departureDate).getTime()) / 3600 / 1000)).toString())
                    } ч
                    ${ (((new Date(value.flight.legs[1].segments[1] === undefined ? 
                        value.flight.legs[1].segments[0].arrivalDate : 
                        value.flight.legs[1].segments[1].arrivalDate).getMinutes() - 
                        new Date(value.flight.legs[1].segments[0].departureDate).getMinutes()).toString().replace('-', '')))
                    }
                     мин</span></p>
                ${ value.flight.legs[1].segments[1] === undefined ? 
                    value.flight.legs[1].segments[0].arrivalDate.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}/,
                        function($0, $1, $2, $3, $4, $5){
                            return `<p class="date__time"><span class="date__month">${$3} ${ dateMonth[$2-1] } 
                                ${ dateDay[(new Date(value.flight.legs[1].segments[0].arrivalDate)).getDay()-1] }</span> 
                                ${$4}:${$5}</p>`
                        }
                    ) : 
                    value.flight.legs[1].segments[1].arrivalDate.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}/,
                        function($0, $1, $2, $3, $4, $5){
                            return `<p class="date__time"><span class="date__month">${$3} ${ dateMonth[$2-1] } 
                                ${ dateDay[(new Date(value.flight.legs[1].segments[1].arrivalDate)).getDay()-1] }</span> 
                                ${$4}:${$5}</p>`
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
    .join('')  ) : `<div class="wrapper">По вашему запросу ничего не найдено.</div>`
    editValue()
    dirrectFlight()
    wrapper()
}

outputFlights(flights)