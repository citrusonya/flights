import './styles/style.css';
import data from './moduls/flights.json';

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

            const aPrice = a.flight.price.total.amount,
                bPrice = b.flight.price.total.amount,
                aSegment = a.flight.legs[0].segments[1],
                aDateArrival = a.flight.legs[0].segments[0].arrivalDate,
                aDateDeparture = a.flight.legs[0].segments[0].departureDate,
                aSecondSegment = a.flight.legs[1].segments[1],
                aSecondDateArrival = a.flight.legs[1].segments[0].arrivalDate,
                aSecondDateDeparture = a.flight.legs[1].segments[0].departureDate,
                bSegment = b.flight.legs[0].segments[1],
                bDateArrival = b.flight.legs[0].segments[0].arrivalDate,
                bDateDeparture = b.flight.legs[0].segments[0].departureDate,
                bSecondSegment = b.flight.legs[1].segments[1],
                bSecondDateArrival = b.flight.legs[1].segments[0].arrivalDate,
                bSecondDateDeparture = b.flight.legs[1].segments[0].departureDate;

            if(document.getElementById('price_up').checked) return aPrice - bPrice;
            if(document.getElementById('price_down').checked) return bPrice - aPrice;
            if(document.getElementById('time').checked) {
                const aForward = ((new Date(aSegment === undefined ? aDateArrival : aSegment.arrivalDate).getTime() - 
                                new Date(aDateDeparture).getTime()) / 60 / 1000) 
                                +
                                ((new Date(aSecondSegment === undefined ? aSecondDateArrival : aSecondSegment.arrivalDate).getTime() - 
                                new Date(aSecondDateDeparture).getTime()) / 60 / 1000);

                const aBack = ((new Date(aSegment === undefined ? aDateArrival : aSegment.arrivalDate).getTime() - 
                                new Date(a.flight.legs[0].segments[0].departureDate).getTime()) / 60 / 1000);

                const aSum = aForward + aBack;

                const bForward = ((new Date(bSegment === undefined ? bDateArrival : bSegment.arrivalDate).getTime() - 
                                new Date(bDateDeparture).getTime()) / 60 / 1000)
                                +
                                ((new Date(bSecondSegment === undefined ? bSecondDateArrival : bSecondSegment.arrivalDate).getTime() - 
                                new Date(bSecondDateDeparture).getTime()) / 60 / 1000);
                
                const bBack = ((new Date(bSegment === undefined ? bDateArrival : bSegment.arrivalDate).getTime() - 
                                new Date(bDateDeparture).getTime()) / 60 / 1000);

                const bSum = bForward + bBack;
                return aSum - bSum;
            }
        })
        .filter(v => (
            (!priceMin || priceMin <= v.flight.price.total.amount) &&
            (!priceMax || priceMax >= v.flight.price.total.amount) &&
            (!transfer.length || transfer == (v.flight.legs[0].segments.length && v.flight.legs[1].segments.length))) &&
            (!carrier.length || carrier.includes(v.flight.carrier.caption))
        )
    );
};

function editValue() {
    document.querySelectorAll('#transfer').forEach((v) => {   

        if (v.innerHTML === '2') v.innerHTML = "<div>1 пересадка</div>";
        if (v.innerHTML === '1') v.innerHTML = "";
    });
};

function dirrectFlight() {
    const dirrect = document.getElementById('dirrect'),
        connecting = document.getElementById('connecting'),
        polishAirline = document.querySelector('input[value="LOT Polish Airlines"]'),
        russianAirline = document.querySelector('input[value="Аэрофлот - российские авиалинии"]');
    
    if (dirrect.checked) {
        polishAirline.checked = false;
        polishAirline.disabled = true;
        document.querySelectorAll('#transfer').forEach((v) => {

            if (v.innerHTML === "<div>1 пересадка</div>") v.parentNode.className += " inactive";
        })
    };

    if (connecting.checked) polishAirline.disabled = false;
    if (polishAirline.checked) dirrect.disabled = true;
    if (!polishAirline.checked) dirrect.disabled = false;
    if (polishAirline.checked && russianAirline.checked) dirrect.disabled = false;
};

function getMinPrice(array, value, output){
    const sort = array.filter(v => v.flight.carrier.caption === value)
                        .map(value => value.flight.price.total.amount);

    const sortConvert = sort.map(v => parseInt(v)),
        min = Math.min.apply(null, sortConvert);

    document.getElementById(output).innerHTML = `от ${ min } руб.`;
}

getMinPrice(flights, 'LOT Polish Airlines', 'minPricePolish');
getMinPrice(flights, 'Аэрофлот - российские авиалинии', 'minPriceAeroflot');

function wrapper() {
    let data = Array.from(document.querySelectorAll('#flight')),
        step = 2,
        item = 0;

    data.slice(step).forEach(e => e.style.display = "none");
    item += step;
    
    document.querySelector('#loadMore').addEventListener('click', function(e){
        let tmp = data.slice(item, item + step);

        tmp.forEach(e => e.style.display = "block");
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
        dateDay = ['пн','вт','ср','чт','пт','сб','вс'];

    output.innerHTML = control ? (result.map(((value) =>{
        const carrier = value.flight.carrier.caption,
            price = value.flight.price.total.amount,
            forwardSegment = value.flight.legs[0].segments[0],
            forwardSecondSegment = value.flight.legs[0].segments[1],
            backSegment = value.flight.legs[1].segments[0],
            backSecondSegment = value.flight.legs[1].segments[1];
        
        const getDepartureDate = (a) => {
            return a.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}/, 
            function($0, $1, $2, $3, $4, $5){ 
                return `<p class="date__time">
                            ${$4}:${$5} 
                            <span class="date__month">
                                ${$3} ${ dateMonth[$2-1] } 
                                ${ dateDay[(new Date(forwardSegment.departureDate)).getDay()-1] }
                            <span>
                        </p>`
            });
        };

        const getArrivalDate = (a, b) => {
            return (
                a.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}/, function($0, $1, $2, $3, $4, $5){
                    return `<p class="date__time">
                                <span class="date__month">
                                    ${$3} ${ dateMonth[$2-1] } 
                                    ${ dateDay[(new Date(a)).getDay()-1] }
                                </span> 
                                ${$4}:${$5}
                            </p>`
                            }
                    ) ||
                b.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}/, function($0, $1, $2, $3, $4, $5){
                    return `<p class="date__time">
                                <span class="date__month">
                                    ${$3} ${ dateMonth[$2-1] } 
                                    ${ dateDay[(new Date(b)).getDay()-1] }
                                </span> 
                                ${$4}:${$5}
                            </p>`
                            }
                        )

            );           
        };

        const getDiffHours = (a, b) => {
            return ((Math.floor((new Date(a).getTime() - 
                        new Date(b).getTime()) / 3600 / 1000)).toString());
        };

        const getDiffMin = (a, b) => {
            return (((new Date(a).getMinutes() - 
                        new Date(b).getMinutes()).toString().replace('-', '')));
        };


        return (
    `<div id="flight">
        <div class="flight__header"><img src="./img/${ carrier }.png" alt="Логотип ${ carrier }">
            <p>${ price } ₽</p>Стоимость для одного взрослого пассажира 
        </div>
        <div class="flight__forward">
            <div class="flight__city" id="cityForward">
                ${ forwardSegment.departureCity.caption }, ${ forwardSegment.departureAirport.caption }

                <span>(${ forwardSegment.departureAirport.uid }) →</span>
                
                ${ forwardSecondSegment === undefined ? forwardSegment.arrivalCity.caption : 
                    (forwardSecondSegment.arrivalCity === undefined ? 'ЛОНДОН' : forwardSecondSegment.arrivalCity.caption ) },
                
                ${ forwardSecondSegment === undefined ? forwardSegment.arrivalAirport.caption : forwardSecondSegment.arrivalAirport.caption }

                <span>(${ forwardSecondSegment === undefined ? forwardSegment.arrivalAirport.uid : forwardSecondSegment.arrivalAirport.uid })</span>
            </div>
            <div class="flight__date">
                ${ getDepartureDate(forwardSegment.departureDate) }
                <p class="date__range"><img src="./img/clock.svg" alt="Часы">
                    <span id="dateRange"> 
                        ${ getDiffHours((forwardSecondSegment === undefined ? forwardSegment.arrivalDate : 
                                forwardSecondSegment.arrivalDate), forwardSegment.departureDate)} ч
                        ${ getDiffMin((forwardSecondSegment === undefined ? forwardSegment.arrivalDate : 
                                forwardSecondSegment.arrivalDate), forwardSegment.departureDate) } мин
                    </span>
                </p>
                ${ getArrivalDate(forwardSecondSegment === undefined ? forwardSegment.arrivalDate : forwardSegment.arrivalDate) }
            </div>
            <div id="transfer">${ value.flight.legs[0].segments.length }</div>
            <div class="flight__footer">Рейс выполняет: ${ forwardSegment.airline.caption }</div>
        </div>
        <div>
            <div class="flight__city" id="cityBack">
                ${ backSegment.departureCity === undefined ? 'ЛОНДОН' : backSegment.departureCity.caption }, 
                ${ backSegment.departureAirport.caption }

                <span>(${ backSegment.departureAirport.uid }) →</span>

                ${ backSecondSegment === undefined ? backSegment.arrivalCity.caption : backSecondSegment.arrivalCity.caption },
                ${ backSecondSegment === undefined ? backSegment.arrivalAirport.caption : backSecondSegment.arrivalAirport.caption }

                <span>(${ backSecondSegment === undefined ? backSegment.arrivalAirport.uid : backSecondSegment.arrivalAirport.uid })</span>
            </div>
            <div class="flight__date">
                ${ getDepartureDate(backSegment.departureDate) }
                <p class="date__range"><img src="./img/clock.svg" alt="Часы">
                    <span id="dateRange">
                        ${ getDiffHours((backSecondSegment === undefined ? backSegment.arrivalDate : 
                                backSecondSegment.arrivalDate), backSegment.departureDate)} ч
                        ${ getDiffMin((backSecondSegment === undefined ? backSegment.arrivalDate : 
                            backSecondSegment.arrivalDate), backSegment.departureDate) } мин
                    </span>
                </p>
                ${ getArrivalDate(backSecondSegment === undefined ? backSegment.arrivalDate : backSecondSegment.arrivalDate) }
            </div>
            <div id="transfer">${ value.flight.legs[1].segments.length }</div>
            <div class="flight__footer">Рейс выполняет: ${ backSegment.airline.caption }</div>
        </div>
        <button class="flight__btn">Выбрать</button>
    </div>
    `)}))
    .join('')  ) : `<div class="wrapper">По вашему запросу ничего не найдено.</div>`
    editValue()
    dirrectFlight()
    wrapper()
}

outputFlights(flights)