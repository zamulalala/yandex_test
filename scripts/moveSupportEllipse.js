export function moveSupportEllipse() {
  const supportText = document.querySelector(".support__text");
  const supportTitles = document.querySelector(".support__titles");
  const supportEllipse = document.querySelector(".support__ellipse");

  if (!supportText || !supportTitles || !supportEllipse) return; // Защита от ошибки, если элементы не найдены

  function handleMove() {
    if (window.innerWidth <= 768) {
      // Убедимся, что изображение еще не перемещено
      if (!supportTitles.contains(supportEllipse)) {
        // Удаляем support__ellipse и вставляем его между заголовками
        supportTitles.insertBefore(supportEllipse, supportTitles.children[1]);
      }
    } else {
      // Убедимся, что изображение возвращено на исходное место
      if (supportTitles.contains(supportEllipse)) {
        // Возвращаем support__ellipse на исходное место
        supportText.appendChild(supportEllipse);
      }
    }
  }

  // Запускаем функцию при загрузке страницы
  handleMove();

  // Запускаем функцию при изменении размера окна
  window.addEventListener("resize", handleMove);
}
