/*
Документация по работе в шаблоне: 
Документация слайдера: https://swiperjs.com/
Сниппет(HTML): swiper
*/

// Подключаем слайдер Swiper из node_modules
// При необходимости подключаем дополнительные модули слайдера, указывая их в {} через запятую
// Пример: { Navigation, Autoplay }
import Swiper, { Navigation } from 'swiper';
/*
Основниые модули слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Подробнее смотри https://swiperjs.com/
*/

// Стили Swiper
// Базовые стили
import "../../scss/base/swiper.scss";
// Полный набор стилей из scss/libs/swiper.scss
// import "../../scss/libs/swiper.scss";
// Полный набор стилей из node_modules
// import 'swiper/css';

// Инициализация слайдеров
function initSliders() {
	if (document.querySelector('.slider-one, .slider-nav')) { // Указываем скласс нужного слайдера
		// Перечень слайдеров
		const slider = document.querySelector('.slider-one');
		const sliderNav = document.querySelector('.slider-nav');
		
		

		let mySwiperNav = new Swiper(sliderNav, {
			slidesPerView: 4,
			loopedSlides: 4,
			freeMode: true,
			loop: true,
			//отступ между слайдами лучше задать так
			// spaceBetween: 20,
		});

		let mySwiper = new Swiper(slider, {
			// spaceBetween: 10,
			loopedSlides: 4,
			loop: true,
			thumbs: {
				swiper: mySwiperNav,
			}
		});

		const thumbs = document.querySelectorAll('.slider-nav .swiper-slide');
		thumbs.forEach(el => el.addEventListener('click', function () {
			mySwiper.slideTo(el.dataset.swiperSlideIndex);
			
		}));

	
	}
	
}



// Скролл на базе слайдера (по классу swiper_scroll для оболочки слайдера)
function initSlidersScroll() {
	// Добавление классов слайдера
	// при необходимости отключить
	bildSliders();

	let sliderScrollItems = document.querySelectorAll('.swiper_scroll');
	if (sliderScrollItems.length > 0) {
		for (let index = 0; index < sliderScrollItems.length; index++) {
			const sliderScrollItem = sliderScrollItems[index];
			const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
			const sliderScroll = new Swiper(sliderScrollItem, {
				observer: true,
				observeParents: true,
				direction: 'vertical',
				slidesPerView: 'auto',
				freeMode: {
					enabled: true,
				},
				scrollbar: {
					el: sliderScrollBar,
					draggable: true,
					snapOnRelease: false
				},
				mousewheel: {
					releaseOnEdges: true,
				},
			});
			sliderScroll.scrollbar.updateSize();
		}
	}
}

window.addEventListener("load", function (e) {
	// Запуск инициализации слайдеров
	initSliders();
	// Запуск инициализации скролла на базе слайдера (по классу swiper_scroll)
	//initSlidersScroll();
});