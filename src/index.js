// инклюдим js файлы
import { createPopup } from './js/funcs';

// инклюдим функцию хендлбарса
import reviewsListFn from './hbs/reviews-list.hbs';

// инклюдим scss файл
import './style.scss';

const popup = document.getElementById('popup');
const popupCloseBtn = document.getElementById('popup-header__close');
const addBtn = document.getElementById('reviews-form__btn');
const inputName = document.getElementById('reviews-form__input-name');
const inputPlace = document.getElementById('reviews-form__input-place');
const textarea = document.getElementById('reviews-form__textarea');
const popupSuccess = document.getElementById('success-alert__layout');
const successCloseBtn = document.getElementById('success-alert__close');

const reviewsBlock = document.getElementById('reviews');
const reviewsBlockId = reviewsBlock.getAttribute('data-id');

const markersArr = []; // массив с маркерами и координатами
let reviewsArr = []; // массив с отзывами для попапа
let coords; // координаты клика/маркера
// let marker;

const init = () => {

    // Создание карты.
    const myMap = new ymaps.Map('map', {
        center: [50.450458, 30.523460],
        zoom: 16
    });

    // слушаем клики по карте
    myMap.events.add('click', async e => {
        coords = e.get('coords');
        const coordsPosition = e.get('position');

        // открываем попап с надписью про отсутствие отзывов
        createPopup(coordsPosition[0], coordsPosition[1], popup);
        reviewsBlock.innerHTML = "Пока отзывов нет!!!";


        // geocode (адрес по клику)
        const dataAddress = await ymaps.geocode(coords);
        const popupHeaderTitle = document.getElementById('popup-header__title');
        // выводим адрес в шапке popup
        popupHeaderTitle.innerText = dataAddress.geoObjects.get(0).properties.get('metaDataProperty').GeocoderMetaData.Address.formatted;

        // // прослушка клика на маркере
        // marker.events.add('click', e => {
        //     console.log(e);
        // });
    });

    // слушаем клики по кнопке "Добавить" при первом отзыве
    addBtn.addEventListener('click', e => {
        e.preventDefault();
        // уникальное число-id
        let time = new Date().getTime();

        let name = inputName.value;
        let place = inputPlace.value;
        let review = textarea.value;

        if (!name || !place || !review) {
            alert('Заполните все поля формы!');
        } else if (!reviewsBlockId) {
            // создаем новый маркер
            const marker = new ymaps.Placemark(coords);
            // присваиваем ему уникальный id
            marker.properties.set('id', [time]);
            // добавляем маркер на карту
            myMap.geoObjects.add(marker);
            // добавляем созданный маркер в массив
            markersArr.push({
                id: marker.properties.get('id'),
                coords: coords
            });

            let tempArr = [{name, place, review}];
            // записываем в маркер массив из данных формы отзывов
            marker.properties.set('reviews', tempArr);
            // заполняем попап отзывами
            reviewsBlock.innerHTML = reviewsListFn({ reviewsList: tempArr });
            popupSuccess.classList.add('active');
            //скрываем все попапы
            setTimeout( () => {
                popup.classList.remove('active');
                popupSuccess.classList.remove('active');
            }, 2000);

            //очищаем поля ввода
            inputName.value = '';
            inputPlace.value = '';
            textarea.value = '';
        }

    });

};

ymaps.ready(init);

// закрываем popup
popupCloseBtn.addEventListener('click', () => {
    popup.classList.remove('active');
});

// закрываем success
successCloseBtn.addEventListener('click', () => {
    popup.classList.remove('active');
    popupSuccess.classList.remove('active');
});