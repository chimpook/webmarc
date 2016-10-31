"use strict";

/**
 * Example of getstr
 */

$(document).ready(function () {

    x.initscr($("#container"));

    x.printw("Обычная строка...");

    x.attron(x.A_BOLD);
    x.printw("Жирная строка...");
    x.attroff(x.A_BOLD);

    x.printw("Вернулись к обычной строке...");

    x.attron(x.A_BOLD | x.A_UNDERLINE);
    x.printw("Жирная подчеркнутая строка...");
    x.attroff(x.A_BOLD);

    x.printw("Подчеркнутая строке...");

    x.attron(x.A_REVERSE);

    x.printw("Инверсия...");

    x.attron(x.A_BLINK);

    x.printw("Мигающая инверсия...");

    x.attron(x.A_INVIS);
    x.printw("Скрытый текст...");

    x.attrset(x.A_NORMAL);

    x.printw("Вернулись к обычной строке...");

    x.refresh();

});

var x = new Webcurses('Example 5');

