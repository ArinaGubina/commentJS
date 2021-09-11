// Константе filterByType присвоить значение: результат выполнения стрелочной функции, принимающей аргументы: type и values (values через spread оператор собирает в массив все передаваемые аргументы, начиная со второго) и выполняющей фильтрацию массива values на соответствие типа элемента массива передаваемому типу type. Возвращает массив из элементов, которые соответствуют условию фильтра.
const filterByType = (type, ...values) => values.filter(value => typeof value === type),
	// Константе hideAllResponseBlocks присвоить результат выполнения стрелочной функции
	hideAllResponseBlocks = () => {
		// Константе responseBlocksArray присвоить результат выполнения метода Array.from, преобразующего в массив NodeList, содержащий все элементы страницы с классом dialog__response-block
		const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block'));
		// обход массива responseBlocksArray в цикле с целью скрыть каждый элемент с помощью свойства display: none
		responseBlocksArray.forEach(block => block.style.display = 'none');
	},

	// константе showResponseBlock присвоить результат выполнения стрелочной функции, принимающей на вход три аргумента
	showResponseBlock = (blockSelector, msgText, spanSelector) => {
		// вызвать hideAllResponseBlocks
		hideAllResponseBlocks();
		// задать свойство display со значением block для элемента с селектором blockSelector (первый аргумент)
		document.querySelector(blockSelector).style.display = 'block';
		// если значение третьего аргумента spanSelector можно интерпретировать как true
		if (spanSelector) {
			// вписать текст msgText в элемент с селектором blockSelector (первый аргумент)
			document.querySelector(spanSelector).textContent = msgText;
		}
	},
	// Константам showError, howResults и showNoResults  присвоить результат выполнения стрелочной функции, принимающей на вход аргумент msgText (для showError и howResults) и возвращающей значение ф-ции showResponseBlock от указанных аргументов
	showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error'),

	showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok'),

	showNoResults = () => showResponseBlock('.dialog__response-block_no-results'),

	// функция tryFilterByType, принимающая на вход два аргумента type и values
	tryFilterByType = (type, values) => {
		// конструкция try .. catch для отлова ошибок. Пытается выполнить try {} и, если возникает любая ошибка, выполняет вместо него catch {}
		try {
			// в константу valuesArray пытается записать результат выполнения функция tryFilterByType (который после возвращения выполняется как js-код с помощью небезопасной функции eval() ). В качестве аргументов передаются: значение type в виде строки и значение values через прямую подстановку не как строка, а прямо в исходном виде (что вызывает ошибку "is not defined" при попытке ввести более одного слова через пробел без запятой). Предполагается, что результатом будет являться массив, который с помощью .join(', ') будет преобразован в строку через разделитель.
			const valuesArray = eval(`filterByType('${type}', ${values})`).join(", ");
			// тернарный оператор, присваивающий константе alertMsg строку "Данные с типом " (куда передаются значение аргумента type и строка valuesArray), если количество символов в valuesArray > 0, и присваивающий строку "Отсутствуют данные типа " (куда передается только type) в обратном случае.
			const alertMsg = (valuesArray.length) ?
				`Данные с типом ${type}: ${valuesArray}` :
				`Отсутствуют данные типа ${type}`;
			// вызов функции showResults с аргументом alertMsg
			showResults(alertMsg);
		} catch (e) {
			// вызов функции showError с аргументом:- строкой "Ошибка: " (куда подставляется значение ошибки)
			showError(`Ошибка: ${e}`);
		}
	};

// Константе filterButton присвоить значение: элемент с id = filter-btn (кнопка "Фильтровать")
const filterButton = document.querySelector('#filter-btn');

// добавить обработчик события "клик" на кнопку "Фильтровать"
filterButton.addEventListener('click', e => {
	// Константе typeInput присвоить значение: элемент с id = type (поле "Тип данных")
	const typeInput = document.querySelector('#type');
	// Константе dataInput присвоить значение: элемент с id = data (поле "Данные")
	const dataInput = document.querySelector('#data');

	// если значение поля "Данные" - пустая строка
	if (dataInput.value === '') {
		// установить сообщение для ошибки ввода в поле "Данные" с указанным текстом
		dataInput.setCustomValidity('Поле не должно быть пустым!');
		// вызвать функцию showNoResults
		showNoResults();
	} else { // иначе: если значение поля "Данные" - НЕ пустая строка
		// убрать ошибку и очистить сообщение ошибки ввода в поле "Данные"
		dataInput.setCustomValidity('');
		// остановить стандартное поведение браузера (отправку формы) при нажатии на кнопу с типом "submit"
		e.preventDefault();
		// вызвать ф-цию tryFilterByType и передать в нее аргументы: значение поля "Тип данных" (зачем-то с обрезкой пробелов) и  значение поля "Данные" без пробелов в начале и конце строки
		tryFilterByType(typeInput.value.trim(), dataInput.value.trim());
	}
});
