// инклюдим js файлы
import { createPopup } from './js/funcs';

// инклюдим scss файл
import './style.scss';

const popup = document.getElementById('popup');
const closeBtn = document.getElementById('popup-header__close');

const init = () => {
    // Создание карты.
    const myMap = new ymaps.Map('map', {
        center: [50.450458, 30.523460],
        zoom: 16
    });

    // слушаем клики по карте
    myMap.events.add('click', async e => {
        const coords = e.get('coords');
        const coordsPosition = e.get('position');

        // открываем попап
        createPopup(coordsPosition[0], coordsPosition[1], popup);

        const placemark = new ymaps.Placemark(coords, {}, {
            // Задаем стиль метки (метка в виде круга).
            preset: "islands#circleDotIcon",
            // Задаем цвет метки (в формате RGB).
            iconColor: '#ff0000'
        });

        // прослушка клика на маркере
        placemark.events.add('click', e => {
            console.log(e);
        });

        // добавляем иконку на карту
        myMap.geoObjects.add(placemark);

        // geocode (адрес по клику)
        const data = await ymaps.geocode(coords);
        let address = data.geoObjects.get(0).properties.get('metaDataProperty').GeocoderMetaData.Address.formatted;

        console.log(data.geoObjects.get(0).properties.get('metaDataProperty').GeocoderMetaData.Address.formatted);

    });
};

ymaps.ready(init);


// закрываем popup
closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
});
