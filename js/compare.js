(() => {
	const root   = document.getElementById('compare');
	const after  = document.getElementById('compareAfter');
	const handle = document.getElementById('compareHandle');
	if (!root || !after || !handle) return;

	const beforeImgEl = root.querySelector('.compare__img--before');
	const afterImgEl  = root.querySelector('.compare__after .compare__img');
	const navBox      = root.querySelector('#compareNav');

	// ─────────────────────────────────────────────────────────
	//  АВТО-ASPECT-RATIO
	// ─────────────────────────────────────────────────────────
	function applyAspectFromImage(img) {
		if (!img || !img.naturalWidth || !img.naturalHeight) return;
		root.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
	}

	const forcedAspect = (root.dataset.aspect || '').trim();
	if (forcedAspect) root.style.aspectRatio = forcedAspect;

	function watchBefore(imgEl) {
		if (!imgEl) return;
		if (forcedAspect) return;
		if (imgEl.complete && imgEl.naturalWidth) {
			applyAspectFromImage(imgEl);
			return;
		}
		imgEl.addEventListener('load', () => applyAspectFromImage(imgEl), { once: true });
	}

	// ─────────────────────────────────────────────────────────
	//  ПОЛЗУНОК — состояние
	// ─────────────────────────────────────────────────────────
	let currentPosition = 50;
	let dragging        = false;

	function setPosition(percent) {
		const p = Math.max(0, Math.min(100, percent));
		currentPosition = p;

		after.style.clipPath = `inset(0 0 0 ${p}%)`;
		handle.style.left = p + '%';

		// ARIA обновляется при любом способе управления (мышь, палец, клавиатура)
		root.setAttribute('aria-valuenow', Math.round(p));

		// Скрываем метки «До»/«После» у краёв
		root.classList.toggle('is-near-left',  p <= 30);
		root.classList.toggle('is-near-right', p >= 70);
	}

	// ─────────────────────────────────────────────────────────
	//  ARIA (для скринридеров и клавиатуры)
	// ─────────────────────────────────────────────────────────
	root.setAttribute('tabindex', '0');
	root.setAttribute('role', 'slider');
	root.setAttribute('aria-label', 'Сравнение до/после');
	root.setAttribute('aria-valuemin', '0');
	root.setAttribute('aria-valuemax', '100');
	root.setAttribute('aria-valuenow', '50');
	root.setAttribute('aria-orientation', 'horizontal');

	// ─────────────────────────────────────────────────────────
	//  ПАРЫ КАРТИНОК
	// ─────────────────────────────────────────────────────────
	function getMediaBase(folder) {
		return window.SITE_CONFIG?.media?.[folder] || `/${folder}/`;
	}

	function buildFullPath(rel) {
		const slashIdx = rel.indexOf('/');
		if (slashIdx < 0) return rel;
		const folder = rel.slice(0, slashIdx);
		const file   = rel.slice(slashIdx + 1);
		return getMediaBase(folder) + file;
	}

	let pairs = [];
	let currentPair = 0;

	function initPairs() {
		pairs = [];

		const firstBefore = beforeImgEl?.dataset.media || '';
		const firstAfter  = afterImgEl?.dataset.media  || '';
		if (firstBefore && firstAfter) {
			pairs.push({
				before: buildFullPath(firstBefore),
				after:  buildFullPath(firstAfter)
			});
		}

		root.querySelectorAll('template.compare__pair').forEach(tpl => {
			const b = (tpl.dataset.before || '').trim();
			const a = (tpl.dataset.after  || '').trim();
			if (!b || !a) return;
			pairs.push({
				before: buildFullPath(b),
				after:  buildFullPath(a)
			});
		});

		if (pairs.length <= 1 || !navBox) {
			if (navBox) navBox.hidden = true;
			if (pairs.length === 1) {
				if (beforeImgEl && !beforeImgEl.src) beforeImgEl.src = pairs[0].before;
				if (afterImgEl  && !afterImgEl.src)  afterImgEl.src  = pairs[0].after;
			}
			return;
		}

		navBox.innerHTML = '';
		navBox.hidden = false;

		// Метка «Примеры»
		const label = document.createElement('span');
		label.className = 'compare__nav-label';
		label.textContent = 'Примеры';
		navBox.appendChild(label);

		// Стрелка «назад»
		const prevBtn = document.createElement('button');
		prevBtn.className = 'compare__arrow compare__arrow--prev';
		prevBtn.type = 'button';
		prevBtn.setAttribute('aria-label', 'Предыдущий пример');
		prevBtn.innerHTML = '‹';
		prevBtn.addEventListener('click', () => switchPair(currentPair - 1));
		navBox.appendChild(prevBtn);

		// Точки
		pairs.forEach((_, i) => {
			const dot = document.createElement('button');
			dot.className = 'compare__dot';
			dot.type = 'button';
			dot.setAttribute('aria-label', `Пример ${i + 1}`);
			dot.dataset.index = String(i);
			dot.addEventListener('click', () => switchPair(i));
			if (i === 0) dot.classList.add('is-active');
			navBox.appendChild(dot);
		});

		// Стрелка «вперёд»
		const nextBtn = document.createElement('button');
		nextBtn.className = 'compare__arrow compare__arrow--next';
		nextBtn.type = 'button';
		nextBtn.setAttribute('aria-label', 'Следующий пример');
		nextBtn.innerHTML = '›';
		nextBtn.addEventListener('click', () => switchPair(currentPair + 1));
		navBox.appendChild(nextBtn);

		updateArrows();
		hintNavigationOnce();

		// Предзагрузка
		pairs.forEach((pair, i) => {
			if (i === 0) return;
			new Image().src = pair.before;
			new Image().src = pair.after;
		});

		if (beforeImgEl && !beforeImgEl.src) beforeImgEl.src = pairs[0].before;
		if (afterImgEl  && !afterImgEl.src)  afterImgEl.src  = pairs[0].after;
	}

	function switchPair(index) {
		if (index < 0 || index >= pairs.length) return;
		if (index === currentPair) return;

		currentPair = index;
		const pair = pairs[index];

		root.classList.add('is-switching');

		const onBeforeLoad = () => {
			beforeImgEl.removeEventListener('load',  onBeforeLoad);
			beforeImgEl.removeEventListener('error', onError);
			applyAspectFromImage(beforeImgEl);
		};

		const onError = () => {
			console.warn('[compare] Не удалось загрузить картинку:', pair.before);
		};

		beforeImgEl.addEventListener('load',  onBeforeLoad, { once: true });
		beforeImgEl.addEventListener('error', onError,      { once: true });

		beforeImgEl.src = pair.before;
		afterImgEl.src  = pair.after;

		setPosition(50);

		navBox.querySelectorAll('.compare__dot').forEach((dot, i) => {
			dot.classList.toggle('is-active', i === index);
		});

		updateArrows();

		setTimeout(() => root.classList.remove('is-switching'), 220);
	}

	function updateArrows() {
		if (!navBox) return;
		const prev = navBox.querySelector('.compare__arrow--prev');
		const next = navBox.querySelector('.compare__arrow--next');
		if (prev) prev.disabled = currentPair <= 0;
		if (next) next.disabled = currentPair >= pairs.length - 1;
	}

	// Одноразовая пульсация точек — привлекаем внимание, что это кнопки
	let hintPlayed = false;
	function hintNavigationOnce() {
		if (hintPlayed || !navBox || !('IntersectionObserver' in window)) return;

		const io = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (!entry.isIntersecting || hintPlayed) return;
				hintPlayed = true;
				io.unobserve(entry.target);

				setTimeout(() => {
					navBox.classList.add('is-hinting');
					setTimeout(() => navBox.classList.remove('is-hinting'), 4500);
				}, 400);
			});
		}, { threshold: 0.4 });

		io.observe(root);
	}

	// ─────────────────────────────────────────────────────────
	//  ПАКАЗ / СКРЫТИЕ ПАНЕЛИ
	// ─────────────────────────────────────────────────────────
	function showNav() {
		if (!navBox || navBox.hidden) return;
		navBox.classList.remove('is-hidden');
	}

	function hideNav() {
		if (!navBox || navBox.hidden) return;
		navBox.classList.add('is-hidden');
	}

	// ─────────────────────────────────────────────────────────
	//  ПОЛЗУНОК — события
	// ─────────────────────────────────────────────────────────
	function positionFromEvent(clientX) {
		const rect = root.getBoundingClientRect();
		return ((clientX - rect.left) / rect.width) * 100;
	}

	function startDrag(e) {
		dragging = true;
		root.setPointerCapture?.(e.pointerId);
		hideNav();
		setPosition(positionFromEvent(e.clientX));
	}

	function moveDrag(e) {
		if (!dragging) return;
		setPosition(positionFromEvent(e.clientX));
	}

	function endDrag(e) {
		if (!dragging) return;
		dragging = false;
		try { root.releasePointerCapture?.(e.pointerId); } catch (_) {}
		showNav();
	}

	// Клавиатура: ←/→, Home/End
	root.addEventListener('keydown', (e) => {
		let handled = true;

		switch (e.key) {
			case 'ArrowLeft':  setPosition(currentPosition - 2); break;
			case 'ArrowRight': setPosition(currentPosition + 2); break;
			case 'Home':       setPosition(0);                   break;
			case 'End':        setPosition(100);                 break;
			default:           handled = false;
		}

		if (handled) e.preventDefault();
	});

	// Указатель
	root.addEventListener('pointerdown', (e) => {
		if (e.target.closest('.compare__nav')) return;
		startDrag(e);
	});
	root.addEventListener('pointermove', moveDrag);
	root.addEventListener('pointerup', endDrag);
	root.addEventListener('pointercancel', endDrag);
	root.addEventListener('pointerleave', endDrag);

	// Клик — тоже двигает ползунок
	root.addEventListener('click', (e) => {
		if (e.target.closest('.compare__nav')) return;
		if (e.detail !== 1) return;
		hideNav();
		setPosition(positionFromEvent(e.clientX));
		setTimeout(showNav, 400);
	});

	// Не даём навигации дёргать ползунок
	if (navBox) {
		navBox.addEventListener('pointerdown', (e) => e.stopPropagation());
		navBox.addEventListener('click',       (e) => e.stopPropagation());
	}

	// ─────────────────────────────────────────────────────────
	//  СТАРТ
	// ─────────────────────────────────────────────────────────
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => {
			watchBefore(beforeImgEl);
			initPairs();
			setPosition(50);
		}, { once: true });
	} else {
		watchBefore(beforeImgEl);
		initPairs();
		setPosition(50);
	}
})();