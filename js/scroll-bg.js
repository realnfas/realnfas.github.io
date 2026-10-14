(() => {
	const slides = Array.from(document.querySelectorAll('.slide'));
	const total  = slides.length;
	if (!total) return;

	const rawAnchors = Array.from(document.querySelectorAll('[data-bg-slide]'))
		.map(el => ({
			el,
			slide: Math.max(0, Math.min(total - 1, parseInt(el.dataset.bgSlide, 10) || 0))
		}));

	if (!rawAnchors.length) return;

	const isMobile = () => window.matchMedia('(max-width: 900px)').matches;

	// ─────────────────────────────────────────────────────────
	//  НАСТРОЙКИ
	//
	//  enabled: true  → переключение слайдов активно
	//  enabled: false → фон статичен (первый слайд), без анимаций
	//
	//  Остальные параметры работают только при enabled: true
	// ─────────────────────────────────────────────────────────
	const PRESETS = {
		desktop: {
			enabled: true,                 // ← ВЫКЛЮЧАТЕЛЬ: true / false

			angle: 140, slideY: 35, scaleBoost: 1.1, fade: 0.5, easing: 0.025,
			transitionStart: 0.35, transitionEnd: 1.0
			// Для десктопа работает плавная интерполяция между якорями.
			// Хочешь другой режим? Добавь `anchorMode: 1.0` и убери
			// transitionStart/transitionEnd — включится режим появления якоря.
		},
		mobile: {
			enabled: true,                 // ← ВЫКЛЮЧАТЕЛЬ: true / false

			angle: 25, slideY: 15, scaleBoost: 0.10, fade: 0.30, easing: 0.06,
			anchorMode: 0.9
			// anchorMode: 1.0 — фон меняется, когда следующий якорь появляется
			// у нижнего края экрана. Меньше = позже, больше = раньше.
		}
	};

	let config = isMobile() ? PRESETS.mobile : PRESETS.desktop;
	let anchors = [];
	let target = 0, current = 0, running = false;
	let lastDocHeight = 0;

	function rebuildAnchors() {
		const scrollY = window.scrollY || window.pageYOffset;
		anchors = rawAnchors
			.map(a => ({
				top: a.el.getBoundingClientRect().top + scrollY,
				slide: a.slide
			}))
			.sort((a, b) => a.top - b.top);
		lastDocHeight = document.documentElement.scrollHeight;
	}

	function computeSlide(pivot) {
		if (!anchors.length) return 0;
		if (pivot <= anchors[0].top) return anchors[0].slide;

		const last = anchors[anchors.length - 1];
		if (pivot >= last.top) return last.slide;

		for (let i = 0; i < anchors.length - 1; i++) {
			const a = anchors[i];
			const b = anchors[i + 1];
			if (pivot < a.top || pivot > b.top) continue;

			const span = b.top - a.top;
			if (span <= 0) return b.slide;

			const start = a.top + span * config.transitionStart;
			const end   = a.top + span * config.transitionEnd;
			const len   = end - start;

			if (pivot < start) return a.slide;
			if (pivot > end)   return b.slide;

			let t = (pivot - start) / len;
			t = Math.max(0, Math.min(1, t));
			t = t * t * (3 - 2 * t);
			return a.slide + (b.slide - a.slide) * t;
		}
		return 0;
	}

	function readScroll() {
		// ─── Если переключение отключено — цель всегда слайд 0 ───
		if (config.enabled === false) {
			target = 0;
			return;
		}

		// Пересобираем якоря, если высота документа изменилась
		// (hscroll раскрылся, картинки подгрузились и т.п.)
		if (document.documentElement.scrollHeight !== lastDocHeight) {
			rebuildAnchors();
		}

		// ─── Режим «появления якоря» (anchorMode) ───
		if (config.anchorMode !== undefined) {
			const triggerY = window.scrollY + window.innerHeight * config.anchorMode;
			let result = anchors[0]?.slide ?? 0;
			for (let i = 0; i < anchors.length; i++) {
				if (anchors[i].top <= triggerY) result = anchors[i].slide;
				else break;
			}
			target = result;
			return;
		}

		// ─── Режим плавной интерполяции между якорями (transitionStart/End) ───
		const pivot = window.scrollY + window.innerHeight * 0.5;
		target = computeSlide(pivot);
	}

	function applyFrame() {
		// ─── Если переключение отключено — показываем только первый слайд ───
		if (config.enabled === false) {
			slides.forEach((s, i) => {
				s.style.transform = '';
				s.style.opacity = i === 0 ? '1' : '0';
				s.style.zIndex = i === 0 ? '1' : '0';
			});
			return;
		}

		// ─── Обычный режим анимации ───
		for (let i = 0; i < total; i++) {
			const slide = slides[i];
			const offset = current - i;
			const clamped = Math.max(-1, Math.min(1, offset));
			const angle   = clamped * config.angle;
			const shiftY  = clamped * config.slideY;
			const scale   = 1 + Math.abs(clamped) * config.scaleBoost;
			const opacity = 1 - Math.min(1, Math.abs(clamped) * config.fade);
			slide.style.transform = `translateY(${shiftY}%) rotate(${angle}deg) scale(${scale})`;
			slide.style.opacity = opacity.toFixed(3);
			slide.style.zIndex  = String(1000 - Math.round(Math.abs(clamped) * 100));
		}
	}

	function render() {
		current += (target - current) * config.easing;
		if (Math.abs(target - current) < 0.0005) current = target;
		applyFrame();
		if (current !== target) requestAnimationFrame(render);
		else running = false;
	}

	function kick() {
		if (!running) { running = true; requestAnimationFrame(render); }
	}

	function updatePreset() {
		config = isMobile() ? PRESETS.mobile : PRESETS.desktop;
	}

	function init() {
		rebuildAnchors();
		readScroll();
		current = target;
		applyFrame();
		kick();
	}

	window.addEventListener('scroll', () => { readScroll(); kick(); }, { passive: true });
	window.addEventListener('resize', () => {
		updatePreset();
		rebuildAnchors();
		readScroll();
		kick();
	});
	window.addEventListener('load', init);

	// Страховка: несколько раз пересобираем якоря после загрузки,
	// чтобы поймать момент раскрытия hscroll
	[100, 300, 700, 1500].forEach(ms => {
		setTimeout(() => { rebuildAnchors(); readScroll(); kick(); }, ms);
	});

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();