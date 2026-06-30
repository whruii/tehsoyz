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

        // Обновляем скрытое поле service_type
        const serviceMap = {
          'order-lab': 'Фотолаборатория',
          'order-printer': 'Печать на принтере',
          'order-wide': 'Широкоформатная печать'
        };
        const hiddenService = document.getElementById('service_type');
        if (hiddenService) {
          hiddenService.value = serviceMap[targetId] || 'Не указано';
        }
      });
    });
  }

  // --- 2. Данные для умных списков ---
  const officeTypes = {
    '21x30': ['ч/б текст', 'ч/б картинка', '2-сторонняя ч/б', 'цветная заливка до 50%', 'цветная заливка >50%'],
    '30x42': ['ч/б текст', 'цветная заливка до 50%', 'цветная заливка >50%']
  };
  const photoTypes = {
    '9x13': ['Глянец', 'Матовая'],
    '10x15': ['Глянец', 'Матовая'],
    '13x18': ['Глянец', 'Матовая'],
    '15x21': ['Глянец', 'Матовая'],
    '21x30': ['Глянец', 'Матовая 190 гр', 'Матовая 300 гр', '2-сторонняя', 'Самоклеящаяся', 'Плёнка'],
    '30x42': ['Глянец', 'Матовая']
  };
  const wideSizes = {
    'gloss': ['30x40 (A3)', '40x50', '40x60 (A2)', '50x70', '60x80 (A1)', '90x120 (A0)'],
    'canvas-no': ['30x40 (A3)', '40x50', '40x60 (A2)', '50x70', '60x80 (A1)', '90x120 (A0)'],
    'canvas-stretch': ['30x40 (A3)', '40x50', '40x60 (A2)', '50x70', '60x80 (A1)', '90x120 (A0)'],
    'canvas-frame': ['30x40 (A3)', '40x50', '40x60 (A2)', '50x70', '60x80 (A1)', '90x120 (A0)'],
    'film': ['30x40 (A3)', '40x50', '40x60 (A2)', '50x70', '60x80 (A1)', '90x120 (A0)'],
    'poster': ['40x50', '40x60 (A2)', '50x70', '60x80 (A1)', '90x120 (A0)']
  };

  // --- 3. Логика списков ---
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

  const wideTypeSelect = document.getElementById('wide-type');
  const wideSizeSelect = document.getElementById('wide-size');
  const wideFilmGroup = document.getElementById('wide-film-group');

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
      if (type === 'film') {
        wideFilmGroup.style.display = 'block';
      } else {
        wideFilmGroup.style.display = 'none';
      }
    }
    wideTypeSelect.addEventListener('change', updateWideSizes);
    updateWideSizes();
  }

  // --- 5. ОТПРАВКА ЧЕРЕЗ ПОЧТОВУЮ ПРОГРАММУ (mailto) ---
document.getElementById('send-order-btn').addEventListener('click', function() {
  // Собираем данные из формы
  const name = document.getElementById('client-name').value.trim();
  const phone = document.getElementById('client-phone').value.trim();
  const email = document.getElementById('client-email').value.trim();
  const link = document.getElementById('client-link').value.trim();
  const comment = document.getElementById('client-comment').value.trim();

  // Проверка на заполнение
  if (!name || !phone || !email) {
    alert('Пожалуйста, заполните имя, телефон и почту!');
    return;
  }

  // Собираем данные из активной вкладки
  const activePanel = document.querySelector('.order-calculator .tab-panel.active');
  let serviceName = 'Не указано';
  let formatText = 'Не указано';
  let qtyText = '';
  
  if (activePanel) {
    const tabId = activePanel.id;
    if (tabId === 'order-lab') {
      serviceName = 'Фотолаборатория';
      const size = document.getElementById('lab_format');
      const paper = document.getElementById('lab_paper');
      const qty = document.getElementById('lab_qty');
      formatText = `${size.options[size.selectedIndex].text}, ${paper.options[paper.selectedIndex].text}`;
      qtyText = `${qty.value} шт.`;
    } else if (tabId === 'order-printer') {
      serviceName = 'Печать на принтере';
      const cat = document.getElementById('printer-cat').value;
      const qty = document.getElementById('printer_qty');
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

  // Формируем текст письма
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
    `Свяжитесь со мной для уточнения деталей.`
  );

  const subject = encodeURIComponent(`Заказ с сайта (${serviceName})`);

  // Открываем почтовый клиент с заполненным письмом
  window.location.href = `mailto:terentieva1350@mail.ru?subject=${subject}&body=${body}`;
});
});