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

    x.printw("Подчеркнутая строка...");

    x.attron(x.A_REVERSE);

    x.printw("Инверсия...");

    x.attron(x.A_BLINK);

    x.printw("Мигающая инверсия...");

    x.attron(x.A_INVIS);
    x.printw("Скрытый текст...");

    x.attrset(x.A_NORMAL);

    x.printw("Вернулись к обычной строке...");

    x.init_pair(1, x.COLOR_LIGHTYELLOW, x.COLOR_DARKRED);
    x.init_pair(2, x.COLOR_LIGHTCYAN, x.COLOR_DARKMAGENTA);

    x.chgat(10, x.A_BOLD, 1);

    x.printw("Цветная строка, но не вся...");

    x.chgat(-1, x.A_BOLD, 2);

    x.printw("Цветная строка, но не вся...");

    x.mvchgat(1,10,5,x.A_BLINK,2);

    x.printw("Ok.......");

    x.refresh();
});

var x = new Webcurses('Example 5');

