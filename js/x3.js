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

    webcurses.move(0, 4);
    webcurses.addch('l');

    webcurses.refresh();

});