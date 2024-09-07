import { createParticipantCard } from "./participantCard.js";

export function initParticipantsSlider(participants) {
  const carouselContainer = document.querySelector(
    ".participants__carousel-container"
  );
  const carousel = document.querySelector(".participants__carousel");
  const counter = document.querySelector(".participants__counter");
  const leftArrow = document.querySelector(".participants__arrow--left");
  const rightArrow = document.querySelector(".participants__arrow--right");

  let currentIndex = 0;
  let isAnimating = false;
  let autoSlideInterval;
  let cardsToShow;
  let cardWidth;

  let touchStartX = 0;
  let touchCurrentX = 0;
  let touchDifference = 0;

  // Определение параметров для мобильной и десктопной версий
  function setSliderParams() {
    if (window.innerWidth <= 768) {
      cardsToShow = 3; // 1 слева, 1 центральная, 1 справа (мобильная версия)
      cardWidth = carouselContainer.offsetWidth; // Ширина одной карточки
    } else {
      cardsToShow = 5; // 2 слева, 1 центральная, 2 справа (десктопная версия)
      cardWidth = carouselContainer.offsetWidth / 3; // Ширина одной карточки
    }
  }

  // Функция для получения ширины карточки и установки начальной позиции
  function updateCarouselPosition(offsetX = 0) {
    const offset = -cardWidth + offsetX; // Центрируем текущую карточку
    carousel.style.transform = `translateX(${offset}px)`;
  }

  // Инициализация слайдера
  function initSlider() {
    carousel.innerHTML = ""; // Очищаем карусель

    // Определяем индекс первой карточки для показа
    const startIndex = currentIndex - Math.floor(cardsToShow / 2);

    // Отображаем карточки: предыдущие, текущие и следующие
    for (let i = 0; i < cardsToShow; i++) {
      const index =
        (startIndex + i + participants.length) % participants.length;
      const card = createParticipantCard(participants[index]);
      carousel.appendChild(card);
    }

    updateCarouselPosition();
    updateCounter(currentIndex + 1);
  }

  // Функция для перехода к следующей карточке
  function nextCardGenerate() {
    if (isAnimating) return;
    isAnimating = true;

    carousel.style.transition = "transform 0.5s ease";
    carousel.style.transform = `translateX(${-2 * cardWidth}px)`; // Сдвигаем карусель к следующей карточке

    carousel.addEventListener(
      "transitionend",
      () => {
        currentIndex = (currentIndex + 1) % participants.length;
        carousel.style.transition = "none";
        initSlider();
        isAnimating = false;
      },
      { once: true }
    );
  }

  // Функция для перехода к предыдущей карточке
  function prevCardGenerate() {
    if (isAnimating) return;
    isAnimating = true;

    carousel.style.transition = "transform 0.5s ease";
    carousel.style.transform = `translateX(0)`; // Сдвигаем карусель к предыдущей карточке

    carousel.addEventListener(
      "transitionend",
      () => {
        currentIndex =
          (currentIndex - 1 + participants.length) % participants.length;
        carousel.style.transition = "none";
        initSlider();
        isAnimating = false;
      },
      { once: true }
    );
  }

  // Обновление счетчика
  function updateCounter(index) {
    const totalParticipants = participants.length;
    const span = counter.querySelector("span");
    if (span) {
      counter.innerHTML = `${index}<span> / ${totalParticipants}</span>`;
    }
  }

  // Функция для автоматической смены слайдов
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextCardGenerate, 4000);
  }

  // Функция для остановки автоматической смены слайдов
  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Обработка свайпа для сенсорных устройств
  function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchCurrentX = touchStartX;
    carousel.style.transition = "none"; // Отключаем анимацию на время перемещения пальцем
  }

  function handleTouchMove(event) {
    touchCurrentX = event.touches[0].clientX;
    touchDifference = touchCurrentX - touchStartX;
    updateCarouselPosition(touchDifference); // Двигаем карусель вместе с пальцем
  }

  function handleTouchEnd() {
    if (Math.abs(touchDifference) > 50) {
      if (touchDifference < 0) {
        // Свайп влево
        nextCardGenerate();
      } else {
        // Свайп вправо
        prevCardGenerate();
      }
    } else {
      // Возвращаем карусель в исходное положение, если свайп был слишком коротким
      updateCarouselPosition(0);
    }
    touchDifference = 0; // Сбрасываем разницу
  }

  leftArrow.addEventListener("click", () => {
    stopAutoSlide();
    prevCardGenerate();
    startAutoSlide();
  });

  rightArrow.addEventListener("click", () => {
    stopAutoSlide();
    nextCardGenerate();
    startAutoSlide();
  });

  // Добавление сенсорных событий для мобильных устройств
  carouselContainer.addEventListener("touchstart", handleTouchStart);
  carouselContainer.addEventListener("touchmove", handleTouchMove);
  carouselContainer.addEventListener("touchend", handleTouchEnd);

  carouselContainer.addEventListener("mouseenter", stopAutoSlide);
  carouselContainer.addEventListener("mouseleave", startAutoSlide);

  // Инициализация слайдера при загрузке
  setSliderParams();
  initSlider();
  startAutoSlide();

  // Обновление параметров и слайдера при изменении размера окна
  window.addEventListener("resize", () => {
    setSliderParams();
    initSlider();
  });
}
