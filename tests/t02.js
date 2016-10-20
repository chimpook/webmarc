"use strict";

/**
 * Test of two listeners on same event
 * result: it works!
 */

$(document).ready(function () {

    t.initscr($("#container"));

    t.printw("Enter is '+', Space is '-':\n\n>");

    t.refresh();

    t.lst1();
    t.lst2();
});

var t = new Webcurses('Test 02');

t.lst1 = function () {
    var self = this;
    $(document).keypress(function(event) {
        switch (event.which) {
            case 13:
                self.attron('A_BOLD');
                self.printw('+');
                self.refresh();
                break;
            default:
                break;
        }
        //console.log(event.which);
        event.preventDefault();
    });
};

t.lst2 = function () {
    var self = this;
    $(document).keypress(function(event) {
        switch (event.which) {
            case 32:
                self.attroff('A_BOLD');
                self.printw('-');
                self.refresh();
                break;
            default:
                break;
        }
        //console.log(event.which);
        event.preventDefault();
    });
};
