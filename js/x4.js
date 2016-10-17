"use strict";

/**
 * Example of getstr
 */

$(document).ready(function () {

    var mesg = "Enter a string: ";
    var str;
    var maxyx = {row: 0, col: 0};

    webcurses.initscr($("#container"));

    maxyx = webcurses.getmaxyx();

    webcurses.mvprintw(maxyx.row/2, (maxyx.col - mesg.length)/2, mesg);
    
    webcurses.refresh();

    webcurses.getstr(); // Только устанавливается статус "getstr", вся обработка выполняется в цикле keypress

    $(document).keypress(function (event) {
        //console.log(event.which);
        switch (webcurses.status) {
            case 'getstr':
                if (event.which == 13) {
                    webcurses.status = '';
                    webcurses.mvprintw(maxyx.row - 2, 0, "You Entered: " + webcurses.str);
                }
                webcurses.str += String.fromCharCode(event.which);
                webcurses.printw(String.fromCharCode(event.which));
                webcurses.refresh();
                break;
            default:
                break;
        }
        event.preventDefault();
    });


});