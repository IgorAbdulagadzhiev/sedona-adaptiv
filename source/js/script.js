let menuBtn = document.querySelector('.nav__toggle'),
    nav = document.querySelector('.nav');

menuBtn.addEventListener('click', function() {
  nav.classList.toggle('nav--opened');
});

let formBtn = document.querySelector('.review__btn');
    failure = document.querySelector('.failure-popup');
    succes = document.querySelector('.succes-popup');
    failureBtn = failure.querySelector('.failure-popup__btn');

formBtn.addEventListener('click', function(event) {
  event.preventDefault();
  failure.classList.add('failure-popup--active');
});

failureBtn.addEventListener('click', function(event) {
  event.preventDefault();
  failure.classList.remove('failure-popup--active');
})
