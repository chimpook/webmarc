"use strict";

/**
 * Example of move and addch
 */

$(document).ready(function () {

    var mesg = "Enter a string";
    var str;
    var maxyx = {row: 0, col: 0};

    webcurses.initscr($("#container"));

    maxyx = webcurses.getmaxyx();

    webcurses.mvprintw(maxyx.row/2, (maxyx.col - mesg.length)/2, mesg);

    webcurses.mvprintw(maxyx.row - 2, 0, "This screen has "+maxyx.row+" rows and "+maxyx.col+" columns\n");

    webcurses.printw("Try resizing your window (if possible, but not) and then run this program again");
    webcurses.refresh();

});