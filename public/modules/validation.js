function validatePassword(password) {
	if (!(password instanceof String) && typeof(password) != 'string') {
		return {
			status: false,
			error: 'invalid data type' 
		};
	}

	if (len(password) < 8) {
		return {
			status: false,
			error: 'password is too short' 
		};
	}

	if (len(password) > 100) {
		return {
			status: false,
			error: 'password is too long' 
		};
	}

	let hasUpperCaseChars = false;
	let hasDigits = false;
	let hasSpeacialChars = false;
	for (const char of password) {

		if (char == char.toUpperCase()) {
			hasUpperCaseChars = true;
		}

		if (char.match(/^[0-9]+$/) != null) {
			hasDigits = true;
		}

		if (char.match(/\W/g) != null) {
			hasSpeacialChars = true;
		}

		if (char == ' ') {
			return {
				status: false,
				error: 'whitespaces in password\'re not allowed' 
			};
		}

	}
}

function validateEmail(email) {

}

function validateName(name) {	

}