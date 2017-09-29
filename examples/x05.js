"use strict";

/**
 * 1) Загрузка текста исходного текстового файла,
 * 2) выделение жирным шрифтом комментариев,
 * 3) вывод постраничный
 */

var app = {

    status: 'start',
    buffer: [],
    index: 0,

    /**
     * Подключаем Webcurses
     */
    wc: new Webcurses('Example 5'),

    /**
     * Запуск приложения
     */
    start: function() {
        var self = this;
        self.wc.initscr($("#container"));
        self.wc.refresh();
        self.handlers();
        self.process();
    },

    /**
     * Вывод на экран фрагмента файла
     */
    output: function() {
        var self = this;
        var prev = null;

        self.wc.clear();
        for (var row = 0; row < (self.wc.SCREEN_H - 1) && self.index < self.buffer.length; row++) {
            for (var col = 0; col <= self.wc.SCREEN_W && self.index < self.buffer.length; col++) {
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

    /**
     * Обработчики событий
     */
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

    /**
     * Рабочий процесс приложения
     */
    process: function () {

        var self = this;

        $(document).keypress(function(event) {
            switch (self.wc.status) {
                case 'getstr':
                    if (event.which === 13) {
                        console.log("enter key pressed");
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
