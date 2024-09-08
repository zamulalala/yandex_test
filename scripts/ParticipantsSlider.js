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
  let touchStartY = 0;
  let touchCurrentX = 0;
  let touchCurrentY = 0;
  let touchDifferenceX = 0;
  let touchDifferenceY = 0;
  let isHorizontalSwipe = false; // Флаг для определения направления свайпа

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
    if (isAnimating) return; // Если анимация еще идет, свайп игнорируется
    stopAutoSlide(); // Останавливаем автопрокрутку
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    touchCurrentX = touchStartX;
    touchCurrentY = touchStartY;
    carousel.style.transition = "none"; // Отключаем анимацию на время перемещения пальцем
    isHorizontalSwipe = false; // Сбрасываем флаг свайпа
  }

  function handleTouchMove(event) {
    if (isAnimating) return; // Игнорируем движение, если анимация продолжается
    touchCurrentX = event.touches[0].clientX;
    touchCurrentY = event.touches[0].clientY;

    touchDifferenceX = touchCurrentX - touchStartX;
    touchDifferenceY = touchCurrentY - touchStartY;

    // Проверяем, что движение больше по горизонтали, чем по вертикали
    if (!isHorizontalSwipe) {
      isHorizontalSwipe = Math.abs(touchDifferenceX) > Math.abs(touchDifferenceY);
    }

    // Если свайп горизонтальный, предотвращаем вертикальную прокрутку
    if (isHorizontalSwipe) {
      event.preventDefault(); // Блокируем вертикальную прокрутку страницы
      updateCarouselPosition(touchDifferenceX); // Двигаем карусель вместе с пальцем
    }
  }

  function handleTouchEnd() {
    if (isAnimating) return; // Игнорируем завершение, если анимация продолжается
    if (isHorizontalSwipe) {
      if (Math.abs(touchDifferenceX) > 50) {
        if (touchDifferenceX < 0) {
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
    }
    touchDifferenceX = 0; // Сбрасываем разницу
    touchDifferenceY = 0; // Сбрасываем разницу
    startAutoSlide(); // Возобновляем автопрокрутку после завершения свайпа
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
