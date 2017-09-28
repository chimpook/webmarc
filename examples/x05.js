"use strict";

/**
 * 1) Загрузка текста исходного текстового файла,
 * 2) выделение жирным шрифтом комментариев,
 * TODO: 3) вывод постраничный
 */

var app = {

    status: 'start',
    buffer: [],
    index: 0,
    output: function() {
        var self = this;
        var prev = null;
        for (var row = 0; row <= self.wc.SCREEN_H && self.index < self.buffer.length; row++) {
            for (var col = 0; col <= self.wc.SCREEN_W && self.index < self.buffer.length; col++) {
                if (self.buffer[self.index] === '\n') {
                    col = 0;
                    row++;
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
            for (; self.buffer[self.index] !== '\n' && self.index < self.buffer.size; self.index++){}
        }
        self.wc.refresh();
    },

    wc: new Webcurses('Example 5')

};

$(document).ready(function () {

    /**
     * Инициализация приложения
     */
    app.wc.initscr($("#container"));
    app.wc.refresh();

    /**
     * Обработчик загрузки файла
     */
    $("#src").on('change', function(evt){
        $(this).hide();

        var src = evt.target.files[0];
        var reader = new FileReader();

        reader.onload = (function(theFile) {
            return function(e) {
                console.log(theFile);
                app.buffer = e.target.result;
                app.index = 0;
                app.output();
            };
        })(src);
        reader.readAsText(src);
    });

});
