// Универсальная функция для анимации элементов
function initElementAnimation(selector, callback = null, options = { root: null, threshold: 0.2 }) {
  const elements = document.querySelectorAll(selector);

  function animateEntries(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');

        // Вызов дополнительного callback, если он передан
        if (callback) callback(entry.target);

        observer.unobserve(entry.target);
      }
    });
  }

  const observer = new IntersectionObserver(animateEntries, options);
  elements.forEach(el => observer.observe(el));
}

// Функция для анимации изображения с постоянной анимацией после завершения
function handleKnightImageAnimation(image) {
  image.addEventListener('animationend', () => {
    image.classList.add('rotating');
  });
}

// Общая функция для инициализации всех анимаций на странице
export function initAnimations() {
  // Анимация заголовков на экране поддержки
  initElementAnimation('.support__title');

  // Анимация изображений на экране поддержки (включая рыцаря с вращением)
  initElementAnimation('.support__image', (image) => {
    if (image.classList.contains('support__image--knight')) {
      handleKnightImageAnimation(image);
    }
  });

  // Анимация заголовков и самолета на экране шагов
  initElementAnimation('.steps__title');
  initElementAnimation('.steps__subtitle');
  initElementAnimation('.steps__image img');

  // Анимация заголовка участников
  initElementAnimation('.participants__title');
}
