export function moveParticipantsControls() {
  function moveControls() {
    const controls = document.querySelector('.participants__controls');
    const container = document.querySelector('.participants__container');
    const carouselContainer = document.querySelector('.participants__carousel-container');
  
    if (window.innerWidth <= 768) {
      // Перемещаем controls под carousel-container
      carouselContainer.after(controls);
    } else {
      // Возвращаем controls на исходное место
      const header = document.querySelector('.particiapants__header');
      header.append(controls);
    }
  }
  
  // Вызываем при загрузке страницы
  moveControls();
  
  // Добавляем слушатель события на изменение размера окна
  window.addEventListener('resize', moveControls);
}
