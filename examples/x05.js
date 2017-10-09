/**
 * Example 5.
 * A Simple Attributes example
 */

;"use strict";

/**
 * 1) Загрузка текста исходного текстового файла,
 * 2) выделение жирным шрифтом комментариев,
 * 3) вывод постраничный
 */

var app = {

    buffer: '',
    index: 0,

    wc: new Webcurses('Example 5'),

    start: function() {
        var self = this;
        self.wc.initscr($("#container"));
        self.wc.refresh();
        self.handlers();
        self.process();
    },

    output: function() {
        var self = this;
        var prev = null;

        self.wc.clear();
        for (var row = 0; row < (self.wc.LINES - 1) && self.index < self.buffer.length; row++) {
            for (var col = 0; col <= self.wc.COLS && self.index < self.buffer.length; col++) {
                if (self.buffer[self.index] === '\n') {
                    self.index++;
                    break;
                }
                if (self.buffer[self.index] === '*' && self.prev === '\/') {
                    self.wc.attron(self.wc.A_BOLD);
                }
                if (self.buffer[self.index] === '\/' && self.prev === '*') {
                    self.wc.attroff(self.wc.A_BOLD);
                }
                self.wc.mvaddch(row, col, self.buffer[self.index]);
                self.prev = self.buffer[self.index];
                self.index++;
            }
        }
        if (self.index === self.buffer.length) {
            self.wc.attron(self.wc.A_BLINK);
            self.wc.mvprintw(24,0,"<<end of file>>");
            self.wc.attroff(self.wc.A_BLINK);
        } else {
            self.wc.attron(self.wc.A_BLINK);
            self.wc.mvprintw(24,0,"<<press enter>>");
            self.wc.attroff(self.wc.A_BLINK);
            self.wc.getstr();
        }
        self.wc.refresh();
    },

    handlers: function() {
        var self = this;

        /**
         * Обработчик загрузки файла
         */
        $("#src").on('change', function(evt){
            $(this).hide();

            var src = evt.target.files[0];
            var reader = new FileReader();

            reader.onload = (function(theFile) {
                return function(e) {
                    //console.log(theFile);
                    self.buffer = e.target.result;
                    self.index = 0;
                    self.output();
                };
            })(src);
            reader.readAsText(src);
        });
    },

    process: function () {

        var self = this;

        $(document).keypress(function(event) {
            switch (self.wc.status) {
                case 'getstr':
                    if (event.which === 13) {
                        self.wc.status = '';
                        app.output();
                    }
                    break;
                default:
                    break;
            }
            event.preventDefault();
        });
    }
};

$(document).ready(function () {
    app.start();
});
