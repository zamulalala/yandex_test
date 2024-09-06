export function initStepsSlider() {
  const stepsGrid = document.querySelector(".steps__grid");
  const stepsCards = document.querySelectorAll(".steps__card");
  const leftArrow = document.querySelector(".steps__arrow--left");
  const rightArrow = document.querySelector(".steps__arrow--right");
  const breadcrumbs = document.querySelectorAll(".steps__breadcrumb");

  let currentIndex = 0;

  function updateSlider() {
    stepsGrid.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateArrows();
    updateBreadcrumbs();
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
    if (currentIndex < stepsCards.length - 1) {
      currentIndex++;
      updateSlider();
    }
  }

  function goToPrev() {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  }

  leftArrow.addEventListener("click", goToPrev);
  rightArrow.addEventListener("click", goToNext);

  breadcrumbs.forEach((breadcrumb, index) => {
    breadcrumb.addEventListener("click", () => {
      currentIndex = index;
      updateSlider();
    });
  });

  // Initialize slider state
  updateSlider();
}
