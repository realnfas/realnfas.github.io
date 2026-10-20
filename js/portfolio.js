(() => {
	// ─── 1. Элементы ───
	const panel    = document.getElementById('workPanel');
	const mediaBox = document.getElementById('workMedia');
	const catEl    = document.getElementById('workCat');
	const titleEl  = document.getElementById('workTitle');
	const descEl   = document.getElementById('workDesc');
	if (!panel) return;

	const content = panel.querySelector('.work-panel__content');
	const prevBtn = panel.querySelector('[data-nav="prev"]');
	const nextBtn = panel.querySelector('[data-nav="next"]');

	const cards = Array.from(document.querySelectorAll('.portfolio__item'));

		cards.forEach(card => {
		if (!card.hasAttribute('role'))     card.setAttribute('role', 'button');
		if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
		if (!card.hasAttribute('aria-label')) {
			const kind = card.dataset.video ? 'видео' : 'работу';
			card.setAttribute('aria-label', `Открыть ${kind}: ${card.dataset.title || ''}`);
		}
	});

	let currentVideo = null;
	let currentIndex = -1;
	let lastFocusedElement = null;

	// ─── 2. Авторазмер медиа ───
	function applyMediaSize(naturalW, naturalH) {
		if (!naturalW || !naturalH) return;

		const ratio = naturalW / naturalH;
		const maxHeight = window.innerHeight * 0.65;

		mediaBox.style.aspectRatio = `${naturalW} / ${naturalH}`;
		mediaBox.style.maxHeight = maxHeight + 'px';

		const wrapWidth = mediaBox.parentElement.clientWidth;
		const heightAtFullWidth = wrapWidth / ratio;

		if (heightAtFullWidth > maxHeight) {
			mediaBox.style.maxWidth = (maxHeight * ratio) + 'px';
		} else {
			mediaBox.style.maxWidth = '100%';
		}
	}

	function resetMediaSize() {
		mediaBox.style.aspectRatio = '';
		mediaBox.style.maxHeight   = '';
		mediaBox.style.maxWidth    = '';
	}

	function showMediaError(message) {
		mediaBox.innerHTML = '';
		const err = document.createElement('div');
		err.className = 'work-panel__error';
		err.textContent = '⚠ ' + message;
		mediaBox.appendChild(err);
		resetMediaSize();
	}

	// ─── 3. Фокус-трап ───
	function getFocusable() {
		if (!content) return [];
		return Array.from(content.querySelectorAll(
			'button:not([disabled]), a[href], video, [tabindex]:not([tabindex="-1"])'
		)).filter(el => el.offsetParent !== null);
	}

	function trapFocus(e) {
		if (e.key !== 'Tab') return;
		const focusable = getFocusable();
		if (!focusable.length) return;

		const first = focusable[0];
		const last  = focusable[focusable.length - 1];

		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	}

	// ─── 4. Блокировка прокрутки сайта под панелью ───
	function blockScroll(e) {
		// Разрешаем скролл внутри .work-panel__body, если контент в него не влезает
		if (e.target.closest('.work-panel__body')) return;
		e.preventDefault();
	}

	function blockKeyScroll(e) {
		const blocked = [' ', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown'];
		if (blocked.includes(e.key) && !e.target.closest('.work-panel__body')) {
			e.preventDefault();
		}
	}

	// ─── 5. Свайпы внутри панели ───
	let touchStartX = 0;
	let touchStartY = 0;
	let touchStartTime = 0;
	const SWIPE_MIN_DISTANCE = 60;   // пикселей
	const SWIPE_MAX_TIME     = 600;  // мс
	const SWIPE_MAX_VERTICAL = 60;   // пикселей

	function onTouchStart(e) {
		if (e.touches.length !== 1) return;
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
		touchStartTime = Date.now();
	}

	function onTouchEnd(e) {
		if (e.changedTouches.length !== 1) return;
		const dx = e.changedTouches[0].clientX - touchStartX;
		const dy = e.changedTouches[0].clientY - touchStartY;
		const dt = Date.now() - touchStartTime;

		if (dt > SWIPE_MAX_TIME) return;
		if (Math.abs(dx) < SWIPE_MIN_DISTANCE) return;
		if (Math.abs(dy) > SWIPE_MAX_VERTICAL) return;

		// Свайп влево — следующая работа, вправо — предыдущая
		if (dx < 0) goTo(1);
		else        goTo(-1);
	}

	// ─── 6. Открытие карточки ───
	function openPanel(index) {
		if (index < 0 || index >= cards.length) return;

		// Запоминаем, куда вернуть фокус при закрытии
		if (currentIndex === -1) {
			lastFocusedElement = document.activeElement;
		}

		currentIndex = index;

		const card = cards[index];
		const title = card.dataset.title || '';
		const cat   = card.dataset.cat   || '';
		const desc  = card.dataset.desc  || '';

		const cfg       = window.SITE_CONFIG || {};
		const mediaCfg  = cfg.media || {};
		const worksBase = mediaCfg.works || 'media/works/';

		const src   = card.dataset.src   ? worksBase + card.dataset.src   : '';
		const video = card.dataset.video ? worksBase + card.dataset.video : '';

		catEl.textContent   = cat;
		titleEl.textContent = title;
		descEl.textContent  = desc;

		mediaBox.innerHTML = '';
		resetMediaSize();
		currentVideo = null;

		if (video) {
			if (src) {
				const posterProbe = new Image();
				posterProbe.onload = () => applyMediaSize(posterProbe.naturalWidth, posterProbe.naturalHeight);
				posterProbe.onerror = () => console.warn('[portfolio] Постер не загрузился:', src);
				posterProbe.src = src;
			}

			const vid = document.createElement('video');
			vid.src = video;
			vid.poster = src;
			vid.controls = true;
			vid.autoplay = false;
			vid.playsInline = true;
			vid.muted = false;
			vid.preload = 'metadata';

			vid.addEventListener('error', () => {
				console.warn('[portfolio] Не удалось загрузить видео:', video);
				showMediaError('Не удалось загрузить видео');
				currentVideo = null;
			});

			mediaBox.appendChild(vid);
			currentVideo = vid;
			//vid.play().catch(() => {});

			vid.addEventListener('loadedmetadata', () => {
				applyMediaSize(vid.videoWidth, vid.videoHeight);
			});
		} else if (src) {
			const img = document.createElement('img');
			img.onload = () => applyMediaSize(img.naturalWidth, img.naturalHeight);
			img.onerror = () => {
				console.warn('[portfolio] Не удалось загрузить изображение:', src);
				showMediaError('Не удалось загрузить изображение');
			};
			img.src = src;
			img.alt = title;
			mediaBox.appendChild(img);
		}

		updateNavButtons();

		const wasOpen = panel.classList.contains('is-open');
		panel.classList.add('is-open');
		panel.setAttribute('aria-hidden', 'false');
		document.body.style.overflow = 'hidden';

		// Фокус на кнопку закрытия при первом открытии
		if (!wasOpen) {
			setTimeout(() => {
				const closeBtn = panel.querySelector('[data-close]');
				if (closeBtn && !closeBtn.classList.contains('work-panel__backdrop')) closeBtn.focus();
			}, 60);
		}
	}

	// ─── 7. Закрытие ───
	function closePanel() {
		panel.classList.remove('is-open');
		panel.setAttribute('aria-hidden', 'true');
		document.body.style.overflow = '';
		currentIndex = -1;

		if (currentVideo) {
			currentVideo.pause();
			currentVideo.removeAttribute('src');
			currentVideo.load();
			currentVideo = null;
		}
		mediaBox.innerHTML = '';
		resetMediaSize();

		// Возвращаем фокус на карточку, с которой открыли панель
		if (lastFocusedElement && lastFocusedElement.focus) {
			lastFocusedElement.focus();
		}
		lastFocusedElement = null;
	}

	// ─── 8. Навигация ───
	function goTo(offset) {
		if (currentIndex < 0) return;
		const nextIndex = currentIndex + offset;
		if (nextIndex < 0 || nextIndex >= cards.length) return;
		openPanel(nextIndex);
	}

	function updateNavButtons() {
		if (prevBtn) prevBtn.disabled = currentIndex <= 0;
		if (nextBtn) nextBtn.disabled = currentIndex >= cards.length - 1;
	}

	// ─── 9. Обработчики ───
	cards.forEach((card, i) => {
		card.addEventListener('click', () => openPanel(i));

		card.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
				e.preventDefault();
				openPanel(i);
			}
		});
	});

	panel.addEventListener('click', (e) => {
		if (e.target.closest('[data-close]')) closePanel();
	});

	if (prevBtn) prevBtn.addEventListener('click', () => goTo(-1));
	if (nextBtn) nextBtn.addEventListener('click', () => goTo(1));

	// Клавиатура: Esc, стрелки, Tab-трап
	document.addEventListener('keydown', (e) => {
		if (!panel.classList.contains('is-open')) return;

		if (e.key === 'Escape')     { closePanel(); return; }
		if (e.key === 'ArrowLeft')  { goTo(-1);    return; }
		if (e.key === 'ArrowRight') { goTo(1);     return; }

		trapFocus(e);
		blockKeyScroll(e);
	});

	// Блокировка прокрутки сайта под панелью
	panel.addEventListener('wheel', blockScroll, { passive: false });
	panel.addEventListener('touchmove', (e) => {
		// Разрешаем скролл только внутри .work-panel__body
		if (e.target.closest('.work-panel__body')) return;
		// Блокируем жест только если он «свободный» (не внутри медиа-контролов)
		if (e.target.closest('video')) return;
	}, { passive: true });

	// Свайпы для переключения работ на тач-устройствах
	content.addEventListener('touchstart', onTouchStart, { passive: true });
	content.addEventListener('touchend',   onTouchEnd,   { passive: true });

	// Пересчёт размера при ресайзе окна
	window.addEventListener('resize', () => {
		if (!panel.classList.contains('is-open')) return;
		const img = mediaBox.querySelector('img');
		if (img && img.naturalWidth) {
			applyMediaSize(img.naturalWidth, img.naturalHeight);
			return;
		}
		const vid = mediaBox.querySelector('video');
		if (vid && vid.videoWidth) {
			applyMediaSize(vid.videoWidth, vid.videoHeight);
		}
	});
})();