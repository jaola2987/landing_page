new Swiper('.hero__slider', {
  // Optional parameters
  slidesPerView: 2,
  loop: true,
  spaceBetween: 10,
  // Navigation arrows
  navigation: {
    nextEl: '.hero__slider-button__next',
    prevEl: '.hero__slider-button__prev',
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    560: {
      spaceBetween: 8,
    },
  }
});


const calcForm = document.querySelector('.js-calc-form')
const totalSquare = document.querySelector('.js-square')
const totalPrice = document.querySelector('.js-total-price')
const totalPriceWrapper = document.querySelector('.calc__result-wrapper')
const submitButton = document.querySelector('.js-submit')
const orderButton = document.querySelector('.calc__order')

const tariff = {
  economy: 550,
  comfort: 1400,
  premium: 2700,
}

calcForm.addEventListener('input', function () {
  if (this.width.value > 0 && this.length.value > 0) {
    submitButton.disabled = false
  } else {
    submitButton.disabled = true
    totalPriceWrapper.style.opacity = 0
    orderButton.classList.remove('calc__order__show')
  }
})

calcForm.addEventListener('submit', function (event) {
  event.preventDefault();
  if (this.width.value > 0 && this.length.value > 0) {
    const square = this.width.value * this.length.value
    totalSquare.textContent = `${square} кв м`
    totalPrice.textContent = `${square * tariff[this.tariff.value]} руб`
    
    totalPriceWrapper.style.opacity = 1
    orderButton.classList.add('calc__order__show')
  }
})

const scrollController = {
  scrollPosition: 0,
  disabledScroll() {
    scrollController.scrollPosition = window.scrollY;
    document.body.style.cssText = `
      overflow: hidden;
      position: fixed;
      top: -${scrollController.scrollPosition}px;
      left: 0;
      height: 100vh;
      width: 100vw;
      padding-right: ${window.innerWidth - document.body.offsetWidth}px
    `;
    document.documentElement.style.scrollBehavior = 'unset';
  },
  enabledScroll() {
    document.body.style.cssText = '';
    window.scroll({top: scrollController.scrollPosition})
    document.documentElement.style.scrollBehavior = '';
  },
}


const modalController = ({modal, btnOpen, btnClose, time = 300}) => {
  const buttonElems = document.querySelectorAll(btnOpen);
  const modalElem = document.querySelector(modal);

  modalElem.style.cssText = `
    display: flex;
    visibility: hidden;
    opacity: 0;
    transition: opacity ${time}ms ease-in-out;
  `;

  const closeModal = event => {
    const target = event.target;

    if (
      target === modalElem ||
      (btnClose && target.closest(btnClose)) ||
      event.code === 'Escape'
      ) {
      
      modalElem.style.opacity = 0;

      setTimeout(() => {
        modalElem.style.visibility = 'hidden';
        scrollController.enabledScroll();
      }, time);

      window.removeEventListener('keydown', closeModal);
    }
  }

  const openModal = () => {
    modalElem.style.visibility = 'visible';
    modalElem.style.opacity = 1;
    window.addEventListener('keydown', closeModal);
    scrollController.disabledScroll();
  };

  buttonElems.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  modalElem.addEventListener('click', closeModal);
};

modalController({
  modal: ".modal", 
  btnOpen: ".js-order", 
  btnClose: ".modal__close-button",
})

const phone = document.getElementById('phone')
const inputMaskPhone = new Inputmask("+7(999)999-99-99",{placeholder:"+7(000)000-00-00"})
inputMaskPhone.mask(phone)

const validator = new JustValidate('.modal__form', {
  errorLabelCssClass: 'modal__input__error',
  errorLabelStyle: {
    color: '#FFC700',
  },
});

validator.addField('#name', [
  {
    rule: 'required', 
    errorMessage: 'Укажите ваше имя'
  },
  {
    rule: 'minLength', 
    value: 3, 
    errorMessage: 'Слишком короткое имя'
  },
  {
    rule: 'maxLength', 
    value: 20, 
    errorMessage: 'Слишком длинное имя'
  }
])

validator.addField('#phone', [
  {
    rule: 'required', 
    errorMessage: 'Укажите ваш телефон'
  },
  {
    validator: value => {
    const number = phone.inputmask.unmaskedvalue()
    return number.length === 10
    }, 
    errorMessage: 'Телефон не корректный'
  }
])

validator.onSuccess((event) => {
  const form = event.currentTarget

  fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  body: JSON.stringify({
    name: form.name.value,
    phone: form.phone.value,
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((data) => {
    form.reset();
    alert(`Спасибо, ${data.name}, мы с вами свяжемся`)
  });

})