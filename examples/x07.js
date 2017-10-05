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

        // Создаем и наполняем тестовое окно
        self.x.newwin('test', 12, 12, 5, 4);
        self.x.wfillw('test', '@', self.x.COLOR_DARKBLUE, self.x.COLOR_CYAN);
        self.x.wprintw('test', 'test');

        self.x.newwin('temp', 10, 10, 10, 40);
        self.x.wfillw('temp', '@', self.x.COLOR_DARKGRAY, self.x.COLOR_LIGHTGREEN);
        self.x.wprintw('temp', 'temp');

        //self.x.delwin('temp');
        self.x.refresh();
    },

    process: function () {
        var self = this;
        var begin;

        $(document).keypress(function(event) {
            //self.x.wprintw('test', String(event.which));
            begin = self.x.wgetbegin('test');

            switch (event.keyCode) {

                case 37:
                    begin.x--;
                    break;

                case 38:
                    begin.y--;
                    break;

                case 39:
                    begin.x++;
                    break;

                case 40:
                    begin.y++;
                    break;

                default:
                    break;
            }
            self.x.movewin('test', begin.y, begin.x);
            self.x.refresh();
            event.preventDefault();
        });
    }
};

$(document).ready(function () {
    app.start();
    app.process();
});