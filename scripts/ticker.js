export function initTicker(tickerWrapper) {
  const tickerItems = tickerWrapper.querySelectorAll(".ticker__item");

  if (tickerItems.length > 0) {
    // Дублируем контент внутри текущего тикера для бесконечного эффекта
    tickerWrapper.innerHTML += tickerWrapper.innerHTML;

    const updatedTickerItems = tickerWrapper.querySelectorAll(".ticker__item");

    let tickerWidth = 0;

    updatedTickerItems.forEach((item) => {
      tickerWidth += item.offsetWidth;
    });

    let position = 0;

    function moveTicker() {
      position -= 2;
      if (Math.abs(position) >= tickerWidth / 2) {
        position = 0;
      }
      tickerWrapper.style.transform = `translateX(${position}px)`;
      requestAnimationFrame(moveTicker);
    }

    moveTicker();
  } else {
    console.error("Ticker items not found in ticker wrapper");
  }
}
