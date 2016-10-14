"use strict";

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
    $(document).keypress(function (event) {
        if (event.which == 13) {

            if (webcurses.status === 'start') {
                // Экран имитации рабочего интерфейса
                webcurses.load(webscreen.imitate);
                webcurses.status = 'imitate';
            } else {
                // Стартовый экран с заставкой
                webcurses.load(webscreen.start);
                webcurses.status = 'start';
            }

            webcurses.refresh();
            event.preventDefault();
        }
    });

});