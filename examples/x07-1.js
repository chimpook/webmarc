/**
 * Example 7.
 * Window Border example
 */

;"use strict";

var app = {

    x: new Webcurses('Example 7. Window Border example'),

    start: function () {
        var self = this;

        self.x.initscr($("#container"));

        // Наполняем стандартное окно
        self.x.fillw('@', self.x.COLOR_DARKRED, self.x.COLOR_LIGHTYELLOW);
        self.x.printw('stdscr');

        // Создаем и наполняем тестовое окно alfa
        self.x.newwin('alfa', 12, 12, 5, 4);
        self.x.wfillw('alfa', '@', self.x.COLOR_DARKBLUE, self.x.COLOR_CYAN);
        self.x.wbox('alfa', 'ascii');
        self.x.wprintw('alfa', 'alfa');

        // Создаем и наполняем тестовое окно beta
        self.x.newwin('beta', 10, 10, 10, 40);
        self.x.wfillw('beta', '@', self.x.COLOR_DARKGRAY, self.x.COLOR_LIGHTGREEN);
        self.x.wbox('beta', 'utf-8');
        self.x.wprintw('beta', 'beta');

        //self.x.delwin('beta');
        self.x.refresh();
        self.x.makebacklink("../index.html");
    },

    process: function () {
        var self = this;

        $(document).keypress(function(event) {
            //self.x.wprintw('test', String(event.which));

            // Управляем первым окном (под Chrome не работает, там events надо как-то по-другому организовывать)
            switch (event.keyCode) {

                case self.x.KEY_LEFT:
                    self.x.movewinto('alfa', 'left');
                    break;

                case self.x.KEY_UP:
                    self.x.movewinto('alfa', 'up');
                    break;

                case self.x.KEY_RIGHT:
                    self.x.movewinto('alfa', 'right');
                    break;

                case self.x.KEY_DOWN:
                    self.x.movewinto('alfa', 'down');
                    break;

                default:
                    break;
            }

            // Управляем вторым окном
            switch (event.which) {

                case self.x.KEY_A:
                    self.x.movewinto('beta', 'left');
                    break;

                case self.x.KEY_W:
                    self.x.movewinto('beta', 'up');
                    break;

                case self.x.KEY_D:
                    self.x.movewinto('beta', 'right');
                    break;

                case self.x.KEY_S:
                    self.x.movewinto('beta', 'down');
                    break;

                default:
                    break;
            }
            //console.log('keyCode: ' + event.keyCode + ', Which: ' + event.which);

            self.x.refresh();
            event.preventDefault();
        });
    }
};

$(document).ready(function () {
    app.start();
    app.process();
});