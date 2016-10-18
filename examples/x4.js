"use strict";

/**
 * Example of getstr
 */

$(document).ready(function () {

    var mesg = "Enter a string: ";
    var str;
    var maxyx = {row: 0, col: 0};

    x4.initscr($("#container"));
    x4.process();

    maxyx = x4.getmaxyx();

    x4.mvprintw(maxyx.row/2, (maxyx.col - mesg.length)/2, mesg);
    
    x4.refresh();

    x4.getstr(); // Только устанавливается статус "getstr", вся обработка выполняется в цикле keypress

});

var x4 = {
  __proto__: webcurses,

    process: function () {
        $(document).keypress(function(event) {
            switch (x4.status) {
                case 'getstr':
                    if (event.which == 13) {
                        x4.status = '';
                        x4.mvprintw(x4.SCREEN_H - 2, 0, "You Entered: " + x4.str);
                    }
                    x4.str += String.fromCharCode(event.which);
                    x4.printw(String.fromCharCode(event.which));
                    x4.refresh();
                    break;
                default:
                    break;
            }
            event.preventDefault();
        });
    }

};