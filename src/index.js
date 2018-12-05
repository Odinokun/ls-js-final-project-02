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
const inputName = document.getElementById('reviews-form__input-name');
const inputPlace = document.getElementById('reviews-form__input-place');
const textarea = document.getElementById('reviews-form__textarea');
const markers = [];

let reviewsArr = [
    // {
    //     id: '001',
    //     date: '2018-12-02',
    //     name: 'Odinokun',
    //     place: 'Ocean Plasa',
    //     review: 'Lorem ipsum dolor sit amet, ipsum dolor sit amet, consectetur adipisicing elit. Dolore, reiciendis!'
    // }, {
    //     id: '001',
    //     date: '2218-11-30',
    //     name: 'I. Mask',
    //     place: 'Marsian city',
    //     review: 'Есть ли жизнь на Марсе? Нет ли жизни на Марсе? Науке это не известно.'
    // }, {
    //     id: '002',
    //     date: '2018-10-14',
    //     name: 'Ozzy',
    //     place: 'Ozzmozes',
    //     review: 'Du hast mich'
    // }
];

const init = () => {
    let coords;

    // Создание карты.
    const myMap = new ymaps.Map('map', {
        center: [50.450458, 30.523460],
        zoom: 16
    });

    // слушаем клики по карте
    myMap.events.add('click', async e => {
        coords = e.get('coords');
        const coordsPosition = e.get('position');

        // открываем попап
        createPopup(coordsPosition[0], coordsPosition[1], popup);
        // наполняем попап отзывами
        // reviews.innerHTML = reviewsListFn({ reviewsList: reviewsArr }); /////////temp!!!!!!!!!!!!!!!!!!


        // прослушка клика на маркере
        // marker.events.add('click', e => {
        //     console.log(e);
        // });

        // geocode (адрес по клику)
        const data = await ymaps.geocode(coords);
        const popupHeaderTitle = document.getElementById('popup-header__title');
        const address = data.geoObjects.get(0).properties.get('metaDataProperty').GeocoderMetaData.Address.formatted;

        popupHeaderTitle.innerText = address;

    });

    
    addBtn.addEventListener('click', e => {
        e.preventDefault();
        // уникальное число-id
        let time = new Date().getTime();
        let name = inputName.value;
        let place = inputPlace.value;
        let review = textarea.value;
        let reviewsArr;
        


        if (!name || !place || !review) {
            alert('Заполните все поля формы!');
        } else {
            // добавляем маркер на карту
            const marker = new ymaps.Placemark(coords);
            myMap.geoObjects.add(marker);

            // проверка на присутствие отзывов
            if (marker.properties.get('reviews') === undefined) {
                reviewsArr = [];
                console.log('0 - no reviews');
            } else {
                reviewsArr = marker.properties.get('reviews');
                console.log('1 - ', reviewsArr);
            }

            // пушим в массив новый отзыв
            reviewsArr.push({name, place, review});
            // перезаписываем в маркер новый массив отзывов
            marker.properties.set('reviews', reviewsArr);
            // заполняем попап отзывами
            reviews.innerHTML = reviewsListFn({ reviewsList: reviewsArr });

            // присваиваем ему уникальный id
            // marker.properties.set('id', [time]);
            // добавляем созданный маркер в массив
            // markers.push(marker);

            console.log('отправленный массив - ', marker.properties.get('reviews'));

            //очищаем поля ввода
            inputName.value = '';
            inputPlace.value = '';
            textarea.value = '';
        }
    });
};

ymaps.ready(init);


// закрываем popup
closeBtn.addEventListener('click', () => {
    popup.classList.remove('active');
});
