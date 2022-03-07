(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    if ("error" !== this._dataValue) {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Ой ой, не заполнен атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && 9 == e.which && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") ? true : false;
                if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                } else this.popupLogging(`Ой ой, такого попапа нет.Проверьте корректность ввода. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && 0 === focusedIndex) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
    }
    modules_flsModules.popup = new Popup({});
    let addWindowScrollEvent = false;
    function headerScroll() {
        if (document.querySelector("nav.content__nav")) {
            addWindowScrollEvent = true;
            const nav = document.querySelector("nav.content__nav");
            const navShow = nav.hasAttribute("data-scroll-show");
            const navShowTimer = nav.dataset.scrollShow ? nav.dataset.scrollShow : 500;
            const startPoint = nav.dataset.scroll ? nav.dataset.scroll : 1;
            let scrollDirection = 0;
            let timer;
            document.addEventListener("windowScroll", (function(e) {
                const scrollTop = window.scrollY;
                clearTimeout(timer);
                if (scrollTop >= startPoint) {
                    !nav.classList.contains("_nav-scroll") ? nav.classList.add("_nav-scroll") : null;
                    if (navShow) {
                        if (scrollTop > scrollDirection) nav.classList.contains("_nav-show") ? nav.classList.remove("_nav-show") : null; else !nav.classList.contains("_nav-show") ? nav.classList.add("_nav-show") : null;
                        timer = setTimeout((() => {
                            !nav.classList.contains("_nav-show") ? nav.classList.add("_nav-show") : null;
                        }), navShowTimer);
                    }
                } else {
                    nav.classList.contains("_nav-scroll") ? nav.classList.remove("_nav-scroll") : null;
                    if (navShow) nav.classList.contains("_nav-show") ? nav.classList.remove("_nav-show") : null;
                }
                scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
            }));
        }
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    (async () => {
        if (document.querySelector(".content__nav")) {
            const scrollNavFunc = () => {
                const contentNav = document.querySelector(".content__nav");
                const contentNavTop = contentNav.offsetTop;
                contentNav.setAttribute("data-scroll", `${contentNavTop}`);
            };
            scrollNavFunc();
        }
        window.addEventListener("orientationchange", (function() {
            window.location.reload();
        }));
        if (document.querySelector(".product-gallery__img")) {
            const galleryItems = document.querySelectorAll(".product-gallery__items a");
            const galleryImg = document.querySelector(".product-gallery__img img");
            let activeItem;
            const gallery = () => {
                galleryItems.forEach((item => {
                    item.addEventListener("click", (e => {
                        e.preventDefault();
                        activeItem.classList.remove("active");
                        activeItem = item;
                        activeItem.classList.add("active");
                        galleryImg.src = activeItem.dataset.src;
                    }));
                }));
            };
            gallery();
            activeItem = galleryItems[0];
            activeItem.classList.add("active");
        }
        const response = await fetch("https://test-a65c0-default-rtdb.firebaseio.com/db.json");
        const data = await response.json();
        const links = document.querySelectorAll(".content__nav-link");
        const goodsContainer = document.querySelector(".content__products");
        const renderGoods = goods => {
            goodsContainer.innerHTML = "";
            goods.forEach((good => {
                const goodBlock = document.createElement("div");
                goodBlock.classList.add("card");
                goodBlock.innerHTML = `\n                 <div class="card__bg" style="background-image: url('img/bg-photo.jpg'); "></div>\n                        <div class="card__inner">\n                           <a href="https://olga-evdokimova.github.io/shop-template/single.html" class="card__image -ibg">\n                          \n                             <img src="img/${good.img}" alt="${good.name}">\n                             <span class="card__badge green ${good.label ? null : "none"}">${good.label}</span>\n                             <span class="card__badge red ${good.badge ? null : "none"}">${good.badge}</span>\n                           </a>\n                            <div class="card__content">\n                            <a href="https://olga-evdokimova.github.io/shop-template/single.html">\n                              <h4 class="card__content-title">${good.name}</h4>\n                            </a>\n                            <div class="card__content-priсe rub">${good.price}</div>\n                            <div class="card__content-status">${good.descriptions}</div>\n                            <a href="" class="card__content-cart" data-id="${good.id}"><img src="img/cart.svg" alt=""></a>\n                        </div>\n                    </div>\n            `;
                goodsContainer.append(goodBlock);
            }));
        };
        const renderCategory = () => {
            let goods = [];
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                if ("все_товары" !== openedCategory && item.category !== openedCategory) continue;
                if (goods.length >= cardsCount) break;
                goods.push(item);
            }
            renderGoods(goods);
        };
        let openedCategory = "все_товары";
        let activeLink;
        links.forEach((link => {
            link.addEventListener("click", (e => {
                e.preventDefault();
                activeLink.classList.remove("_active");
                activeLink = link;
                activeLink.classList.add("_active");
                const categoryName = link.dataset.category;
                openedCategory = categoryName || "все_товары";
                cardsCount = 3;
                showMore.style.display = "block";
                renderCategory();
            }));
        }));
        activeLink = links[0];
        activeLink.classList.add("_active");
        const showMore = document.querySelector(".content__btn");
        let cardsCount = 3;
        showMore.addEventListener("click", (e => {
            cardsCount += 3;
            renderCategory();
            const a = "все_товары" === openedCategory ? data.length : data.filter((item => item.category === openedCategory)).length;
            if (a <= cardsCount) showMore.style.display = "none";
        }));
        renderCategory();
    })();
    window["FLS"] = true;
    isWebp();
    menuInit();
    headerScroll();
})();