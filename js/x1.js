"use strict";

$(document).ready(function () {

    webcurses.initscr($("#container"));
    webcurses.printw("Выяснить причину, по которой для некоторых заявок не создается заявление на покупку лицензии. ");
    webcurses.printw("\nРеализовать логирование 1 license для процедуры выдачи лицензий.");
    webcurses.refresh();

});