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

var x4 = new Webcurses('Example 4');

x4.process = function () {

    var self = this;

    $(document).keypress(function(event) {
        switch (self.status) {
            case 'getstr':
                if (event.which == 13) {
                    self.status = '';
                    self.mvprintw(self.SCREEN_H - 2, 0, "You Entered: " + self.str);
                }
                self.str += String.fromCharCode(event.which);
                self.printw(String.fromCharCode(event.which));
                self.refresh();
                break;
            default:
                break;
        }
        event.preventDefault();
    });
};
