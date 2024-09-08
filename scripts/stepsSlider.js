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
    stepsGrid.addEventListener("transitionend", () => {
      isAnimating = false;
    }, { once: true });
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

    // Смещаем слайдер в зависимости от движения пальца
    stepsGrid.style.transform = `translateX(calc(-${currentIndex * 100}% + ${touchDifferenceX}px))`;
  }

  function handleTouchEnd() {
    if (isAnimating) return;
    
    // Если движение больше 50px, определяем направление свайпа
    if (Math.abs(touchDifferenceX) > 50) {
      if (touchDifferenceX < 0) {
        goToNext(); // Свайп влево
      } else {
        goToPrev(); // Свайп вправо
      }
    } else {
      // Возвращаем в исходное положение, если движение было недостаточно
      updateSlider();
    }

    touchDifferenceX = 0; // Сбрасываем разницу
  }

  // Добавляем обработчики событий для сенсорного управления
  function addTouchEvents() {
    stepsGrid.addEventListener("touchstart", handleTouchStart);
    stepsGrid.addEventListener("touchmove", handleTouchMove);
    stepsGrid.addEventListener("touchend", handleTouchEnd);
  }

  // Убираем обработчики событий для сенсорного управления
  function removeTouchEvents() {
    stepsGrid.removeEventListener("touchstart", handleTouchStart);
    stepsGrid.removeEventListener("touchmove", handleTouchMove);
    stepsGrid.removeEventListener("touchend", handleTouchEnd);
  }

  // Функция для включения или отключения слайдера в зависимости от ширины экрана
  function checkScreenWidth() {
    if (window.innerWidth <= 768) {
      // Мобильная версия, активируем слайдер
      leftArrow.addEventListener("click", goToPrev);
      rightArrow.addEventListener("click", goToNext);
      breadcrumbs.forEach((breadcrumb, index) => {
        breadcrumb.addEventListener("click", () => {
          if (isAnimating) return;
          currentIndex = index;
          updateSlider();
        });
      });
      updateSlider();
      addTouchEvents(); // Включаем сенсорные события
    } else {
      // Десктопная версия, сбрасываем слайдер
      currentIndex = 0;
      stepsGrid.style.transition = "none";
      stepsGrid.style.transform = "none"; // Возвращаем в исходное положение
      removeTouchEvents(); // Убираем сенсорные события
      leftArrow.removeEventListener("click", goToPrev);
      rightArrow.removeEventListener("click", goToNext);
    }
  }

  // Проверяем ширину экрана при загрузке страницы
  checkScreenWidth();

  // Добавляем обработчик события изменения размера экрана
  window.addEventListener("resize", checkScreenWidth);
}
