import ymaps from 'ymaps';

const SELECTORS = {
    header: ".header",
    links: ".carts__link",
    address: ".carts__address",
}
const placeMark = {
    iconLayout: 'default#image',
    iconImageHref: '../images/marker.svg',
    iconImageSize: [40, 40],
    iconImageOffset: [-19, -44]
}
const markers = {
    marker1: {
        coordinates: [55.724525004277325, 37.65559799999997],
        city: "МОСКВА",
        address: "115114, ул. Дербеневская, д. 1, стр. 1, подъезд 44, офис 6 (станция метро \"Павелецкая\")",
        phone: "+7 (499) 136-17-18",
        time: "Режим работы: c 10:00 до 18:00",
    },
    marker2: {
        coordinates: [48.500644573895386, 44.57983050000001],
        city: "Волгоград",
        address: "400080, ул. Командира Рудь, 14А",
        phone: "+7 (8442) 65-08-88",
        time: "Режим работы: c 10:00 до 17:00",
    },
    marker3: {
        coordinates: [45.040928574583894, 38.98296649999998],
        city: "КРАСНОДАР",
        address: "350015, ул. Митрофана Седина, 176",
        phone: "+7 (861) 292-71-88",
        time: "Режим работы: c 10:00 до 17:00",
    },
    marker4: {
        coordinates: [51.586542572358674, 45.96639799999997],
        city: "Саратов",
        address: "410080, пр-т Строителей, 1",
        phone: "+7 (927) 626-00-50",
        time: "Режим работы: c 10:00 до 18:00",
    },
    marker5: {
        coordinates: [51.6714385722938, 39.20326949999999],
        city: "воронеж",
        address: "394030, ул. Комиссаржевской, 10",
        phone: "+7 (473) 229-63-78",
        time: "Режим работы: c 10:00 до 18:00",
    },
    marker6: {
        coordinates: [40.219923073746195, 44.57038899999996],
        city: "ЕРЕВАН",
        address: "Район Аван 4, дом 2",
        phone: "+374 91 21 90 69",
        time: "Режим работы: c 10:00 до 18:00",
    },
    marker7: {
        coordinates: [55.02308756967556, 82.97561299999995],
        city: "НОВОСИБИРСК",
        address: "630039, ул. Никитина 116, к.3",
        phone: "+7 (383) 20-62-461",
        time: "Режим работы: c 10:00 до 18:00",
    },
}


export default class Maps {
    constructor() {
        this.map = null;
        this.routeLinks = document.querySelectorAll(SELECTORS.links)
        this.transition = 1000;
        this.init();
    }

    load() {
        return ymaps.load('https://api-maps.yandex.ru/2.1/?apikey=fa770f8b-48cf-4f49-929f-fa569a5f6c29&lang=ru_RU');
    }

    init() {
        this.load().then(maps => {
            this.createMap(maps);
            this.setCustomSettingsMap(this.map);
            this.createAllPlacemark(maps);
            this.addRouteLinkListener()
        }).catch(error => console.log('Failed to load Yandex Maps', error));
    }

    createMap(maps) {
        this.map = new maps.Map('map', {
            center: [48.83757049075884, 59.89448448608449],
            zoom: 5
        });
    }

    addRouteLinkListener() {
        for (let link of this.routeLinks) {
            link.addEventListener("click", (e) => {
                this.routeLinkListener(e, link);
            })
        }
    }

    routeLinkListener(e, link) {
        let address = link.parentNode.querySelector(SELECTORS.address).textContent;
        let coordinates = this.findCoordinate(address.trim());
        this.goToMap(link);
        this.createRoute(coordinates);
        e.preventDefault();
    }

    findCoordinate(address) {
        for (let key in markers) {
            if (markers[key]["address"] === address) {
                return markers[key]["coordinates"];
            }
        }
    }

    goToMap(link) {
        const headerHeight = document.querySelector(SELECTORS.header).clientHeight
        const gotoBlock = document.querySelector(link.dataset.goto);
        const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - headerHeight;

        window.scrollTo({
            top: gotoBlockValue,
            behavior: "smooth",
        });
    }

    createRoute(coordinates) {
        this.map.controls.add('routeButtonControl');
        let control = this.map.controls.get('routeButtonControl');
        this.settingsRoute(control, coordinates);
    }

    settingsRoute(control, coordinates) {
        this.settingsRouteMain(control, coordinates);
        this.settingsRouteLine(control);
    }

    settingsRouteMain(control, coordinates) {
        control.routePanel.geolocate('from');

        control.state.set('expanded', true);
        control.routePanel.state.set({
            type: 'bus',
            fromEnabled: true,
            toEnabled: false,
            to: coordinates,
        });
    }

    settingsRouteLine(control) {
        let multiRoutePromise = control.routePanel.getRouteAsync();

        multiRoutePromise.then(function (multiRoute) {
            multiRoute.options.set({
                wayPointFinishVisible: false,
            });
        }, function (err) {
            console.log(err);
        });
    }

    createAllPlacemark(maps) {
        for (let key in markers) {
            this.createPlacemark(maps, markers[key]["coordinates"], markers[key]["city"], markers[key]["address"], markers[key]["phone"], markers[key]["time"]);
        }
    }

    createPlacemark(maps, coordinates, city, address, phone, time) {
        let placemark = new maps.Placemark(coordinates, this.createBalloon(city, address, phone, time), placeMark);
        this.addClick(placemark, coordinates);
        this.map.geoObjects.add(placemark);
    }

    addClick(placemark, coordinates) {
        placemark.events.add("click", () => {
            this.moveToPoint(coordinates);
        });
    }

    moveToPoint(coordinates) {
        this.map.panTo([coordinates], {useMapMargin: true}).then(() => {
            this.zoomToPoint();
        });
    }

    zoomToPoint() {
        if (this.map.getZoom() < 9) {
            this.map.setZoom(9, {duration: this.transition})
                .then(() => this.map.setZoom(13, {duration: this.transition})
                    .then(() => this.map.setZoom(17, {duration: this.transition})));
        }
    }

    createBalloon(city, address, phone, time) {
        return {
            balloonContent: `
                <div class="balloon">
                    <div class="balloon__city title">${city}</div>
                    <div class="balloon__address">${address}</div>
                    <div class="balloon__contacts">
                        <a class="balloon__link link" href="tel:${this.cleanNumber(phone)}">${phone}</a>
                    </div>
                    <div class="balloon__time">${time}</div>
                </div>
            `,
        }
    }

    cleanNumber(number) {
        return "+" + number.replace(/\D/g, '');
    }

    setCustomSettingsMap(map) {
        map.options.set('balloonAutoPan', false);
        map.controls.remove('geolocationControl');
        map.controls.remove('searchControl');
        map.controls.remove('trafficControl');
        map.controls.remove('typeSelector');
        map.controls.remove('fullscreenControl');
        map.controls.remove('rulerControl');
        map.behaviors.disable(['scrollZoom']);
    }
}

