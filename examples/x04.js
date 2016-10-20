"use strict";

/**
 * Example of getstr
 */

$(document).ready(function () {

    var mesg = "Enter a string: ";
    var str;
    var maxyx = {row: 0, col: 0};

    x.initscr($("#container"));
    x.process();

    maxyx = x.getmaxyx();

    x.mvprintw(maxyx.row/2, (maxyx.col - mesg.length)/2, mesg);
    
    x.refresh();

    x.getstr(); // Только устанавливается статус "getstr", вся обработка выполняется в цикле keypress

});

var x = new Webcurses('Example 4');

x.process = function () {

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
