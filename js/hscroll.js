(() => {

	// ─── 1. Элементы ───
	const section  = document.getElementById('hscroll');
	const track    = document.getElementById('hscrollTrack');
	const dotsBox  = document.getElementById('hscrollDots');

	if (!section || !track) {
		console.warn('[hscroll] Не найден #hscroll или #hscrollTrack');
		return;
	}

	const isMobile = () => window.matchMedia('(max-width: 700px)').matches;

	// ─── 2. Переменные состояния ───
	let scrollDistance = 0;
	let ticking = false;

	// ─── 3. Коллекции ───
	const cards = track.querySelectorAll('.portfolio__item');
	const dots  = [];

	// ─── 4. Создаём точки ───
	if (dotsBox && cards.length) {
		cards.forEach((card, i) => {
			const dot = document.createElement('button');
			dot.className = 'hscroll__dot';
			dot.setAttribute('aria-label', 'Работа ' + (i + 1));
			dot.type = 'button';

			dot.addEventListener('click', () => {
				if (isMobile()) return;
				if (scrollDistance <= 0) return;   // защита от деления на ноль
				const targetProgress = i / Math.max(1, cards.length - 1);
				const targetScrollY = section.offsetTop + targetProgress * scrollDistance;
				window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
			});

			dotsBox.appendChild(dot);
			dots.push(dot);
		});
	}

	// ─── 5. Функции ───
	function measure() {
		if (isMobile()) {
			section.style.height = '';
			track.style.transform = '';
			return;
		}
		const trackWidth    = track.scrollWidth;
		const viewportWidth = window.innerWidth;
		scrollDistance      = Math.max(0, trackWidth - viewportWidth);
		section.style.height = (window.innerHeight + scrollDistance) + 'px';
		update();
	}

	function update() {
		if (isMobile()) return;

		const rect      = section.getBoundingClientRect();
		const scrolled  = Math.min(Math.max(-rect.top, 0), scrollDistance);
		const progress  = scrollDistance > 0 ? scrolled / scrollDistance : 0;

		track.style.transform = `translate3d(${-progress * scrollDistance}px, 0, 0)`;

		if (dots.length) {
			// Если трек короче вьюпорта — активна только первая точка
			let idx = 0;
			if (scrollDistance > 0) {
				idx = Math.max(0, Math.min(
					cards.length - 1,
					Math.round(progress * (cards.length - 1))
				));
			}
			dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
		}
	}

	function onScroll() {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(() => { update(); ticking = false; });
	}

	// ─── 6. Слушатели ───
	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', measure);
	window.addEventListener('load', measure);

	// ─── 7. Старт ───
	measure();
})();