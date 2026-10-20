(() => {
	'use strict';

	const page   = document.getElementById('errorPage');
	const digits = document.getElementById('errorDigits');
	const phrase = document.getElementById('errorPhrase');
	const easter = document.getElementById('errorEaster');
	if (!page || !digits || !phrase) return;

	// Фразы, которые меняются при клике
	const phrases = [
		'Лисичка утащила эту страницу в норку~ 🦊',
		'Страница сбежала в параллельную вселенную ✨',
		'Здесь была страница. Была. Уже нет (◕‿◕)',
		'404: файл не найден. Но ты не расстраивайся~',
		'Может, она есть в другой реальности? 🌌',
		'А может, это ты потерялся, а не страница? 👀',
		'Такой страницы нет. Совсем. Никак. Абсолютно.',
		'Кажется, кто-то нажал не туда ^^',
		'Ошибка 404. Но не ошибка в тебе. Ты — молодец~',
		'Страница ушла пить чай с Тией. Не дождалась тебя ☕️',
		'Файл был. Файл сплыл. Файл уплыл в облако~',
	];

	let currentIndex = -1;
	let clickCount   = 0;
	const EASTER_AT  = 10;   // на каком клике показать пасхалку

	// ——— Смена фразы с плавным фейдом ———
	function nextPhrase() {
		phrase.classList.add('is-changing');

		setTimeout(() => {
			currentIndex = (currentIndex + 1) % phrases.length;
			phrase.textContent = phrases[currentIndex];
			phrase.classList.remove('is-changing');
		}, 250);
	}

	// ——— Глитч ———
	function glitch() {
		page.classList.add('is-glitching');
		setTimeout(() => page.classList.remove('is-glitching'), 500);
	}

	// ——— Обработчик клика ———
	function handleClick() {
		glitch();
		nextPhrase();

		clickCount += 1;

		if (clickCount === EASTER_AT && easter && easter.hidden) {
			easter.hidden = false;
			// лёгкая вибрация, если браузер поддерживает
			if (navigator.vibrate) navigator.vibrate([30, 40, 30]);
		}
	}

	digits.addEventListener('click', handleClick);

	// ——— Клавиатура ———
	digits.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
			e.preventDefault();
			handleClick();
		}
	});
})();