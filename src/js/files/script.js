// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";


(async () => {
    //Страница показывается после полной загрузки с задержкой 5сек
    // window.addEventListener("load", function () {
    //     // setTimeout(function () {
    //     document.body.style.cssText = 'opacity: 1; visibility: visible; transition: opacity 1.2s ease 0s;'
    //     // }, 500);
    // });

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
        const gallerySource = document.querySelector('.product-gallery__img source');
        
        let activeItem;
        const gallery = () => {
            galleryItems.forEach(item => {
                // для каждого конкретного
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    activeItem.classList.remove("active")
                    activeItem = item
                    activeItem.classList.add("active")
                    galleryImg.src = activeItem.dataset.src;
                    gallerySource.srcset = activeItem.dataset.srcset;
                  });
            })
        }
       
        gallery()
        activeItem = galleryItems[0]
        activeItem.classList.add("active")
    }
    //==========================================================


    //СОРТИРОВКА И ВЫВОД КАРТОЧЕК ТОВАРОВ===========================
    // добавить спиннер
    //1)запрос в базу данных, получаем весь массив
    const response = await fetch('https://sinuous-concept-323917-default-rtdb.firebaseio.com/db.json')
    const data = await response.json()
    // убираем спиннер


    const links = document.querySelectorAll('.content__nav-link')
    const goodsContainer = document.querySelector('.content__products')

    //Отрисовываем карточки товаров 
    const renderGoods = (goods) => {
        //перебираем массив goods
        goodsContainer.innerHTML = ""
        goods.forEach(good => {
            const goodBlock = document.createElement('div')

            goodBlock.classList.add('card')
            goodBlock.innerHTML = `
                 <div class="card__bg" style="background-image: url('img/bg-photo.jpg'); "></div>
                        <div class="card__inner">
                           <a href="https://olga-evdokimova.github.io/shop-template/single.html" class="card__image -ibg">
                          
                             <img src="./img/imgCard/${good.img}" alt="${good.name}">
                             <span class="card__badge green ${good.label ? null : 'none'}">${good.label}</span>
                             <span class="card__badge red ${good.badge ? null : 'none'}">${good.badge}</span>
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

    //2)получаем массив выбранной категории
    const renderCategory = () => {
        let goods = []

        for (let i = 0; i < data.length; i++) {
            const item = data[i]
            //если открытая категория не равна все_товары(вся база) и выбранная категория не равна все_товары(вся база)то...
            // continue - цикл не прерывается, а переходит к следующей итерации
            if (openedCategory !== "все_товары" && item.category !== openedCategory) continue
            //Длина массива больше или равна cardsCount то...
            //break - Выйти из цикла при вычислении условия в false.
            if (goods.length >= cardsCount) break

            goods.push(item)
        }

        renderGoods(goods)
    }

    //Открытая категория
    let openedCategory = "все_товары"

    //Активная кнопка, добавляется и убирается класс
    let activeLink;
    //3)ПЕребираем все кнопки с категориями
    links.forEach((link) => {
        //по клику выбираем конкретную категорию
        link.addEventListener('click', (e) => {
            e.preventDefault()
            //Активная кнопка, добавляется и убирается класс
            activeLink.classList.remove("_active")
            activeLink = link
            activeLink.classList.add("_active")

            //получаем текстовое содержимое кликнутой ссылки
            const categoryName = link.dataset.category
            // Поменялась открытая категория
            openedCategory = categoryName || "все_товары"
            //сразу выводится 3 карточки
            cardsCount = 3
            showMore.style.display = 'block'
            renderCategory()
        })

    })
    //Активная кнопка, добавляется и убирается класс
    activeLink = links[0]
    activeLink.classList.add("_active")

    //Кнопка ПОКАЗАТЬ ЕЩЕ========================
    const showMore = document.querySelector('.content__btn')
    //Клик по кнопке добавляет по 3 карточки 
    let cardsCount = 3
    showMore.addEventListener('click', (e) => {
        cardsCount = cardsCount + 3
        renderCategory()

        const a = openedCategory === "все_товары" ? data.length : data.filter((item) =>
            item.category === openedCategory).length

        if (a <= cardsCount) {
            showMore.style.display = 'none'
        }

    })
    renderCategory()

    //=========================================================================================
    const addToCart = (id) => {
        const clicked = data.find(item => item.id === id)//обьект товара
        const cart = clicked ? data : []
        console.log(clicked);
        console.log(cart);
    }
    const cardBtns = document.querySelectorAll('.card__content-cart')

    cardBtns.forEach((cardBtn) => {
        cardBtn.addEventListener('click', (e) => {
            e.preventDefault()
            const cardBtnId = cardBtn.dataset.id//id кнопки 
            addToCart(cardBtnId)
        })

    })

})()


//===============================================================================
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

