"use strict";
/**
 * Example of attron and attroff and keyboard processing
 */

$(document).ready(function () {

    webcurses.initscr($("#container"));
    webcurses.printw("Type any character to see it in ");

    webcurses.attron('A_BOLD');
    webcurses.printw("bold\n");   // done    //console.timeEnd('init');
    webcurses.attroff('A_BOLD');

    webcurses.refresh();

    $(document).keypress(function (event) {
        console.log(event.which);
        if (webcurses.A_BOLD) {
            webcurses.attroff('A_BOLD');
        } else {
            webcurses.attron('A_BOLD');
        }
        webcurses.printw(String.fromCharCode(event.which));
        webcurses.refresh();
        event.preventDefault();
    });

});