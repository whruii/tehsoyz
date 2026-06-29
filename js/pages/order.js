document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Переключение вкладок ---
  const tabBtns = document.querySelectorAll('.order-tabs .tab-btn');
  const tabPanels = document.querySelectorAll('.order-calculator .tab-panel');

  if (tabBtns.length && tabPanels.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-tab');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  }

  // --- 2. Данные для умных списков Принтера ---
  const officeTypes = {
    '21x30': ['ч/б текст', 'ч/б картинка', '2-сторонняя ч/б', 'цветная заливка до 50%', 'цветная заливка >50%'],
    '30x42': ['ч/б текст', 'цветная заливка до 50%', 'цветная заливка >50%']
  };

  const photoTypes = {
    '9x13':   ['Глянец', 'Матовая'],
    '10x15':  ['Глянец', 'Матовая'],
    '13x18':  ['Глянец', 'Матовая 190 гр', 'Матовая 300 гр'],
    '15x21':  ['Глянец', 'Матовая 190 гр', 'Матовая 300 гр'],
    '21x30':  ['Глянец', 'Матовая 190 гр', 'Матовая 300 гр', '2-сторонняя', 'Самоклеящаяся', 'Плёнка'],
    '30x42':  ['Глянец', 'Матовая']
  };

  // --- 3. Данные для умных списков ШИРОКОФОРМАТНОЙ печати (по твоей таблице) ---
  const wideSizes = {
    'gloss':          ['30x40 (A3)', '40x50', '40x60 (A2)', '50x70', '60x80 (A1)', '90x120 (A0)'],
    'canvas-no':      ['30x40 (A3)', '40x50', '40x60 (A2)', '50x70', '60x80 (A1)', '90x120 (A0)'],
    'canvas-stretch': ['30x40 (A3)', '40x50', '40x60 (A2)', '50x70', '60x80 (A1)', '90x120 (A0)'],
    'canvas-frame':   ['30x40 (A3)', '40x50', '40x60 (A2)', '50x70', '60x80 (A1)', '90x120 (A0)'],
    'film':           ['30x40 (A3)', '40x50', '40x60 (A2)', '50x70', '60x80 (A1)', '90x120 (A0)'],
    'poster':         ['40x50', '40x60 (A2)', '50x70', '60x80 (A1)', '90x120 (A0)'] // 30x40 нет в таблице (прочерк)
  };

  // --- 4. Логика переключения категорий бумаги (Принтер) ---
  const catSelect = document.getElementById('printer-cat');
  const officeGroup = document.getElementById('printer-office-group');
  const photoGroup = document.getElementById('printer-photo-group');

  if (catSelect) {
    catSelect.addEventListener('change', () => {
      if (catSelect.value === 'office') {
        officeGroup.style.display = 'block';
        photoGroup.style.display = 'none';
      } else {
        officeGroup.style.display = 'none';
        photoGroup.style.display = 'block';
      }
    });
  }

  // --- 5. Логика обновления списков (Принтер) ---
  const officeFormatSelect = document.getElementById('office-format');
  const officeTypeSelect = document.getElementById('office-type');

  if (officeFormatSelect && officeTypeSelect) {
    function updateOfficeTypes() {
      const format = officeFormatSelect.value;
      const types = officeTypes[format] || [];
      officeTypeSelect.innerHTML = '';
      types.forEach(type => {
        const option = document.createElement('option');
        option.textContent = type;
        officeTypeSelect.appendChild(option);
      });
    }
    officeFormatSelect.addEventListener('change', updateOfficeTypes);
    updateOfficeTypes();
  }

  const photoFormatSelect = document.getElementById('photo-format');
  const photoTypeSelect = document.getElementById('photo-type');

  if (photoFormatSelect && photoTypeSelect) {
    function updatePhotoTypes() {
      const format = photoFormatSelect.value;
      const types = photoTypes[format] || [];
      photoTypeSelect.innerHTML = '';
      types.forEach(type => {
        const option = document.createElement('option');
        option.textContent = type;
        photoTypeSelect.appendChild(option);
      });
    }
    photoFormatSelect.addEventListener('change', updatePhotoTypes);
    updatePhotoTypes();
  }

  // --- 6. Логика обновления списков (ШИРОКОФОРМАТНАЯ) ---
  const wideTypeSelect = document.getElementById('wide-type');
  const wideSizeSelect = document.getElementById('wide-size');
  const wideFilmGroup = document.getElementById('wide-film-group');
  const wideFilmType = document.getElementById('wide-film-type');

  if (wideTypeSelect && wideSizeSelect) {
    function updateWideSizes() {
      const type = wideTypeSelect.value;
      const sizes = wideSizes[type] || [];
      
      wideSizeSelect.innerHTML = '';
      sizes.forEach(size => {
        const option = document.createElement('option');
        option.textContent = size;
        wideSizeSelect.appendChild(option);
      });

      // Показываем поле "Тип плёнки" только если выбрана Самоклеящаяся плёнка
      if (type === 'film') {
        wideFilmGroup.style.display = 'block';
      } else {
        wideFilmGroup.style.display = 'none';
      }
    }

    wideTypeSelect.addEventListener('change', updateWideSizes);
    updateWideSizes();
  }

   // --- 4. Валидация и Отправка заявки ---
   document.getElementById('send-order-btn').addEventListener('click', () => {
    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const email = document.getElementById('client-email').value.trim();
    const link = document.getElementById('client-link').value.trim();
    const comment = document.getElementById('client-comment').value.trim(); // Комментарий

    const phoneError = document.getElementById('phone-error');
    const emailError = document.getElementById('email-error');

    // Сбрасываем ошибки перед новой проверкой
    phoneError.style.display = 'none';
    emailError.style.display = 'none';

    let isValid = true;

    // 1. ПРОВЕРКА ТЕЛЕФОНА (только цифры, +, (), - и пробел)
    const phoneRegex = /^[\d\s\(\)\-\+]+$/;
    if (!phone) {
      phoneError.textContent = 'Пожалуйста, введите номер телефона.';
      phoneError.style.display = 'block';
      isValid = false;
    } else if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
      phoneError.textContent = 'Введите корректный номер телефона (минимум 10 цифр).';
      phoneError.style.display = 'block';
      isValid = false;
    }

    // 2. ПРОВЕРКА ПОЧТЫ (ТОЛЬКО ЛАТИНИЦА + @ + домен)
    // Разрешаем только латинские буквы, цифры, точки, подчеркивания, @ и домен
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      emailError.textContent = 'Пожалуйста, введите адрес электронной почты.';
      emailError.style.display = 'block';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      emailError.textContent = 'Почта должна содержать только английские буквы и символы (например, name@mail.ru).';
      emailError.style.display = 'block';
      isValid = false;
    }

    // Если есть ошибки — останавливаем отправку
    if (!isValid) return;

    // --- Если всё ок — собираем письмо ---
    const activePanel = document.querySelector('.order-calculator .tab-panel.active');
    let serviceName = 'Не указано';
    let formatText = 'Не указано';
    let qtyText = '';
    
    if (activePanel) {
      const tabId = activePanel.id;
      if (tabId === 'order-lab') {
        serviceName = 'Фотолаборатория';
        const size = document.querySelector('#order-lab select:nth-child(1)');
        const paper = document.querySelector('#order-lab select:nth-child(2)');
        const qty = document.querySelector('#order-lab input');
        formatText = `${size.options[size.selectedIndex].text}, ${paper.options[paper.selectedIndex].text}`;
        qtyText = `${qty.value} шт.`;
      } else if (tabId === 'order-printer') {
        serviceName = 'Печать на принтере';
        const cat = document.getElementById('printer-cat').value;
        const qty = document.querySelector('#order-printer input[type="number"]');
        if (cat === 'office') {
          const format = document.getElementById('office-format');
          const type = document.getElementById('office-type');
          formatText = `Офисная ${format.options[format.selectedIndex].text}, ${type.options[type.selectedIndex].text}`;
        } else {
          const size = document.getElementById('photo-format');
          const paper = document.getElementById('photo-type');
          formatText = `Фотобумага ${size.options[size.selectedIndex].text}, ${paper.options[paper.selectedIndex].text}`;
        }
        qtyText = `${qty.value} шт.`;
      } else if (tabId === 'order-wide') {
        serviceName = 'Широкоформатная печать';
        const type = document.getElementById('wide-type');
        const size = document.getElementById('wide-size');
        const qty = document.getElementById('wide-qty');
        let filmTypeText = '';
        if (type.value === 'film') {
          const film = document.getElementById('wide-film-type');
          filmTypeText = ` (${film.options[film.selectedIndex].text})`;
        }
        formatText = `${type.options[type.selectedIndex].text}${filmTypeText}, размер ${size.options[size.selectedIndex].text}`;
        qtyText = `${qty.value} м²`;
      }
    }

    const subject = encodeURIComponent(`Новый заказ (${serviceName})`);
    const body = encodeURIComponent(
      `Здравствуйте! Я хочу оформить заказ.\n\n` +
      `Имя: ${name}\n` +
      `Телефон: ${phone}\n` +
      `Почта: ${email}\n` +
      `Ссылка на файлы: ${link || 'Не указана'}\n` +
      `Комментарий: ${comment || 'Нет'}\n\n` +
      `Вид печати: ${serviceName}\n` +
      `Параметры: ${formatText}\n` +
      `Количество: ${qtyText}\n\n` +
      `Свяжитесь со мной для уточнения деталей и расчета стоимости.`
    );

  });
});