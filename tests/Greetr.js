(function (global, $) {

	var Greetr = function(firstName, lastName, language) {
		return new Greetr.init(firstName, lastName, language);
	}	

	// Private properties
	var supportedLangs = ['en', 'es'];
	var greetings = {
		en: 'Hello',
		es: 'Hola'
	};
	var formalGreetings = {
		en: 'Greetings',
		es: 'Saludos'
	};

	var logMessages = {
		en: 'Logged in',
		es: 'Inicio session'
	};

	var elem;

	// Here I put any methods that I want to use inside
	// any object that is returned from Greetr
	Greetr.prototype = {
		// public properties and methods
		fullName: function() {
			return this.firstName + ' ' + this.lastName;
		},

		select: function(selector, context) {
			if (!$) {
				throw "jQuery is not loaded!";
			}

			if (!selector) {
				throw 'Missing jQuery selector!';
			}

			this.elem = $(selector, context);

			return this;
		},

		validate: function() {
			if (supportedLangs.indexOf(this.language) === -1) {
				throw "Invalid language";
			}
		},

		greeting: function() {
			return greetings[this.language] + ' ' + this.firstName + '!';
		},

		formalGreeting: function() {
			return formalGreetings[this.language] + ', ' + this.fullName() + '.';
		},

		greet: function(isFormal) {

			var msg;

			// if undefined or null it will be coerced to 'false'
			if (isFormal) {
				msg = this.formalGreeting();
			} else {
				msg = this.greeting();
			}

			if (console) {
				console.log(msg);
				this.elem.text(msg);
			}

			// 'this' refers to the calling object at execution
			// time, which makes the method chainable
			return this;
		},

		log: function() {

			if (console) {
				console.log(logMessages[this.language] + ': ' + this.fullName())
			}

			return this;
		},

		setLang: function(lang) {

			try {
				var old_lang = this.language;
				this.language = lang;
				this.validate();

				return this;

			} catch(e) {
				this.language = old_lang;
				console.log('The passed language (and you passed "' + lang + '") does not exist, so we revert back to the old one (which is "' + old_lang + '")!');
				return this;
			}
		}
	};

	Greetr.init = function(firstName, lastName, language) {

		var self = this;

		self.firstName = firstName || '';
		self.lastName = lastName || '';
		self.language = language || 'en';

		self.validate();
	};

	Greetr.init.prototype = Greetr.prototype;

	global.Greetr = global.G$ = Greetr;


})(window, jQuery);