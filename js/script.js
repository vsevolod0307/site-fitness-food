// 'use strict';

window.addEventListener('DOMContentLoaded', () => {
    
    const tabContent = document.querySelectorAll('.tabcontent'),
          tabNav = document.querySelector('.tabheader__items'),
          tabLink = document.querySelectorAll('.tabheader__item');

    function hideTabs() {
        tabContent.forEach(item => {
            item.style.display = 'none';
        });

        tabLink.forEach(tab => {
            tab.classList.remove('tabheader__item_active');
        });
    }

    hideTabs();

    function showTabs(e = 0) {
        tabContent[e].style.display = 'block';
        tabLink[e].classList.add('tabheader__item_active');
    }

    showTabs();

    tabNav.addEventListener('click', (e) => {
        const target = e.target;
        if(target && target.classList.contains('tabheader__item')) {
            tabLink.forEach((item, i) => {
                if(target == item) {
                    hideTabs();
                    showTabs(i);
                }
            });
        }
    });

    //timer

    const deadline = '2021-02-16';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t/(1000*60*60*24)),
            hours = Math.floor((t/(1000*60*60) % 24)),
            minutes = Math.floor((t/1000/60) % 60),
            seconds = Math.floor((t/1000) % 60);
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if(num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector);
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if(t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    //modal

    const btnModal = document.querySelectorAll('[data-modal]'),
        modalClose = document.querySelector('[data-close]'),
        modal = document.querySelector('.modal');

    function showModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function hideModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    btnModal.forEach(btn => {
        btn.addEventListener('click', showModal);
    });

    modalClose.addEventListener('click', hideModal);

    modal.addEventListener('click', (e) => {
        if(e.target === modal) {
            hideModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if(e.code === 'Escape') {
            hideModal();
        }
    });

    const modalTimerId = setTimeout(showModal, 4000);

    function showModalByScroll() {
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            showModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll); 

    //slider

    const sliderInner = document.querySelector('.offer__slider-inner'),
        prevSlide = document.querySelector('.offer__slider-prev'),
        nextSlide = document.querySelector('.offer__slider-next'),
        sliderWrapper = document.querySelector('.offer__slider-wrapper'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        width = window.getComputedStyle(sliderWrapper).width,
        slideContent = document.querySelectorAll('.offer__slide'),
        offerSlider = document.querySelector('.offer__slider');

    let offset = 0,
        slideIndex = 1;

    function slideTotalIndex(content, total, current, i) {
        if(content.length < 10) {
            total.textContent = `0${content.length}`;
            current.textContent = `0${i}`;
        } else {
            total.textContent = content.length;
            current.textContent = i;
        }
    }

    slideTotalIndex(slideContent, total, current, slideIndex);

    sliderInner.style.width = 100 * slideContent.length + '%';
    sliderInner.style.display = 'flex';
    sliderInner.style.transition = '1s all';
    sliderWrapper.style.overflow = 'hidden';

    slideContent.forEach(slide => {
        slide.style.width = width;
    });

    offerSlider.style.position = 'relative';

    const indicators = document.createElement('ol'),
        dots = [];
    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    offerSlider.append(indicators);

    for(let i = 0; i < slideContent.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
        if(i == 0) {
            dot.style.backgroundColor = 'blue';
        }
        indicators.append(dot);
        dots.push(dot);
    }

    function deleteNotDigits(str) {
        return +str.replace(/\D/g, "");
    }

    function colorDots(arr) {
            arr.forEach(dot => dot.style.backgroundColor = '#fff');
            arr[slideIndex - 1].style.backgroundColor = 'blue';
    }

    function currentIndex() {
        if(slideContent.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    }

    function currentSlideIndexPrev() {
        if(slideIndex == 1) {
            slideIndex = slideContent.length;
        } else {
            slideIndex--;
        }
        currentIndex();
    }

    function currentSlideIndexNext() {
        if(slideIndex == slideContent.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }
        currentIndex();
    }

    nextSlide.addEventListener('click', () => {
        if(offset == deleteNotDigits(width) * (slideContent.length - 1)) {
            offset = 0;
        } else {
            offset += deleteNotDigits(width);
        }

        sliderInner.style.transform = `translateX(-${offset}px)`;

        currentSlideIndexNext();
        colorDots(dots);
    });

    prevSlide.addEventListener('click', () => {
        if(offset == 0) {
            offset = deleteNotDigits(width) * (slideContent.length - 1);
        } else {
            offset -= deleteNotDigits(width);
        }

        sliderInner.style.transform = `translateX(-${offset}px)`;

        currentSlideIndexPrev();
        colorDots(dots);
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = deleteNotDigits(width) * (slideTo - 1);
            sliderInner.style.transform = `translateX(-${offset}px)`;
            currentIndex();
            colorDots(dots);
        });
    });

    //calc

    const result = document.querySelector('.calculating__result span');

    let sex, height, weight, age, ratio;

    if(localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }
    
    if(localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if(elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }
            if(elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function calcTotal() {
        if(!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____';
            return;
        }

        if(sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    function getStaticInformation(parentSelector, activeClass) {
        const elements = document.querySelectorAll(`${parentSelector} div`);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if(e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'))
                }
    
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                }); 
    
                e.target.classList.add(activeClass);

                calcTotal();
            });
        });
    }

    getStaticInformation('#gender', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if(input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            }

            switch(input.getAttribute('id')){
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }

            calcTotal();
        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');

});