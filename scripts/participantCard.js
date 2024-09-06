// Функция для создания карточки участника
export function createParticipantCard(participant) {
  const template = document.getElementById("card-template");

  if (!template) {
    console.error("Template not found");
    return null;
  }

  const clone = template.content.cloneNode(true);
  const img = clone.querySelector(".participant__image img");
  const nameElement = clone.querySelector(".participant__name");
  const titleElement = clone.querySelector(".participant__title");

  // Заполнение данных участника
  img.alt = participant.name; // Установка атрибута alt из имени
  nameElement.textContent = participant.name;
  titleElement.textContent = participant.title;

  return clone;
}
