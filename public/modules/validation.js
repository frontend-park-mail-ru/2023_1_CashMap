let MAX_PASSWORD_LENGTH = 100;
let MIN_PASSWORD_LENGTH = 8;
let MIN_LETTERS_IN_PASSWORD_COEF = 0.4;


class Validation {
	constructor() {
		this.validateFunc = {
			password: this._validatePasswordAuth,
			email: this._validateEmail,
			firstName: this._validateName,
			secondName: this._validateSurname,
			secondPassword: this._validateTwoPasswords,
		}
	}

	validate(inputField, type) {
		return this.validateFunc[type](inputField);
	}

	_validatePasswordAuth(password) {
		if (password.length < 8) {
			return {
				status: false,
				error: 'Пароль слишком короткий'
			};
		}

		password.trim()

		for (const symbol of password) {
			if (symbol == ' ') {
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

	_validatePassword(password) {
		if (!(password instanceof String) && typeof(password) != 'string') {
			return {
				status: false,
				error: 'Недопустимый формат данных'
			};
		}


		if (password.length == 0) {
			return {
				status: false,
				error: 'Введите пароль'
			};
		}

		if (password.length < MIN_PASSWORD_LENGTH) {
			return {
				status: false,
				error: 'Пароль слишком короткий'
			};
		}

		if (password.length > MAX_PASSWORD_LENGTH) {
			return {
				status: false,
				error: 'Пароль слишком длинный'
			};
		}

		let hasUpperCaseChars = false;
		let hasDigits = false;
		let hasSpeacialChars = false;
		let lettersNumber = 0;
		for (const char of password) {

			// проверка на букву
			if (char.match(/[a-zA-Z]/i) != null) {
				lettersNumber++;

				// проверка на врехний регистр
				if (char == char.toUpperCase()) {
					hasUpperCaseChars = true;
				}
			}

			// проверка на цифру
			if (char.match(/^[0-9]+$/) != null) {
				hasDigits = true;
			}

			// провекра на спец. символы
			if (char.match(/^[^0-9a-zA-Z]+$/) != null) {
				hasSpeacialChars = true;
			}

			// проверка на кириллицу
			if (char.match(/[а-яА-Я]/i) != null) {
				return {
					status: false,
					error: 'Кириллица в пароле не допускается'
				};
			}

			if (char == ' ') {
				return {
					status: false,
					error: 'Пробелы в пароле не допускаются'
				};
			}

		}

		if ((lettersNumber / password.length) < MIN_LETTERS_IN_PASSWORD_COEF) {
			return {
				status: false,
				error: 'Слишком мало букв в пароле'
			};
		}

		if (!hasSpeacialChars) {
			return {
				status: false,
				error: 'Пароль должен содержать хотя бы один специальный символ'
			};
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

	_validateEmail(email) {
		if (email.length == 0) {
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

		const match = email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

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

	_validateName(name) {
		if (!(name instanceof String) && typeof(name) != 'string') {
			return {
				status: false,
				error: 'Недопустимый формат данных'
			};
		}

		if (name.length == 0) {
			return {
				status: false,
				error: 'Введите имя'
			};
		}

		for (const char of name) {
			if (char.match(/[a-zA-Zа-яА-Я]/i) == null) {
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

	_validateSurname(surname) {
		if (!(surname instanceof String) && typeof(surname) != 'string') {
			return {
				status: false,
				error: 'Недопустимый формат данных'
			};
		}

		if (surname.length == 0) {
			return {
				status: false,
				error: 'Введите фамилию'
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

	_validateTwoPasswords(password1, password2) {
		if (password2.length == 0) {
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
