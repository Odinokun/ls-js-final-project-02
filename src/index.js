// инклюдим js файлы
import { createPopup } from './js/funcs';

// инклюдим функцию хендлбарса
import reviewsListFn from './hbs/reviews-list.hbs';

// инклюдим scss файл
import './style.scss';

const popup = document.getElementById('popup');
const popupCloseBtn = document.getElementById('popup-header__close');
const addBtn = document.getElementById('reviews-form__btn');
const popupSuccess = document.getElementById('success-alert__layout');
const successCloseBtn = document.getElementById('success-alert__close');

let inputName = document.getElementById('reviews-form__input-name');
let inputPlace = document.getElementById('reviews-form__input-place');
let textarea = document.getElementById('reviews-form__textarea');

const reviewsBlock = document.getElementById('reviews');

let time = new Date().getTime(); // уникальное число-id
let markersArr = []; // массив с маркерами, координатами и отзывами
let coords; // координаты клика/маркера

let myGeoObjects = []; // Создадим массив геообъектов.

const init = () => {
    // Создание карты.
    const myMap = new ymaps.Map('map', {
        center: [50.450458, 30.523460],
        zoom: 16
    });

    // Создадим кластеризатор.
    let clusterer = new ymaps.Clusterer({
        // запретим приближать карту при клике на кластеры
        clusterDisableClickZoom: true,
        // Используем макет "карусель"
        clusterBalloonContentLayout: "cluster#balloonCarousel",
        // Запрещаем зацикливание списка при постраничной навигации.
        clusterBalloonCycling: false,
        // Настройка внешнего вида панели навигации.
        // Элементами панели навигации будут маркеры.
        clusterBalloonPagerType: "marker",
        // Количество элементов в панели.
        clusterBalloonPagerSize: 6,
        // не скрывать маркер при всплытии балуна
        hideIconOnBalloonOpen: false
    });
    myMap.geoObjects.add(clusterer); // добавляем кластеризатор на карту

    // слушаем клики по карте
    myMap.events.add('click', async e => {
        coords = e.get('coords'); // координаты клика (географические)
        let coordsPosition = e.get('position'); // координаты клика (относительно окна)
        
        // выводим адрес в шапке попапа
        geocodeAddress(coords);
        // открываем попап с надписью про отсутствие отзывов
        createPopup(coordsPosition[0], coordsPosition[1], popup);
        reviewsBlock.innerHTML = "Пока отзывов нет!!!";
    });

    // слушаем клики по геообъектам
    myMap.geoObjects.events.add('click', e => {
        if (e.get('target').options._name === 'geoObject') {
            e.preventDefault(); // отменяем всплытие балуна

            let coordsPosition = e.get('position'); // координаты клика (относительно окна)
            coords =  e.get('target').geometry._coordinates; // координаты текущего маркера

            // перебираем массив маркеров и ищем совпадение по координатам
            markersArr.forEach(function(item) {
                if (item.coords === coords) {
                    // заполняем попап отзывами
                    reviewsBlock.innerHTML = reviewsListFn({ reviewsList: item.reviews });
                }
            });
            // выводим адрес в шапке попапа
            geocodeAddress(coords);


            // открываем попап
            createPopup(coordsPosition[0], coordsPosition[1], popup);
        } else if (e.get('target').options._name === 'cluster') {
            console.log('this is cluster');
        }

    });

    // слушаем клики по кнопке "Добавить"
    addBtn.addEventListener('click', e => {
        e.preventDefault();

        if (!inputName.value || !inputPlace.value || !textarea.value) {
            alert('Заполните все поля формы!');
        } else {
            let count = 0;
            // перебираем массив маркеров и ищем совпадение по координатам
            markersArr.forEach(function(item) {
                if (item.coords === coords) {
                    count++;
                }
            });

            if (count === 0) { //если не нашли совпадения
                // создаем новый маркер
                let marker = new ymaps.Placemark(coords);

                saveFirstReview(marker);
                //очищаем поля ввода
                clearForm();
            } else { //если совпадения есть
                saveNextReviews();
                //очищаем поля ввода
                clearForm();
            }
        }
    });

    // сохранение первого отзыва
    function saveFirstReview(marker) {
        // создаем массив с данными из формы
        let formDataArr = [{
            name: inputName.value,
            place: inputPlace.value,
            review: textarea.value
        }];

        // добавляем созданный маркер в массив маркеров
        markersArr.push({
            id: marker.properties.get('id'),
            coords: coords,
            reviews: formDataArr
        });

        let objectMarker = new ymaps.GeoObject({
            geometry: { type: "Point", coordinates: coords },
            properties: {
                balloonContentHeader: inputPlace.value,
                balloonContentBody: 'address',
                balloonContentFooter: textarea.value
            }
        });

        myMap.geoObjects.add(objectMarker);
        clusterer.add(objectMarker);

        // заполняем попап отзывами
        reviewsBlock.innerHTML = reviewsListFn({ reviewsList: formDataArr });
        popupSuccess.classList.add('active');
        //скрываем все попапы
        setTimeout( () => {
            popup.classList.remove('active');
            popupSuccess.classList.remove('active');
        }, 1500);
    }

    // сохранение последующих отзывов
    function saveNextReviews() {
        // создаем массив с данными из формы
        let formDataArr = [{
            name: inputName.value,
            place: inputPlace.value,
            review: textarea.value
        }];

        // перебираем массив маркеров и ищем совпадение по координатам
        markersArr.forEach(function(item) {
            if (item.coords === coords) {
                // добавляем новые отзывы к старым
                item.reviews = item.reviews.concat(formDataArr);
            }
        });

        // перебираем массив маркеров и ищем совпадение по координатам
        markersArr.forEach(function(item) {
            if (item.coords === coords) {
                // заполняем попап отзывами
                reviewsBlock.innerHTML = reviewsListFn({ reviewsList: item.reviews });
            }
        });

        popupSuccess.classList.add('active');
        //скрываем все попапы
        setTimeout( () => {
            popup.classList.remove('active');
            popupSuccess.classList.remove('active');
        }, 1500);
    }
};

ymaps.ready(init);

// определение адреса по координатам
async function geocodeAddress(xxx) {
    // geocode (определяем адрес по координатам клика)
    const dataAddress = await ymaps.geocode(xxx);
    const popupHeaderTitle = document.getElementById('popup-header__title');
    // выводим адрес в шапке popup
    popupHeaderTitle.innerText = dataAddress.geoObjects.get(0).properties.get('metaDataProperty').GeocoderMetaData.Address.formatted;
}

// очистка полей формы
function clearForm() {
    inputName.value = '';
    inputPlace.value = '';
    textarea.value = '';
}

// закрываем popup
popupCloseBtn.addEventListener('click', () => {
    popup.classList.remove('active');
});

// закрываем success
successCloseBtn.addEventListener('click', () => {
    popupSuccess.classList.remove('active');
});