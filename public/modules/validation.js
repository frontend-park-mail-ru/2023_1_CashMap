import { maxBirthday } from "../static/htmlConst.js";

const MAX_PASSWORD_LENGTH = 100;
const MIN_PASSWORD_LENGTH = 8;
const MAX_NAME_LENGTH = 30;
const MAX_STATUS_LENGTH = 30;
const MAX_BIO_LENGTH = 200;


/**
 * класс, реализующий валидацию форм
 */
class Validation {
	/**
     * @constructor
     * конструктор метода
     */
	constructor() {
		this.validateFunc = {
			password: this._validatePasswordAuth,
			email: this._validateEmail,
			firstName: this._validateName,
			lastName: this._validateSurname,
			secondPassword: this._validateTwoPasswords,
			userStatus: this._validateStatus,
			bio: this._validateBio,
			birthday: this._validateBirthday,
		}
	}

	/**
	 * метод для валидации
	 * @param {String} inputField - поле ввода 
	 * @param {String} errorField - поле ошибки
	 * @param {String} type - тип проверки
	 * @returns 
	 */
	validation(inputField, errorField, type, style) {
		const validationRes = this.validateFunc[type](inputField.value);

		if (validationRes.status === false) {
			errorField.textContent = validationRes.error;
			if (style === 'default') {
				inputField.classList.remove('input-block__field-correct');
				inputField.classList.add('input-block__field-incorrect');
			} else {
				inputField.classList.remove('input-block-settings__field-correct');
				inputField.classList.add('input-block-settings__field-incorrect');
			}
			return false;
		} else {
			errorField.textContent = '';
			if (style === 'default') {
				inputField.classList.add('input-block__field-correct');
				inputField.classList.remove('input-block__field-incorrect');
			} else {
				inputField.classList.add('input-block-settings__field-correct');
				inputField.classList.remove('input-block-settings__field-incorrect');
			}
			return true;
		}
	}

	/**
     * @private метод, валидирующий пароль при авторизации
     * @param {String} password пароль для валидации
	 * @return {Boolean} статус
     * @return {String | null} сообщение об ошибке
     */
	_validatePasswordAuth(password) {
		if (password.length < 8) {
			return {
				status: false,
				error: `Пароль должен быть длиннее ${MIN_PASSWORD_LENGTH} символов`
			};
		}

		password.trim();

		for (const symbol of password) {
			if (symbol === ' ') {
				return {
					status: false,
					error: 'Пробелы в пароле недопустимы'
				};
			}
		}

		return {
			status: true,
		};
	}

	/**
     * @private метод, валидирующий пароль
     * @param {String} password пароль для валидации
	 * @return {Boolean} статус
     * @return {String | null} сообщение об ошибке
     */
	_validatePassword(password) {
		if (!(password instanceof String) && typeof(password) != 'string') {
			return {
				status: false,
				error: 'Недопустимый формат данных'
			};
		}


		if (password.length === 0) {
			return {
				status: false,
				error: 'Введите пароль'
			};
		}

		if (password.length < MIN_PASSWORD_LENGTH) {
			return {
				status: false,
				error: `Пароль должен быть длиннее ${MIN_PASSWORD_LENGTH} символов`
			};
		}

		if (password.length > MAX_PASSWORD_LENGTH) {
			return {
				status: false,
				error: `Пароль должен быть короче ${MAX_PASSWORD_LENGTH} символов`
			};
		}

		let hasUpperCaseChars = false;
		let hasDigits = false;
		for (const char of password) {

			if (char.match(/[a-zA-Z]/i) != null) {
				// проверка на врехний регистр
				if (char === char.toUpperCase()) {
					hasUpperCaseChars = true;
				}
			}

			// проверка на цифру
			if (char.match(/^[0-9]+$/) != null) {
				hasDigits = true;
			}

			if (char === ' ') {
				return {
					status: false,
					error: 'Пробелы в пароле не допускаются'
				};
			}

		}

		if (!hasDigits) {
			return {
				status: false,
				error: 'Пароль должен содержать хотя бы одну цифру'
			};
		}

		if (!hasUpperCaseChars) {
			return {
				status: false,
				error: 'Пароль должен содержать хотя бы одну заглавную букву'
			};
		}

		return {
			status: true,
		};
	}

	/**
     * @private метод, валидирующий почту
     * @param {String} email email для валидации
	 * @return {Boolean} статус
     * @return {String | null} сообщение об ошибке
     */
	_validateEmail(email) {
		if (email.length === 0) {
			return {
				status: false,
				error: 'Введите электронную почту'
			};
		}

		if (!(email instanceof String) && typeof(email) != 'string') {
			return {
				status: false,
				error: 'Недопустимый формат данных'
			};
		}

		const match = email.match(/@/);

		if (match == null) {
			return {
				status: false,
				error: 'Некорректный адрес электронной почты'
			};
		}

		return {
			status: true,
		}
	}

	/**
     * @private метод, валидирующий имя
     * @param {String} name имя для валидации
	 * @return {Boolean} статус
     * @return {String | null} сообщение об ошибке
     */
	_validateName(name) {
		if (!(name instanceof String) && typeof(name) != 'string') {
			return {
				status: false,
				error: 'Недопустимый формат данных'
			};
		}

		if (name.length === 0) {
			return {
				status: false,
				error: 'Введите имя'
			};
		}

		if (name.length > MAX_NAME_LENGTH) {
			return {
				status: false,
				error: `Имя должно быть короче ${MAX_NAME_LENGTH} символов`
			};
		}

		for (const char of name) {
			if (char.match(/[a-zA-Zа-яА-ЯЁё]/i) == null) {
				return {
					status: false,
					error: 'Имя должно содержать буквенные символы'
				};
			}
		}

		return {
			status: true,
		}
	}

	/**
     * @private метод, валидирующий фамилию
     * @param {String} surname имя для валидации
	 * @return {Boolean} статус
     * @return {String | null} сообщение об ошибке
     */
	_validateSurname(surname) {
		if (!(surname instanceof String) && typeof(surname) != 'string') {
			return {
				status: false,
				error: 'Недопустимый формат данных'
			};
		}

		if (surname.length === 0) {
			return {
				status: false,
				error: 'Введите фамилию'
			};
		}

		if (surname.length > MAX_NAME_LENGTH) {
			return {
				status: false,
				error: `Фамилия должна быть короче ${MAX_NAME_LENGTH} символов`
			};
		}

		for (const char of surname) {
			if (char.match(/[a-zA-Zа-яА-Я]/i) == null) {
				return {
					status: false,
					error: 'Фамилия должна содержать буквенные символы'
				};
			}
		}

		return {
			status: true,
		}
	}

	/**
     * @private метод, валидирующий статус
     * @param {String} userStatus статус для валидации
	 * @return {Boolean} статус
     * @return {String | null} сообщение об ошибке
     */
	_validateStatus(userStatus) {
		if (!(userStatus instanceof String) && typeof(userStatus) != 'string') {
			return {
				status: false,
				error: 'Недопустимый формат данных'
			};
		}

		if (userStatus.length === 0) {
			return {
				status: false,
				error: 'Введите статус'
			};
		}

		if (userStatus.length > MAX_STATUS_LENGTH) {
			return {
				status: false,
				error: `Статус должен быть короче ${MAX_STATUS_LENGTH} символов`
			};
		}

		return {
			status: true,
		}
	}

	/**
     * @private метод, валидирующий био
     * @param {String} bio био для валидации
	 * @return {Boolean} статус
     * @return {String | null} сообщение об ошибке
     */
	_validateBio(bio) {
		if (!(bio instanceof String) && typeof(bio) != 'string') {
			return {
				status: false,
				error: 'Недопустимый формат данных'
			};
		}

		if (bio.length > MAX_BIO_LENGTH) {
			return {
				status: false,
				error: `Информация должна быть короче ${MAX_BIO_LENGTH} символов`
			};
		}

		return {
			status: true,
		}
	}

	/**
     * @private метод, валидирующий день рождения
     * @param {String} birthday день рождения для валидации
	 * @return {Boolean} статус
     * @return {String | null} сообщение об ошибке
     */
	_validateBirthday(birthday) {
		if (birthday > maxBirthday) {
			return {
				status: false,
				error: `Год рождения не должен превышать ${maxBirthday.slice(0, 4)}`
			};
		}

		return {
			status: true,
		}
	}

	/**
     * @private метод, сравнивающий два пароля
     * @param {String} password1 первый пароль
	 * @param {String} password2 второй пароль
	 * @return {Boolean} статус
     * @return {String | null} сообщение об ошибке
     */
	_validateTwoPasswords(password1, password2) {
		if (password2.length === 0) {
			return {
				status: false,
				error: 'Введите пароль'
			};
		}

		if (password1 !== password2) {
			return {
				status: false,
				error: 'Пароли не совпадают'
			};
		}

		return {
			status: true,
		}
	}
}

export default new Validation();
