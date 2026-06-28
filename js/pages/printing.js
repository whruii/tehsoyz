document.addEventListener('DOMContentLoaded', () => {
  // Логика вкладок
  const tabBtns = document.querySelectorAll('.tabs-nav .tab-btn');
  const tabPanels = document.querySelectorAll('.printing-section .tab-panel');

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

  // ============================================
  // ПЕРЕКРЕСТНАЯ ПОДСВЕТКА ТАБЛИЦ (СТРОКА + СТОЛБЕЦ)
  // ============================================
  const tables = document.querySelectorAll('.price-table');

  tables.forEach(table => {
    const rows = table.querySelectorAll('tbody tr');
    const headerCells = table.querySelectorAll('thead th');

    rows.forEach(row => {
      const cells = row.querySelectorAll('td');

      cells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
          // 1. Подсветка строки
          row.classList.add('highlight-row');

          // 2. Подсветка столбца по индексу
          const colIndex = Array.from(cell.parentNode.children).indexOf(cell);
          rows.forEach(r => {
            const allCells = r.querySelectorAll('td');
            if (allCells[colIndex]) {
              allCells[colIndex].classList.add('highlight-col');
            }
          });
        });

        cell.addEventListener('mouseleave', () => {
          // Убираем подсветку строки
          row.classList.remove('highlight-row');

          // Убираем подсветку столбца
          const colIndex = Array.from(cell.parentNode.children).indexOf(cell);
          rows.forEach(r => {
            const allCells = r.querySelectorAll('td');
            if (allCells[colIndex]) {
              allCells[colIndex].classList.remove('highlight-col');
            }
          });
        });
      });
    });
  });
});