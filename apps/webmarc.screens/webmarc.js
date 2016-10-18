"use strict";

/**
 * Webmarc webcurses App
 */

$(document).ready(function () {

    //console.time('init');
    webcurses.initscr($("#container"));
    //console.timeEnd('init');

    /**
     * Test of printw
     */
    //webcurses.printw("Выяснить причину, по которой для некоторых заявок не создается заявление на покупку лицензии. ");
    //webcurses.printw("\nРеализовать логирование 1 license для процедуры выдачи лицензий.");

    /**
     * Test of load
     */
    webcurses.load(webscreen.start);

    webcurses.refresh();

    /**
     * По нажатию на Enter переключаем демонстрационные экраны
     */

});

var app = new Webcurses('Webmarc screens switch demo');
app.process = function() {
    var self = this;
    $(document).keypress(function (event) {
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