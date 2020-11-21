class WeatherServer {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    async loadMeteo(city, units, language) {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&mode=xml&units=${units}&lang=${language}&APPID=${this.apiKey}`;
        return await $.get(url, 'xml');
    }
}

class Controller {
    constructor(weatherServer, places, units, language) {
        this.places = places;
        this.units = units;
        this.language = language;
        this.weatherServer = weatherServer;
    }
    async loadSectionsFromServer() {
        return await Promise.all(places.map(place => this.weatherServer.loadMeteo(place, this.units, this.language)
            .then(placeMeteo => {
                const section = this.section($('city', placeMeteo).attr('name'));
                section.append(this.iconImage($('weather', placeMeteo).attr('icon')),
                    this.weatherParagraph($('weather', placeMeteo).attr('value')),
                    this.coordsParagraph($('coord', placeMeteo).attr('lon'), $('coord', placeMeteo).attr('lat')),
                    this.preassureHumidityParagraph($('pressure', placeMeteo).attr('value'), $('humidity', placeMeteo).attr('value')),
                    this.temperatureParagraph($('temperature', placeMeteo).attr('value'), $('feels_like', placeMeteo).attr('value'), $('temperature', placeMeteo).attr('min'), $('temperature', placeMeteo).attr('max')),
                    this.windParagraph($('direction', placeMeteo).attr('value'), $('speed', placeMeteo).attr('value'), $('direction', placeMeteo).attr("code"), $('direction', placeMeteo).attr("name")),
                    this.visibilityCloudsParagraph($('visibility', placeMeteo).attr('value'), $('clouds', placeMeteo).attr('value')),
                    this.sunriseSunsetParagraph($('sun', placeMeteo).attr('rise'), $('sun', placeMeteo).attr('set')),
                    this.lastUpdateParagraph($('lastupdate', placeMeteo).attr('value')),
                    this.precipitationParagraph($('precipitation',placeMeteo).attr('mode'),$('precipitation',placeMeteo).attr('value')));
                return section;
            })));
    }
    loadSectionsInView() {
        this.loadSectionsFromServer().then(sections => sections.forEach(section => document.body.append(section)));
    }
    section(place) {
        const section = document.createElement('section');
        const title = document.createElement('h2');
        title.append(place);
        section.append(title);
        return section;
    }
    coordsParagraph(lon, lat) {
        const p = document.createElement('p');
        p.append(`Las coordenadas son longitud ${lon} y latitud ${lat}`);
        return p;
    }
    weatherParagraph(weatherDescription) {
        const p = document.createElement('p');
        p.append(`El tiempo es ${weatherDescription}`);
        return p;
    }
    temperatureParagraph(temp, feels_like, temp_min, temp_max) {
        const p = document.createElement('p');
        p.append(`Temperatura de ${temp}C con máximo de ${temp_max} y un mínimo de ${temp_min}. La sensación térmica es de unos ${feels_like}C`);
        return p;
    }
    preassureHumidityParagraph(pressure, humidity) {
        const p = document.createElement('p');
        p.append(`La presión es de ${pressure} milibares y tenemos una humedad al ${humidity}%`);
        return p;
    }
    sunriseSunsetParagraph(sunrise, sunset) {
        const sunriseTime = new Date(sunrise).toLocaleTimeString('es-ES');
        const sunsetTime = new Date(sunset).toLocaleTimeString('es-ES');
        const p = document.createElement('p');
        p.append(`El amanecer es a las ${sunriseTime} y el anochecer a las ${sunsetTime}`);
        return p;
    }
    windParagraph(direction, speed, code, name) {
        const p = document.createElement('p');
        p.append(`La dirección del viento es ${direction} grados y su velocidad es ${speed} m/s. Tiene código ${code} y nombre ${name}`);
        return p;
    }
    visibilityCloudsParagraph(visibility, clouds) {
        const p = document.createElement('p');
        p.append(`La visibilidad es de ${visibility} metros y la nubosidad del ${clouds}%`);
        return p;
    }
    iconImage(iconId) {
        const img = document.createElement('img');
        const src = `http://openweathermap.org/img/wn/${iconId}@2x.png`;
        img.setAttribute('src', src);
        img.setAttribute('alt', 'Icono del tiempo');
        return img;
    }
    lastUpdateParagraph(date) {
        const dateLocal = new Date(date).toLocaleString('es-Es');
        const p = document.createElement('p');
        p.append(`La última actualización fue a las ${dateLocal}`);
        return p;
    }
    precipitationParagraph(mode, value) {
        const p = document.createElement('p');
        if (mode = 'no')
            p.append('El modo precipitación está desactivado para esta localidad');
        else if (value != undefined)
            p.append(`Las precipitaciones son de ${value} cm3/m`);
        return p;
    }
}
const apikey = 'ca1dc447b97a035b69872b47ed314659';
const units = 'metric';
const language = 'es';
const places = ['Minas de Riotinto', 'Cofrentes', 'Burgos', 'Nerva', 'Valencia'];
const controller = new Controller(new WeatherServer(apikey), places, units, language);
controller.loadSectionsInView();