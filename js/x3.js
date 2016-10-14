"use strict";

/**
 * Example of move and addch
 */

$(document).ready(function () {

    webcurses.initscr($("#container"));

    webcurses.move(12, 12);
    webcurses.addch('W');

    webcurses.move(0, 3);
    webcurses.attron('A_BOLD');
    webcurses.addch('l');
    webcurses.attroff('A_BOLD');

    webcurses.mvaddch(0, 4, 'l');

    webcurses.refresh();

});