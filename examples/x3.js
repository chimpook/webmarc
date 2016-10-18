"use strict";

/**
 * Example of move and addch
 */

$(document).ready(function () {

    var mesg = "Just a string";
    var str;
    var maxyx = {row: 0, col: 0};

    x3.initscr($("#container"));

    maxyx = x3.getmaxyx();

    x3.mvprintw(maxyx.row/2, (maxyx.col - mesg.length)/2, mesg);

    x3.mvprintw(maxyx.row - 2, 0, "This screen has "+maxyx.row+" rows and "+maxyx.col+" columns\n");

    x3.printw("Try resizing your window (if possible, but not) and then run this program again");
    x3.refresh();

});

var x3 = {
    __proto__: webcurses
};