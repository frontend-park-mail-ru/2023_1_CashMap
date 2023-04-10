const MAX_PASSWORD_LENGTH = 100;
const MIN_PASSWORD_LENGTH = 8;
const MAX_NAME_LENGTH = 30;


class Validation {
	constructor() {
		this.validateFunc = {
			password: this._validatePasswordAuth,
			email: this._validateEmail,
			firstName: this._validateName,
			lastName: this._validateSurname,
			secondPassword: this._validateTwoPasswords,
		}
	}

	validation(inputField, errorField, type) {
		const validationRes = this.validateFunc[type](inputField.value);

		if (validationRes.status === false) {
			errorField.textContent = validationRes.error;
			inputField.classList.remove('input-block__field-correct');
			inputField.classList.add('input-block__field-incorrect');

			return false;
		} else {
			errorField.textContent = '';
			inputField.classList.add('input-block__field-correct');
			inputField.classList.remove('input-block__field-incorrect');

			return true;
		}
	}

	_validatePasswordAuth(password) {
		if (password.length < 8) {
			return {
				status: false,
				error: 'Пароль слишком короткий'
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

		if (name.length === 0) {
			return {
				status: false,
				error: 'Введите имя'
			};
		}

		if (name.length > MAX_NAME_LENGTH) {
			return {
				status: false,
				error: 'Имя слишком длинное'
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

		if (surname.length === 0) {
			return {
				status: false,
				error: 'Введите фамилию'
			};
		}

		if (surname.length > MAX_NAME_LENGTH) {
			return {
				status: false,
				error: 'Фамилия слишком длинная'
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
