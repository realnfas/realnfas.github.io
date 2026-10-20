(() => {
	// Ищем все картинки внутри статей
	const imgs = document.querySelectorAll('.doc-illustration img');
	if (!imgs.length) return;

	// Создаём DOM-структуру для лайтбокса
	const lb = document.createElement('div');
	lb.className = 'lightbox';
	lb.setAttribute('aria-hidden', 'true');
	lb.innerHTML = `
		<button class="lightbox__close" aria-label="Закрыть">✕</button>
		<div class="lightbox__wrapper">
			<img class="lightbox__img" src="" alt="">
		</div>
		<div class="lightbox__hint">Колёсико мыши / щипок для зума • Перетаскивание для перемещения</div>
	`;
	document.body.appendChild(lb);

	const wrapper  = lb.querySelector('.lightbox__wrapper');
	const lbImg    = lb.querySelector('.lightbox__img');
	const closeBtn = lb.querySelector('.lightbox__close');

	let scale = 1;
	let isDragging = false;
	let startX, startY, scrollLeft, scrollTop;

	// Открытие
	function openLightbox(src, alt) {
		lbImg.src = src;
		lbImg.alt = alt || '';
		scale = 1;
		lbImg.style.transform = `scale(1)`;
		lb.classList.add('is-open');
		lb.setAttribute('aria-hidden', 'false');
		document.body.style.overflow = 'hidden';

		wrapper.scrollLeft = 0;
		wrapper.scrollTop = 0;
	}

	// Закрытие
	function closeLightbox() {
		lb.classList.remove('is-open');
		lb.setAttribute('aria-hidden', 'true');
		document.body.style.overflow = '';
		setTimeout(() => { lbImg.src = ''; }, 300);
	}

	// Навешиваем события на картинки
	imgs.forEach(img => {
		img.setAttribute('tabindex', '0');
		img.setAttribute('role', 'button');
		img.setAttribute('aria-label', 'Открыть изображение в полном размере');
		
		img.addEventListener('click', () => openLightbox(img.src, img.alt));
		img.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				openLightbox(img.src, img.alt);
			}
		});
	});

	// Закрытие по клику на крестик, фон или Escape
	closeBtn.addEventListener('click', closeLightbox);
	lb.addEventListener('click', (e) => {
		if (e.target === lb || e.target === wrapper) closeLightbox();
	});
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && lb.classList.contains('is-open')) closeLightbox();
	});

	// Перетаскивание картинки на ПК
	wrapper.addEventListener('pointerdown', (e) => {
		if (e.target === closeBtn) return;
		isDragging = true;
		startX = e.clientX;
		startY = e.clientY;
		scrollLeft = wrapper.scrollLeft;
		scrollTop = wrapper.scrollTop;
		wrapper.setPointerCapture(e.pointerId);
	});

	wrapper.addEventListener('pointermove', (e) => {
		if (!isDragging) return;
		wrapper.scrollLeft = scrollLeft - (e.clientX - startX);
		wrapper.scrollTop = scrollTop - (e.clientY - startY);
	});

	wrapper.addEventListener('pointerup', (e) => {
		isDragging = false;
		wrapper.releasePointerCapture(e.pointerId);
	});

	// Зум колёсиком мыши на ПК
	wrapper.addEventListener('wheel', (e) => {
		if (e.ctrlKey) return; // даём работать нативному зуму браузера
		e.preventDefault();
		const delta = e.deltaY > 0 ? -0.1 : 0.1;
		scale = Math.max(1, Math.min(5, scale + delta)); // от 1x до 5x
		lbImg.style.transform = `scale(${scale})`;
	}, { passive: false });
})();