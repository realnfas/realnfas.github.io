(() => {
	'use strict';

	// ─────────────────────────────────────────────────────────
	//  ПОДСЧЁТ ПРОГРЕССА ДОРОЖНОЙ КАРТЫ
	//
	//  Логика:
	//  1. Каждый .doc-plan__item — считает свои is-done задачи
	//     → обновляет свой прогресс-бар и процент
	//  2. Каждый .doc-sub — считает все задачи внутри своих
	//     .doc-plan__item → обновляет свой прогресс-бар
	//  3. Общий прогресс студии — сумма ВСЕХ задач на странице
	//     (план студии + все подразделения) → обновляет hero-блок
	// ─────────────────────────────────────────────────────────

	// ─── Утилита: посчитать задачи в контейнере ───
	function countTasks(container) {
		const all  = container.querySelectorAll('.doc-plan__task');
		const done = container.querySelectorAll('.doc-plan__task.is-done');
		return { total: all.length, done: done.length };
	}

	// ─── Процент из двух чисел ───
	function toPercent(done, total) {
		if (!total) return 0;
		return Math.round((done / total) * 100);
	}

	// ─────────────────────────────────────────────────────────
	//  1. Прогресс внутри каждого .doc-plan__item
	// ─────────────────────────────────────────────────────────
	function updatePlanItems() {
		const items = document.querySelectorAll('.doc-plan__item');

		items.forEach(item => {
			const { total, done } = countTasks(item);
			const pct = toPercent(done, total);

			const fill = item.querySelector('.doc-plan__meter-fill');
			const label = item.querySelector('.doc-plan__pct');

			if (fill)  fill.style.width = pct + '%';
			if (label) label.textContent = pct + '%';
		});
	}

	// ─────────────────────────────────────────────────────────
	//  2. Прогресс внутри каждой карточки подразделения
	// ─────────────────────────────────────────────────────────
	function updateSubdivisions() {
		const subs = document.querySelectorAll('.doc-sub');

		subs.forEach(sub => {
			const { total, done } = countTasks(sub);
			const pct = toPercent(done, total);

			const fill  = sub.querySelector('.doc-sub__meter-fill');
			const label = sub.querySelector('.doc-sub__pct');

			if (fill)  fill.style.width = pct + '%';
			if (label) label.textContent = pct + '%';
		});
	}

	// ─────────────────────────────────────────────────────────
	//  3. Общий прогресс студии (hero-блок)
	//
	//  Считаем ВСЕ задачи на странице: план студии + подразделения.
	//  Если hero-блока на странице нет — просто пропускаем.
	// ─────────────────────────────────────────────────────────
	function updateStudioProgress() {
		const hero = document.getElementById('studioProgressHero');
		if (!hero) return;

		const { total, done } = countTasks(document);
		const pct = toPercent(done, total);

		const percentEl = document.getElementById('studioProgressPercent');
		const fillEl    = document.getElementById('studioProgressFill');
		const textEl    = document.getElementById('studioProgressText');

		if (percentEl) percentEl.textContent = pct + '%';
		if (textEl)    textEl.textContent = `${done} из ${total} пунктов выполнено`;

		// Плавная анимация ширины бара: старт с 0, финиш — реальный процент
		if (fillEl) {
			fillEl.style.width = '0%';
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					fillEl.style.width = pct + '%';
				});
			});
		}
	}

	// ─────────────────────────────────────────────────────────
	//  ЗАПУСК
	// ─────────────────────────────────────────────────────────

	// Ждём DOMContentLoaded, потому что site-config.js подставляет
	// тексты (data-text) в тот же момент. Если запустим раньше —
	// можем получить нули в подписях.
	function run() {
		updatePlanItems();
		updateSubdivisions();
		updateStudioProgress();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', run, { once: true });
	} else {
		run();
	}
})();