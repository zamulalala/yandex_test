import { participants } from "./cards.js";
import { initTicker } from "./ticker.js";
import { moveSupportEllipse } from "./moveSupportEllipse.js";
import { moveParticipantsControls } from "./moveParticipantsControls.js";
import { initStepsSlider } from "./stepsSlider.js";
import { initParticipantsSlider } from "./ParticipantsSlider.js";
import { initAnimations } from "./animation.js";

document.addEventListener("DOMContentLoaded", function () {
  // Инициализация всех тикеров на странице
  const tickerWrappers = document.querySelectorAll(".ticker__wrapper");
  tickerWrappers.forEach((tickerWrapper) => initTicker(tickerWrapper));

  // Инициализация слайдера участников
  initParticipantsSlider(participants);

  // Инициализация перемещения изображения
  moveSupportEllipse();

  // Инициализация перемещения контролов
  moveParticipantsControls();

  // Инициализация слайдера этапов
  initStepsSlider();

  // Инициализация анимации
  initAnimations();
});
