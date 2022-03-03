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
const getGoods = () => {
    const links = document.querySelectorAll('.content__nav-link')

    //Отрисовываем карточки товаров 
    const renderGoods = (goods) => {
        const goodsContainer = document.querySelector('.content__products')
        goodsContainer.innerHTML = ""
        //перебираем массив goods
        goods.forEach(good => {
            const goodBlock = document.createElement('div')
            goodBlock.classList.add('card')
            goodBlock.innerHTML = `
                 <div class="card__bg" style="background-image: url('img/bg-photo.jpg'); "></div>
                        <div class="card__inner">
                           <a href="https://olga-evdokimova.github.io/shop-template/single.html" class="card__image ">
                          
                             <img src="img/${good.img}" alt="${good.name}">
                             <span class="card__badge ${good.label ? null : 'none'}">${good.label}</span>
                           </a>
                            <div class="card__content">
                            <a href="https://olga-evdokimova.github.io/shop-template/single.html">
                              <h4 class="card__content-title">${good.name}</h4>
                            </a>
                            <div class="card__content-priсe rub">${good.price}</div>
                            <div class="card__content-status">${good.descriptions}</div>
                            <a href="" class="card__content-cart" data-id="${good.id}"><img src="img/cart.svg" alt=""></a>
                        </div>
                    </div>
            `
            //обращаемся к контейнеру и в каждом переборе используем метод append которай добавляет каждый очередной goodBlock (тоесть выводит все карточки сколько их отфильтровалось )
            goodsContainer.append(goodBlock)

        })
    }
    //функция работы с массивом данных data. получаем весь массив данных из json файла
    const getData = (value, category) => {
        fetch('https://test-a65c0-default-rtdb.firebaseio.com/db.json')
            .then((res) => res.json())
            .then((data) => {
                //если категория есть то возвращаем фильтрованную дату(массив данных) , если категории нет то возвращаем всю дату(массив данных)
                const array = category ? data.filter((item) => item[category] === value) : data
                localStorage.setItem('goods', JSON.stringify(array))
                if (localStorage.getItem('goods')) {
                    renderGoods(JSON.parse(localStorage.getItem('goods')))
                }
            })
    }
    let activeLink;
    //перебираем кнопки(категории товаров) и навешиваем на них клик
    links.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault()
            activeLink.classList.remove("_active")
            activeLink = link
            activeLink.classList.add("_active")
            //получаем текстовое содержимое кликнутой ссылки
            const linkValue = link.textContent
            const category = link.dataset.field
            getData(linkValue, category)
        })
    })
    activeLink = links[0]
    activeLink.classList.add("_active")

    if (localStorage.getItem('goods')) {
        renderGoods(JSON.parse(localStorage.getItem('goods')))
    }

}
getGoods()





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

