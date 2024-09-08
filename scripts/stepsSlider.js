export function initStepsSlider() {
  const stepsGrid = document.querySelector(".steps__grid");
  const stepsCards = document.querySelectorAll(".steps__card");
  const leftArrow = document.querySelector(".steps__arrow--left");
  const rightArrow = document.querySelector(".steps__arrow--right");
  const breadcrumbs = document.querySelectorAll(".steps__breadcrumb");

  let currentIndex = 0;
  let isAnimating = false;

  let touchStartX = 0;
  let touchCurrentX = 0;
  let touchDifferenceX = 0;

  function updateSlider() {
    stepsGrid.style.transition = "transform 0.5s ease";
    stepsGrid.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateArrows();
    updateBreadcrumbs();
    stepsGrid.addEventListener(
      "transitionend",
      () => {
        isAnimating = false;
      },
      { once: true }
    );
  }

  function updateArrows() {
    leftArrow.disabled = currentIndex === 0;
    rightArrow.disabled = currentIndex === stepsCards.length - 1;
  }

  function updateBreadcrumbs() {
    breadcrumbs.forEach((breadcrumb, index) => {
      breadcrumb.classList.toggle(
        "steps__breadcrumb--active",
        index === currentIndex
      );
    });
  }

  function goToNext() {
    if (isAnimating || currentIndex >= stepsCards.length - 1) return;
    isAnimating = true;
    currentIndex++;
    updateSlider();
  }

  function goToPrev() {
    if (isAnimating || currentIndex <= 0) return;
    isAnimating = true;
    currentIndex--;
    updateSlider();
  }

  // Добавляем сенсорное управление
  function handleTouchStart(event) {
    if (isAnimating) return;
    touchStartX = event.touches[0].clientX;
    touchCurrentX = touchStartX;
    stepsGrid.style.transition = "none"; // Отключаем анимацию во время касания
  }

  function handleTouchMove(event) {
    if (isAnimating) return;
    touchCurrentX = event.touches[0].clientX;
    touchDifferenceX = touchCurrentX - touchStartX;

    // Не даем сдвинуть дальше первой или последней карточки
    if (
      (currentIndex === 0 && touchDifferenceX > 0) || // Первая карточка, свайп вправо
      (currentIndex === stepsCards.length - 1 && touchDifferenceX < 0) // Последняя карточка, свайп влево
    ) {
      touchDifferenceX = 0;
    }

    // Смещаем слайдер в зависимости от движения пальца
    stepsGrid.style.transform = `translateX(calc(-${currentIndex * 100}% + ${touchDifferenceX}px))`;
  }

  function handleTouchEnd() {
    if (isAnimating) return;

    // Если движение больше 50px, определяем направление свайпа
    if (Math.abs(touchDifferenceX) > 50) {
      if (touchDifferenceX < 0 && currentIndex < stepsCards.length - 1) {
        goToNext(); // Свайп влево
      } else if (touchDifferenceX > 0 && currentIndex > 0) {
        goToPrev(); // Свайп вправо
      } else {
        // Возвращаем в исходное положение, если попытались сдвинуть за край
        updateSlider();
      }
    } else {
      // Возвращаем в исходное положение, если движение было недостаточным
      updateSlider();
    }

    touchDifferenceX = 0; // Сбрасываем разницу
  }

  // Добавляем обработчики событий для сенсорного управления
  stepsGrid.addEventListener("touchstart", handleTouchStart);
  stepsGrid.addEventListener("touchmove", handleTouchMove);
  stepsGrid.addEventListener("touchend", handleTouchEnd);

  // Обработчики кликов для стрелок
  leftArrow.addEventListener("click", goToPrev);
  rightArrow.addEventListener("click", goToNext);

  // Обработчики кликов для хлебных крошек
  breadcrumbs.forEach((breadcrumb, index) => {
    breadcrumb.addEventListener("click", () => {
      if (isAnimating) return;
      currentIndex = index;
      updateSlider();
    });
  });

  // Инициализация слайдера
  updateSlider();
}
