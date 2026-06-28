document.addEventListener('DOMContentLoaded', () => {
  
    // 1. Инициализация AOS (плавные анимации при скролле)
    AOS.init({
      duration: 800, // Длительность анимации (мс)
      easing: 'ease-out', // Плавность
      once: true, // Анимация срабатывает только 1 раз
      offset: 100, // Смещение (пикселей до начала анимации)
    });
  
    // 2. Мобильное бургер-меню
    const burger = document.querySelector('.burger');
    const menu = document.querySelector('.header__list');
    
    if(burger && menu) {
      burger.addEventListener('click', () => {
        if(menu.style.display === 'flex') {
          menu.style.display = 'none';
        } else {
          menu.style.display = 'flex';
          menu.style.flexDirection = 'column';
          menu.style.position = 'absolute';
          menu.style.top = '80px';
          menu.style.left = '0';
          menu.style.width = '100%';
          menu.style.background = '#fff';
          menu.style.padding = '20px';
          menu.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
          menu.style.gap = '1.5rem';
        }
      });
    }
  
    // --- 3. Логика работы слайдера на главной ---
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-btn--prev');
    const nextBtn = document.querySelector('.slider-btn--next');
    let currentSlide = 0;
    let slideInterval;
  
    if (slides.length > 0) {
      // Функция переключения слайда
      function goToSlide(index) {
        // Сбрасываем активные классы
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        
        // Устанавливаем новый слайд
        currentSlide = (index + slides.length) % slides.length; // Защита от выхода за границы
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
      }
  
      // Следующий слайд
      function nextSlide() {
        goToSlide(currentSlide + 1);
      }
  
      // Предыдущий слайд
      function prevSlide() {
        goToSlide(currentSlide - 1);
      }
  
      // Запуск автопрокрутки
      function startAutoPlay() {
        stopAutoPlay(); // Сброс таймера, если уже запущен
        slideInterval = setInterval(nextSlide, 4000); // Листать каждые 4 секунды
      }
  
      // Остановка автопрокрутки
      function stopAutoPlay() {
        clearInterval(slideInterval);
      }
  
      // События для стрелок
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          prevSlide();
          startAutoPlay(); // Перезапускаем таймер после ручного нажатия
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          nextSlide();
          startAutoPlay(); // Перезапускаем таймер после ручного нажатия
        });
      }
  
      // События для точек
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          goToSlide(index);
          startAutoPlay();
        });
      });
  
      // Останавливаем автопрокрутку, когда мышка на слайдере
      const sliderContainer = document.querySelector('.hero-slider');
      if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoPlay);
        sliderContainer.addEventListener('mouseleave', startAutoPlay);
      }
  
      // Запускаем автопрокрутку при загрузке
      startAutoPlay();
    }
  });