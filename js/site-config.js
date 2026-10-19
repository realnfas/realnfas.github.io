window.SITE_CONFIG = {
	// ─── Версия ───
	version:                 'V1.0.5',
	buildDate:               'D08.10.2026',

	// ─── Ссылки ───
	links: {
		telegram:             'https://t.me/realnfas',
		neurobridge:          'https://t.me/neuro_bridge',
		telegramAriko:        'https://t.me/ArikoDog',
		telegramRay:          'https://t.me/realnfox',
		telegramTiya:         'https://t.me/realtiya',
		artstation:           'https://www.artstation.com/realnfas',
		youtube:              'https://www.youtube.com/@realnfas',
		sketchfab:            'https://sketchfab.com/realnfas',
		furaffinity:          'https://www.furaffinity.net/user/nfas',
		ficbook:              'https://ficbook.net/authors/1632327',
		twitter:              'https://x.com/realnfas',
		tumblr:               'https://www.tumblr.com/realnfas',
		patreon:              'https://www.patreon.com/realnfas',
		yoomoney:             'https://yoomoney.ru/fundraise/aiRB6QQZyjg.240102',
		email:                'nfox.alt.studio+subscribers@gmail.com',
		yougile:              'https://ru.yougile.com/board/5hn0vyr5g1dv',
	},

	// ─── Тексты ───
	texts: {
		studioName:           'NFox | ALT STUDIO',
		studioShort:          'NFAS',
		studioSubname:        'NFOX | ALTERNATIVE STUDIO',
		nicknameGeneral:      'NFox',
		startYear:             2017,
		// Меню проекта
		navDisclaimer:        'Дисклеймер',
		navRules:             'Правила',
		navCopyright:         'Авторское право',
		navBasic:             'Основная информация',
		navFaq:               'FAQ/ЧАВО',
		navPrice:             'Прайс-лист',
		navProjects:          'Проекты и очередь заказов',
		// Общие тексты документации
		docBackMenu:          'Главное меню',
		docBackContacts:      'Связаться с нами',
		docFooterRespect:     'Уважайте творчество других~',
		docFooterRights:      'Все права защищены',
		navRoadmap:           'Наш путь',
		foundationDate:       '01.01.2017',
		artDeptName:          'NFAS ARTWORKS',
		artDeptDesc:          'Создаёт изображения',
		// Подразделения студии
		subArtworksName:      'NFAS ARTWORKS',
		subArtworksDesc:      'Научиться рисовать.',
		subPhotoshotsName:    'NFAS PHOTO SHOTS',
		subPhotoshotsDesc:    'Научиться фотографировать.',
		subRecordsName:       'NFAS RECORDS',
		subRecordsDesc:       'Научиться обрабатывать звук.',
		subCinematicsName:    'NFAS CINEMATICS',
		subCinematicsDesc:    'Научиться снимать.',
		subVolumetricsName:   'NFAS 3D VOLUMETRICS',
		subVolumetricsDesc:   'Научиться создавать 3D-модели.',
		subStoriesName:       'NFAS STORIES',
		subStoriesDesc:       'Научиться писать рассказы.',
		subDevelopmentName:   'NFAS DEVELOPMENT',
		subDevelopmentDesc:   'Научиться писать на языке программирования.',
	},

	// ─── Пути к медиа ───
	media: {
		root:                 '/media/',
		img:                  '/media/img/',
		icons:                '/media/img/ico/',
		team:                 '/media/img/team/',
		bg:                   '/media/img/bg/',
		works:                '/media/works/',
		video:                '/media/video/',
		plashka:              '/media/img/plashka/',
		pics:                 '/media/img/pics/',
	},

	// ─── Имена плашек ───
	plashkas: {
	main:                    'plashka_main.png',
	menu:                    'plashka_menu.png',
	disclaimer:              'plashka_disclaimer.png',
	rules:                   'plashka_rules.png',
	license:                 'plashka_license.png',
	basis:                   'plashka_basis.png',
	faq:                     'plashka_faq.png',
	price:                   'plashka_price.png',
},

	// ─── Пути к страницам сайта ───
	pages: {
		home:                 '/index.html',
		menu:                 '/pages/p2/main_menu.html',
		roadmap:              '/pages/p3/roadmap.html',
		contacts:             '/pages/p4/contactus.html',
		// страницы докуме    нтации
		disclaimer:           '/pages/docs/disclaimer.html',
		rules:                '/pages/docs/rules.html',
		copyright:            '/pages/docs/copyright.html',
		basic:                '/pages/docs/basic.html',
		faq:                  '/pages/docs/faq.html',
		price:                '/pages/docs/price.html',
		spoiler:              '/pages/docs/spoiler.html',
		licence:              '/pages/docs/licence.html',
	},
};

// ─── ОБРАБОТЧИКИ ───
document.addEventListener('DOMContentLoaded', () => {
	// 1. Плашка версии
	const plashka = document.getElementById('plashka_version');
	if (plashka) {
		plashka.innerHTML =
			'<p>' + SITE_CONFIG.buildDate + '</p>' +
			'<p>' + SITE_CONFIG.version   + '</p>';
	}

	// 2. Ссылки
	document.querySelectorAll('[data-cfg]').forEach(el => {
		const key = el.dataset.cfg;
		const val = SITE_CONFIG.links[key];
		if (!val) return;
		el.href = key === 'email' ? `mailto:${val}` : val;
	});

	// 3. Картинки
	document.querySelectorAll('[data-media]').forEach(el => {
		const val = el.dataset.media;
		const slashIdx = val.indexOf('/');
		if (slashIdx < 0) return;

		const folder = val.slice(0, slashIdx);
		const file   = val.slice(slashIdx + 1);
		const base   = SITE_CONFIG.media[folder];
		if (!base) return;

		el.src = base + file;
	});

	// 4. Фоновые картинки (для слайдов)
	document.querySelectorAll('[data-media-bg]').forEach(el => {
		const val = el.dataset.mediaBg;
		const slashIdx = val.indexOf('/');
		if (slashIdx < 0) return;

		const folder = val.slice(0, slashIdx);
		const file   = val.slice(slashIdx + 1);
		const base   = SITE_CONFIG.media[folder];
		if (!base) return;

		el.style.backgroundImage = `url('${base}${file}')`;
	});

	// 5. Подстановка текста
	document.querySelectorAll('[data-text]').forEach(el => {
		const key = el.dataset.text;
		const val = SITE_CONFIG.texts[key];
		if (val === undefined) return;

		if (el.tagName === 'IMG') {
			el.alt = val;
		} else if (el.tagName === 'INPUT') {
			el.placeholder = val;
		} else {
			el.textContent = val;
		}
	});

	// 6. Подстановка плашек
	document.querySelectorAll('[data-plashka]').forEach(el => {
		const file = SITE_CONFIG.plashkas[el.dataset.plashka];
		if (!file) return;
		el.src = SITE_CONFIG.media.plashka + file;
	});

	// 7. Подстановка любой формы (HTML)
	document.querySelectorAll('[data-text-html]').forEach(el => {
		const val = SITE_CONFIG.texts[el.dataset.textHtml];
		if (val === undefined) return;
		el.innerHTML = val;
	});

	// 8. Внутренние ссылки
	document.querySelectorAll('[data-page]').forEach(el => {
		const key = el.dataset.page;
		const val = SITE_CONFIG.pages[key];
		if (!val) return;
		el.href = val;
	});
	
	// 9. Подсветка активного пункта меню
	const currentPath = window.location.pathname;
	document.querySelectorAll('.menu__item').forEach(item => {
	item.classList.remove('active');
	const href = item.getAttribute('href') || '';
	if (href && currentPath.endsWith(href.split('/').pop())) {
		item.classList.add('active');
	}
	});
	// Для главной — первый пункт активен по умолчанию
	if (currentPath === '/' || currentPath.endsWith('index.html')) {
	const first = document.querySelector('.menu__item');
	if (first) first.classList.add('active');
	}
	
	// 10. Прогресс-бар прокрутки
	const progressBar = document.getElementById('scrollProgress');
	if (progressBar) {
	const updateProgress = () => {
		const max = document.documentElement.scrollHeight - window.innerHeight;
		const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
		progressBar.style.width = Math.min(100, Math.max(0, percent)) + '%';
	};
	window.addEventListener('scroll', () => requestAnimationFrame(updateProgress), { passive: true });
	window.addEventListener('resize', updateProgress);
	updateProgress();
	}

	// 11. Плавное появление элементов .reveal
	const revealItems = document.querySelectorAll('.reveal:not(.portfolio__item)');
	if (revealItems.length && 'IntersectionObserver' in window) {
		const io = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					// Находим .reveal-родителя (обычно это секция) и помечаем его
					const target = entry.target.closest('.reveal') || entry.target;
					target.classList.add('is-visible');
					io.unobserve(entry.target);
				}
			});
		});
	
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				revealItems.forEach((el, i) => {
					el.style.transitionDelay = `${(i % 4) * 40}ms`;
				
					// 🎯 Если это большая секция с пустым верхом —
					// следим за её ВИДИМЫМ содержимым, а не за пустым краем
					if (el.tagName === 'SECTION' && el.offsetHeight > window.innerHeight) {
						const visible = el.querySelector(
							'.text_caption, .hscroll__head, .cta, .services, .faq, .reviews, .stats, .doc-body'
						);
						if (visible) {
							io.observe(visible);
							return;
						}
					}
					io.observe(el);
				});
			});
		});
	} else {
		revealItems.forEach(el => el.classList.add('is-visible'));
	}

		// ─── Галерея: заголовок и карточки появляются последовательно ───
	const hscrollSection  = document.getElementById('hscroll');
	const hscrollViewport = hscrollSection?.querySelector('.hscroll__viewport');
	const hscrollHead     = hscrollSection?.querySelector('.hscroll__head');

	if (hscrollViewport && 'IntersectionObserver' in window) {
		const galleryCards = hscrollViewport.querySelectorAll('.portfolio__item');
		if (galleryCards.length) {
			let played = false;

			const galleryIO = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting && !played) {
						played = true;

						// 1. Через 200ms показываем заголовок галереи
						setTimeout(() => {
							if (hscrollHead) hscrollHead.classList.add('is-visible');
						}, 150);

						// 2. Через 800ms — начинаем показывать карточки по одной
						setTimeout(() => {
							galleryCards.forEach((card, i) => {
								setTimeout(() => card.classList.add('is-visible'), i * 280);
							});
						}, 300);

						galleryIO.unobserve(hscrollViewport);
					}
				});
			});

			galleryIO.observe(hscrollViewport);
		}
	}

	// 12. Анимированные прогресс-бары
	// (исключаем hero-бар дорожной карты — им управляет roadmap.js)
	const progressBars = Array.from(document.querySelectorAll('.doc-goal__bar-fill'))
	.filter(bar => bar.id !== 'studioProgressFill');
	if (progressBars.length && 'IntersectionObserver' in window) {
		const progressIO = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const value = entry.target.dataset.progress || '0';
					entry.target.style.width = value + '%';
					progressIO.unobserve(entry.target);
				}
				});
	}, { threshold: 0.3 });

	progressBars.forEach(bar => {
		bar.style.width = '0%';        // старт
		progressIO.observe(bar);
		});
	} else {
	progressBars.forEach(bar => {
		bar.style.width = (bar.dataset.progress || '0') + '%';
		});
	}

	// 13. Ссылка на страницу "Все права защищены" в docs-футере
	document.querySelectorAll('[data-text="docFooterRights"]').forEach(el => {
		const text = SITE_CONFIG.texts.docFooterRights || 'Все права защищены';
		const url = SITE_CONFIG.pages.licence;
	
		// Если ссылки на страницу нет — оставляем обычный текст
		if (!url) {
			el.textContent = text;
			return;
		}
		
		// Заменяем содержимое <p> на ссылку
		el.innerHTML = '';
		const link = document.createElement('a');
		link.href = url;
		link.className = 'doc-footer__rights-link';
		link.textContent = text;
		el.appendChild(link);
	});

	// 14. Перетаскивание таймлайна мышкой / пальцем
	const timeline = document.getElementById('docTimeline');
	if (timeline) {
		let isDown = false;
		let startX = 0;
		let scrollStart = 0;
		let moved = false;

		timeline.addEventListener('pointerdown', (e) => {
			// На тач-устройствах работает нативный скролл
			if (e.pointerType === 'touch') return;

			isDown = true;
			moved = false;
			timeline.classList.add('is-dragging');
			startX = e.clientX;
			scrollStart = timeline.scrollLeft;

			try { timeline.setPointerCapture(e.pointerId); } catch (_) {}
		});

		timeline.addEventListener('pointermove', (e) => {
			if (!isDown) return;
			const walk = (e.clientX - startX) * 1.5;

			// Первое заметное движение — блокируем выделение текста
			if (!moved && Math.abs(walk) > 3) {
				moved = true;
				e.preventDefault();
			}

			if (moved) {
				timeline.scrollLeft = scrollStart - walk;
			}
		});

		const stopDrag = (e) => {
			if (!isDown) return;
			isDown = false;
			timeline.classList.remove('is-dragging');
			try { timeline.releasePointerCapture(e.pointerId); } catch (_) {}
		};

		timeline.addEventListener('pointerup', stopDrag);
		timeline.addEventListener('pointercancel', stopDrag);
		timeline.addEventListener('pointerleave', stopDrag);
	}

		// 15. Бургер-меню для мобилки
	const menuEl = document.querySelector('.menu');
	if (menuEl) {
		// Кнопка-бургер
		const toggleBtn = document.createElement('button');
		toggleBtn.className = 'menu-toggle';
		toggleBtn.id = 'menuToggle';
		toggleBtn.type = 'button';
		toggleBtn.setAttribute('aria-label', 'Открыть меню');
		toggleBtn.setAttribute('aria-expanded', 'false');
		toggleBtn.setAttribute('aria-controls', 'menuDrawer');
		toggleBtn.innerHTML =
			'<span class="menu-toggle__line"></span>' +
			'<span class="menu-toggle__line"></span>' +
			'<span class="menu-toggle__line"></span>';
		document.body.appendChild(toggleBtn);

		// Выезжающее меню
		const drawer = document.createElement('div');
		drawer.className = 'menu-drawer';
		drawer.id = 'menuDrawer';
		drawer.setAttribute('aria-hidden', 'true');

		const backdrop = document.createElement('div');
		backdrop.className = 'menu-drawer__backdrop';
		backdrop.dataset.closeMenu = '';
		drawer.appendChild(backdrop);

		const nav = document.createElement('nav');
		nav.className = 'menu-drawer__nav';
		nav.setAttribute('aria-label', 'Основное меню');

		menuEl.querySelectorAll('.menu__item').forEach(item => {
			const clone = document.createElement('a');
			clone.href = item.getAttribute('href') || '#';
			clone.className = 'menu-drawer__item';
			clone.textContent = item.textContent;
			if (item.classList.contains('active')) clone.classList.add('active');
			clone.addEventListener('click', closeDrawer);
			nav.appendChild(clone);
		});

		drawer.appendChild(nav);
		document.body.appendChild(drawer);

		let lastFocused = null;

		function openDrawer() {
			lastFocused = document.activeElement;
			drawer.classList.add('is-open');
			toggleBtn.classList.add('is-active');
			toggleBtn.setAttribute('aria-expanded', 'true');
			drawer.setAttribute('aria-hidden', 'false');
			document.body.style.overflow = 'hidden';

			// Фокус на первую ссылку меню
			const firstItem = nav.querySelector('.menu-drawer__item');
			if (firstItem) setTimeout(() => firstItem.focus(), 60);
		}

		function closeDrawer() {
			drawer.classList.remove('is-open');
			toggleBtn.classList.remove('is-active');
			toggleBtn.setAttribute('aria-expanded', 'false');
			drawer.setAttribute('aria-hidden', 'true');
			document.body.style.overflow = '';
			if (lastFocused && lastFocused.focus) lastFocused.focus();
		}

		toggleBtn.addEventListener('click', () => {
			if (drawer.classList.contains('is-open')) closeDrawer();
			else openDrawer();
		});

		drawer.addEventListener('click', (e) => {
			if (e.target.closest('[data-close-menu]')) closeDrawer();
		});

		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
				closeDrawer();
			}
		});
	}

		// 16. Кнопка «Наверх»
	const scrollTopBtn = document.createElement('button');
	scrollTopBtn.className = 'scroll-top';
	scrollTopBtn.type = 'button';
	scrollTopBtn.setAttribute('aria-label', 'Вернуться наверх');
	scrollTopBtn.innerHTML =
		'<svg viewBox="0 0 24 24" aria-hidden="true">' +
		'<path d="M12 19V5M5 12l7-7 7 7"/>' +
		'</svg>';
	document.body.appendChild(scrollTopBtn);

	const SCROLL_TOP_THRESHOLD = window.innerHeight * 0.8;

	function updateScrollTopVisibility() {
		if (window.scrollY > SCROLL_TOP_THRESHOLD) {
			scrollTopBtn.classList.add('is-visible');
		} else {
			scrollTopBtn.classList.remove('is-visible');
		}
	}

	scrollTopBtn.addEventListener('click', () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});

	window.addEventListener('scroll', () => {
		requestAnimationFrame(updateScrollTopVisibility);
	}, { passive: true });

	updateScrollTopVisibility();

	// 17. Футер с автоматическим годом
	const footer = document.getElementById('text_footer');
	if (footer) {
		const { studioName, startYear } = SITE_CONFIG.texts;
		const now = new Date().getFullYear();
		const range = now > startYear ? `${startYear}–${now}` : `${startYear}`;
		footer.textContent = `© ${range} ${studioName}`;
	}
	});