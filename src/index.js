// инклюдим scss файл
import './style.scss';

const init = () => {
    // Создание карты.
    const myMap = new ymaps.Map('map', {
        center: [50.450458, 30.523460],
        zoom: 16
    });
};

ymaps.ready(init);
