document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Переключение вкладок ---
  const tabBtns = document.querySelectorAll('.order-tabs .tab-btn');
  const tabPanels = document.querySelectorAll('.order-calculator .tab-panel');

  if (tabBtns.length && tabPanels.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Переключаем активные классы
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
    '9x13':   ['Глянец', 'Матовая'],
    '10x15':  ['Глянец', 'Матовая'],
    '13x18':  ['Глянец', 'Матовая'],
    '15x21':  ['Глянец', 'Матовая 190 гр', 'Матовая 300 гр'],
    '21x30':  ['Глянец', 'Матовая 190 гр', 'Матовая 300 гр', '2-сторонняя', 'Самоклеящаяся', 'Плёнка'],
    '30x42':  ['Глянец', 'Матовая', '2-сторонняя']
  };

  const wideSizes = {
    'gloss':          ['30x40 (A3)', '40x50', '40x60 (A2)', '50x70', '60x80 (A1)', '90x120 (A0)'],
    'canvas-no':      ['30x40 (A3)', '40x50', '40x60 (A2)', '50x70', '60x80 (A1)', '90x120 (A0)'],
    'canvas-stretch': ['30x40 (A3)', '40x50', '40x60 (A2)', '50x70', '60x80 (A1)', '90x120 (A0)'],
    'canvas-frame':   ['30x40 (A3)', '40x50', '40x60 (A2)', '50x70', '60x80 (A1)', '90x120 (A0)'],
    'film':           ['30x40 (A3)', '40x50', '40x60 (A2)', '50x70', '60x80 (A1)', '90x120 (A0)'],
    'poster':         ['40x50', '40x60 (A2)', '50x70', '60x80 (A1)', '90x120 (A0)']
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
});