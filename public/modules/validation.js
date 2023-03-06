let MAX_PASSWORD_LENGTH = 100;
let MIN_PASSWORD_LENGTH = 8;
let MIN_LETTERS_IN_PASSWORD_COEF = 0.4;

function validatePassword(password) {
	if (!(password instanceof String) && typeof(password) != 'string') {
		return {
			status: false,
			errors: 'invalid data type'
		};
	}


	if (password.length < MIN_PASSWORD_LENGTH) {
		return {
			status: false,
			error: 'password is too short' 
		};
	}

	if (password.length > MAX_PASSWORD_LENGTH) {
		return {
			status: false,
			error: 'password is too long' 
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
				error: 'cyrillic characters\'re not allowed' 
			};
		}

		if (char == ' ') {
			return {
				status: false,
				error: 'whitespaces in password\'re not allowed' 
			};
		}

	}

	if ((lettersNumber / password.length) < MIN_LETTERS_IN_PASSWORD_COEF) {
		return {
			status: false,
			error: 'too few letters in password' 
		};
	}

	if (!hasSpeacialChars) {
		return {
			status: false,
			error: 'password must contain at least one speacial char' 
		};
	}


	if (!hasDigits) {
		return {
			status: false,
			error: 'password must contain at least one digit' 
		};
	}

	if (!hasUpperCaseChars) {
		return {
			status: false,
			error: 'password must contain at least one uppercase symbol' 
		};
	}

	return {
		status: true, 
	}; 
}

function validateEmail(email) {
	if (!(email instanceof String) && typeof(email) != 'string') {
		return {
			status: false,
			errors: 'invalid data type'
		};
	}

	match = email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

	return {status: true} ? match != null : {status: false, error: 'invalid email'};
}

function validateName(name) {	
	if (!(name instanceof String) && typeof(name) != 'string') {
		return {
			status: false,
			errors: 'invalid data type'
		};
	}

	if (name.length == 0) {
		return {
			status: false,
			errors: 'name is empty'
		};
	}

	for (const char of name) {
		if (char.match(/[a-zA-Z]/i) == null) {
			return {
				status: false,
				errors: 'name can\'t contain non-letter symbols'
			};
		}
	}

	return {
		status: true,
	}
}

function validateTwoPasswords(password1, password2) {
	if (password1 !== password2) {
		return {
			status: false,
			errors: 'Пароли не совпадают'
		};
	}

	return {
		status: true,
	}
}