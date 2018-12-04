// инклюдим js файлы
import { createPopup } from './js/funcs';

// инклюдим функцию хендлбарса
import reviewsListFn from './hbs/reviews-list.hbs';

// инклюдим scss файл
import './style.scss';

const popup = document.getElementById('popup');
const closeBtn = document.getElementById('popup-header__close');
const addBtn = document.getElementById('reviews-form__btn');
const reviews = document.getElementById('reviews');

const reviewsArr = [
    {
        id: '001',
        date: '2018-12-02',
        name: 'Odinokun',
        place: 'Ocean Plasa',
        review: 'Lorem ipsum dolor sit amet, ipsum dolor sit amet, consectetur adipisicing elit. Dolore, reiciendis!'
    }, {
        id: '001',
        date: '2218-11-30',
        name: 'I. Mask',
        place: 'Marsian city',
        review: 'Есть ли жизнь на Марсе? Нет ли жизни на Марсе? Науке это не известно.'
    }, {
        id: '002',
        date: '2018-10-14',
        name: 'Ozzy',
        place: 'Ozzmozes',
        review: 'Du hast mich'
    }
];

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
        // наполняем попап отзывами
        reviews.innerHTML = reviewsListFn({ reviewsList: reviewsArr }); /////////temp!!!!!!!!!!!!!!!!!!

        const placemark = new ymaps.Placemark(coords);

        // прослушка клика на маркере
        placemark.events.add('click', e => {
            console.log(e);
        });

        // добавляем иконку на карту
        // addBtn.addEventListener('click', e => {
        //     e.preventDefault();
        // });

        myMap.geoObjects.add(placemark);

        // geocode (адрес по клику)
        const data = await ymaps.geocode(coords);
        const popupHeaderTitle = document.getElementById('popup-header__title');
        const address = data.geoObjects.get(0).properties.get('metaDataProperty').GeocoderMetaData.Address.formatted;

        popupHeaderTitle.innerText = address;

    });
};

ymaps.ready(init);



// закрываем popup
closeBtn.addEventListener('click', () => {
    popup.classList.remove('active');
});
