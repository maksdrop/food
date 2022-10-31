'use strict';

// Btn

const contentElement = document.querySelectorAll('.tabcontent');
const tabs = document.querySelectorAll('.tabheader__item');
const tabsParent = document.querySelector('.tabheader__items');

const hideContent = () => {
  contentElement.forEach(item => {
    item.style.display = 'none';
  });

  tabs.forEach(item => {
      item.classList.remove('tabheader__item_active');
    })
}

const showContent = (i = 0) => {
  contentElement[i].style.display = 'block';
  tabs[i].classList.add('tabheader__item_active');
}

hideContent();
showContent();

tabsParent.addEventListener('click', (evt) => {
  const target = evt.target
  if (target && target.classList.contains('tabheader__item')) {
    tabs.forEach((item, i) => {
      if (target == item) {
        hideContent();
        showContent(i);
      }
    })
  }

  
})


// Timer

const endDate = '2022-11-11';

const getTimeRemaining = (endTime) => {
  let days, hours, minutes, seconds;
  const time = Date.parse(endTime) - Date.parse(new Date());

  if (time <= 0) {
    days = 0;
    hours = 0;
    minutes = 0;
    seconds = 0;
  } else {
    days = Math.floor(time / (1000 * 60 * 60 * 24));
    hours = Math.floor(time / (1000 * 60 * 60) % 24);
    minutes = Math.floor(time / (1000 * 60) % 60);
    seconds = Math.floor(time / 1000 % 60)
  }

  return {
    'total': time,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  }
}

const getZero = (time) => {
  if (time >= 0 && time < 10) {
    return `0${time}`;
  } else {
    return time;
  }
}

const setTimer = (endTime, selector) => {
  const timer = document.querySelector(selector);
  const days = timer.querySelector('#days');
  const hours = timer.querySelector('#hours');
  const minutes = timer.querySelector('#minutes');
  const seconds = timer.querySelector('#seconds');

  const timerInterval = setInterval(updateClock, 1000);
  updateClock();

  function updateClock() {
    const time = getTimeRemaining(endTime);
    days.textContent = getZero(time.days);
    hours.textContent = getZero(time.hours);
    minutes.textContent = getZero(time.minutes);
    seconds.textContent = getZero(time.seconds);

    if (time.total <= 0) {
      clearInterval(timerInterval);
    }
  }
}

setTimer(endDate, '.timer');

// Modal

const buttons = document.querySelectorAll('[data-modal]');
const modal = document.querySelector('.modal');

const showModal = () => {
  modal.classList.add('show');
  modal.classList.remove('hide')
  document.body.style.overflow = 'hidden';
  clearTimeout(modalTimer);
}

buttons.forEach(button => {
  button.addEventListener('click', showModal)
})

const closeModal = () => {
  modal.classList.add('hide');
  modal.classList.remove('show');
  document.body.style.overflow = 'visible';
}

modal.addEventListener('click', (evt) => {
  if (evt.target === modal || evt.target.getAttribute('data-close') == '') {
    closeModal();
  }
})

document.addEventListener('keydown', (evt) => {
  if(evt.key === 'Escape' && modal.classList.contains('show')) {
    closeModal();
  }
})

const modalTimer = setTimeout(showModal, 50000);

const showModalByScroll = () => {
  if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
    showModal();
    window.removeEventListener('scroll', showModalByScroll);
  }
}

window.addEventListener('scroll', showModalByScroll)


// Template

class TemplateMenuItem {
  constructor (src, alt, title, description, price, parentSelector, ...classes) {
    this.parent = document.querySelector(parentSelector);
    this.classes = classes;
    this.src = src;
    this.alt = alt;
    this.title = title;
    this.description = description;
    this.price = price;
    this.transfer = 27;
    this.changeToUAH();
  }

  changeToUAH () {
    this.price = this.price * this.transfer;
  }

  render () {
    const element = document.createElement('div');
    if (this.classes.length == 0) {
      this.element = 'menu__item';
      element.classList.add(this.element);
    } else {
      this.classes.forEach(className => element.classList.add(className));
    }
    element.innerHTML = `
      <img src=${this.src} alt=${this.alt}>
      <h3 class="menu__item-subtitle">${this.title}</h3>
      <div class="menu__item-descr">${this.description}</div>
      <div class="menu__item-divider"></div>
      <div class="menu__item-price">
        <div class="menu__item-cost">Цена:</div>
        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
      </div>
    `;
    this.parent.append(element);
  }
}

const getResource = async (url) => {
  let res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Could not fetch ${url}, status: ${res.status}`);
  }

  return await res.json();
}

getResource('http://localhost:3000/menu')
  .then(data => {
    data.forEach(({ img, altimg, title, descr, price }) => {
      new TemplateMenuItem(img, altimg, title, descr, price, '.menu .container').render();
    });
  });

// getResource('http://localhost:3000/menu')
    //     .then(data => createCard(data));

    // function createCard(data) {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         const element = document.createElement('div');

    //         element.classList.add("menu__item");

    //         element.innerHTML = `
    //             <img src=${img} alt=${altimg}>
    //             <h3 class="menu__item-subtitle">${title}</h3>
    //             <div class="menu__item-descr">${descr}</div>
    //             <div class="menu__item-divider"></div>
    //             <div class="menu__item-price">
    //                 <div class="menu__item-cost">Цена:</div>
    //                 <div class="menu__item-total"><span>${price}</span> грн/день</div>
    //             </div>
    //         `;
    //         document.querySelector(".menu .container").append(element);
    //     });
    // }

// Forms

const forms = document.querySelectorAll('form');
const message = {
  loading: 'img/form/spinner.svg',
  success: 'Спасибо! Заявка сформирована.',
  error: 'Что-то пошло не так..'
}

forms.forEach(item => {
  bindPostData(item);
})

const postData = async (url, data) => {
  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: data
  });

  return await res.json();
}

function bindPostData(form) {
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const messageElement = document.createElement('img');
    messageElement.src = message.loading; 
    messageElement.style.cssText = `
      display: block;
      margin: 0 auto;
    `;
    form.insertAdjacentElement('afterend', messageElement);

    const formData = new FormData(form);

    const json = JSON.stringify(Object.fromEntries(formData.entries()));

    postData('http://localhost:3000/requests', json)
    .then(data => {
        console.log(data);
        showThanksModal(message.success);
        messageElement.remove();
    }).catch(() => {
      showThanksModal(message.error);
    }).finally(() => {
      form.reset();
    })
  })
}

function showThanksModal(message) {
  const modalDialog = document.querySelector('.modal__dialog');

  modalDialog.classList.add('hide');
  showModal();

  const thanksModal = document.createElement('div');
  thanksModal.classList.add('modal__dialog');
  thanksModal.innerHTML = `
    <div class ="modal__content">
      <div class="modal__close" data-close>&times;</div>
      <div class="modal__title">${message}</div>
    </div>
  `;

  document.querySelector('.modal').append(thanksModal);
  setTimeout(() => {
    thanksModal.remove();
    modalDialog.classList.add('show');
    modalDialog.classList.remove('hide');
    closeModal();
  }, 2000)
}


// Slider

const slider = document.querySelector('.offer__slider'),
      sliderPrev = slider.querySelector('.offer__slider-prev'),
      sliderNext = slider.querySelector('.offer__slider-next'),
      sliderCurrent = slider.querySelector('#current'),
      sliderTotal = slider.querySelector('#total'),
      sliderImage = slider.querySelectorAll('.offer__slide'),
      sliderWrapper = slider.querySelector('.offer__slider-wrapper'),
      sliderField = slider.querySelector('.offer__slider-inner'),
      width = window.getComputedStyle(sliderWrapper).width;

const numberCurrent = sliderCurrent.textContent;
const number = numberCurrent * 1;
const total = sliderImage.length;

let offset = 0;
let sliderIndex = 1;

slider.style.position = 'relative';

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

slider.append(indicators);

for (let i = 0; i < sliderImage.length; i++) {
  const dot = document.createElement('li');
  dot.setAttribute('data-slide-to', i + 1);
  dot.classList.add('dot');
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
    opacity: 0.5;
    transition: opacity 0.6s ease;
  `;

  if (i == 0) {
    dot.style.opacity = 1;
  }

  indicators.append(dot);
  dots.push(dot);
}

if (total < 10) {
  sliderTotal.textContent = `0${total}`;
  sliderCurrent.textContent = `0${sliderIndex}`;
} else {
  sliderTotal.textContent = total;
  sliderCurrent.textContent = sliderIndex;
}

sliderField.style.width = 100 * sliderImage.length + '%';
sliderField.style.display = 'flex';
sliderField.style.transition = '0.5s all';

sliderWrapper.style.overflow = 'hidden';

sliderImage.forEach(slide => {
    slide.style.width = width;
});

const showSliderCurrent = (index) => {
  if (sliderImage.length < 10) {
    sliderCurrent.textContent =  `0${index}`;
  } else {
    sliderCurrent.textContent =  index;
  }

  dots.forEach(dot => dot.style.opacity = '0.5');
  dots[index - 1].style.opacity = 1;
}

const deleteNotDigits = (str) => {
  return +str.replace(/\D/g, '');
}

sliderNext.addEventListener('click', () => {
    if (offset == (deleteNotDigits(width) * (sliderImage.length - 1))) {
        offset = 0;
    } else {
        offset += deleteNotDigits(width); 
    }

    sliderField.style.transform = `translateX(-${offset}px)`;

    if (sliderIndex == sliderImage.length) {
        sliderIndex = 1;
    } else {
        sliderIndex++;
    }

    showSliderCurrent(sliderIndex);
});

sliderPrev.addEventListener('click', () => {
    if (offset == 0) {
        offset = deleteNotDigits(width) * (sliderImage.length - 1);
    } else {
        offset -= deleteNotDigits(width);
    }

    sliderField.style.transform = `translateX(-${offset}px)`;

    if (sliderIndex == 1) {
        sliderIndex = sliderImage.length;
    } else {
        sliderIndex--;
    }

    showSliderCurrent(sliderIndex);
});

dots.forEach(dot => {
  dot.addEventListener('click', (evt) => {
    const slideTo = evt.target.getAttribute('data-slide-to');
    
    sliderIndex = slideTo;
    offset = deleteNotDigits(width) * (slideTo - 1);

    sliderField.style.transform = `translateX(-${offset}px)`;

    showSliderCurrent(sliderIndex);
  })
})

// const showSlider = (moveTo) => {
//   if (moveTo >= sliderImage.length) {
//     moveTo = 0;
//   }
//   if (moveTo < 0) {
//     moveTo = sliderImage.length - 1;
//   }

//   sliderImage[moveTo].classList.toggle('offer__slide--active');
//   sliderImage[sliderIndex].classList.toggle('offer__slide--active');

//   if (moveTo < 9) {
//     sliderCurrent.textContent = `0${moveTo + 1}`;
//   } else {
//     sliderCurrent.textContent = `${moveTo + 1}`;
//   }

//   sliderIndex = moveTo; 
// }

// sliderPrev.addEventListener('click', () => {
//   showSlider(sliderIndex - 1);
// })

// sliderNext.addEventListener('click', () => {
//   showSlider(sliderIndex + 1);
// })

// Calc

const totalCalories = document.querySelector('.calculating__result span');
let sex, height, weight, age, activity;

  if (localStorage.getItem('sex')) {
    sex = localStorage.getItem('sex');
  } else {
    sex = 'female';
    localStorage.setItem('sex', sex);
  }

  if (localStorage.getItem('activity')) {
    activity = localStorage.getItem('activity');
  } else {
    activity = '1.375';
    localStorage.setItem('activity', activity);
  }

const calcCalories = () => {
  if (!sex || !height || !weight || !age || !activity) {
    totalCalories.textContent = '_____';
    return
  }

  if (sex === 'female') {
    totalCalories.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * activity);
    return;
  } else {
    totalCalories.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * activity);
    return;
  }
}

calcCalories();

const initLocalSettings = (selector, activeElement) => {
  const elements = document.querySelectorAll(selector);

  elements.forEach(element => {
    element.classList.remove(activeElement);

    if (localStorage.getItem('sex') === element.getAttribute('id')) {
      element.classList.add(activeElement);
    }

    if (localStorage.getItem('activity') === element.getAttribute('data-activity')) {
      element.classList.add(activeElement);
    }
  })
}

initLocalSettings('#activity div', 'calculating__choose-item_active')
initLocalSettings('#gender div', 'calculating__choose-item_active');

const getStaticInformation = (selector, activeElement) => {
  const elements = document.querySelectorAll(selector);

  elements.forEach(element => {
    element.addEventListener('click', (evt) => {
      if (evt.target.getAttribute('data-activity')) {
        activity = +evt.target.getAttribute('data-activity');
        localStorage.setItem('activity', activity);
      } else {
        sex = evt.target.getAttribute('id');
        localStorage.setItem('sex', sex);
      }

      elements.forEach(element => {
        element.classList.remove(activeElement);
      })

      evt.target.classList.add(activeElement);

      calcCalories();
    })
  });
}

getStaticInformation('#activity div', 'calculating__choose-item_active');
getStaticInformation('#gender div', 'calculating__choose-item_active');

const getDinamicInformation = (selector) => {
  const input = document.querySelector(selector);

  input.addEventListener('input', () => {
    switch (input.getAttribute('id')) {
      case 'height':
        height = +input.value;
        break;

      case 'weight':
        weight = +input.value;
        break;

      case 'age':
        age = +input.value;
        break
    }

    calcCalories();
  })
}

getDinamicInformation('#height');
getDinamicInformation('#weight');
getDinamicInformation('#age');
