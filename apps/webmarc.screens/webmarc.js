"use strict";

/**
 * Webmarc webcurses App
 */

$(document).ready(function () {

    //console.time('init');
    app.initscr($("#container"));
    //console.timeEnd('init');

    app.load(webscreen.start);
    app.refresh();

    /**
     * По нажатию на Enter переключаем демонстрационные экраны
     */
    app.process();

});

var app = new Webcurses('Webmarc screens switch demo');

app.process = function() {
    var self = this;
    $(document).keypress(function (event) {
        console.log(event.which);
        if (event.which == 13) {

            if (self.status === 'start') {
                // Экран имитации рабочего интерфейса
                self.load(webscreen.imitate);
                self.status = 'imitate';
            } else {
                // Стартовый экран с заставкой
                self.load(webscreen.start);
                self.status = 'start';
            }

            self.refresh();
            event.preventDefault();
        }
    });
};
