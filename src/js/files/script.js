// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";


//Страница показывается после загрузки DOM
// document.addEventListener("DOMContentLoaded", function (event) {
//     document.body.style.cssText = 'opacity: 1; visibility: visible; transition: opacity 1.2s ease 0s;'

// });
//Страница показывается после полной загрузки с задержкой 5сек
window.addEventListener("load", function () {
    setTimeout(function () {
        document.body.style.cssText = 'opacity: 1; visibility: visible; transition: opacity 1.2s ease 0s;'
    }, 500);
});

//если на странице есть такой класс, выполняй функцию
if (document.querySelector('.content__nav')) {
    //==============================================================
    //Дополнение к "функционалу добавления классов к хедеру при прокрутке" для блока навигации-категорий.
    //Получаем расстояние до блока, вносим эту цифру в дата атрибут data-scroll
    //при скролле вниз блок навигации приклеется к хедеру когда он дойдет до самого верха страницы
    const scrollNavFunc = () => {
        const contentNav = document.querySelector('.content__nav');
        const contentNavTop = contentNav.offsetTop;//расстояние до блока
        contentNav.setAttribute("data-scroll", `${contentNavTop}`);
    }
    scrollNavFunc();
}


//==============================================================
//Обновление страницы при повороте экрана================
window.addEventListener("orientationchange", function () {
    window.location.reload(); //перезагрузка страницы
    // const orientation = screen.orientation; //показывает текущую ориентацию экрана
});
//==============================================================


//Галерея, переключение катринок========================================
//если на странице есть такой класс, выполняй функцию
if (document.querySelector('.product-gallery__img')) {
    const galleryItems = document.querySelectorAll('.product-gallery__items a');
    const galleryImg = document.querySelector('.product-gallery__img img');

    let activeItem;
    const gallery = () => {
        galleryItems.forEach(item => {
            // для каждого кнкретного
            item.addEventListener('click', (e) => {
                e.preventDefault();
                activeItem.classList.remove("active")
                activeItem = item
                activeItem.classList.add("active")
                galleryImg.src = activeItem.dataset.src;

            });
        })
    }

    gallery()
    activeItem = galleryItems[0]
    activeItem.classList.add("active")
}
//===================================================

// const popupFun = () => {
//     const popupBtn = document.querySelector('.product-select__btn')
//     const popup = document.querySelector('.popup')
//     const popupClose = document.querySelector('.popup__close')
//     console.log(popupBtn);
//     console.log(popup);

//     // Прослушиваем клик на кнопке Открытия, и Открываем модалку
//     popupBtn.addEventListener('click', function () {
//         popup.classList.add('popup_show');
//         document.documentElement.classList.add('popup_show', 'lock');
//     })
//     // Прослушиваем клик на кнопке Закрытия, и Закрываем модалку
//     popupClose.addEventListener('click', function () {
//         popup.classList.remove('popup_show');
//         document.documentElement.classList.remove('popup_show', 'lock');
//     });

//     popup.addEventListener('click', function () {
//        // document.documentElement.classList.remove('popup_show', 'lock');
//     })

//     // popup.querySelector('.popup__wrapper').addEventListener('click', function (e) {
//     //     e.stopPropagation();
//     // })

// }
// popupFun()

