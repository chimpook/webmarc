"use strict";

/**
 * Example of move and addch
 */

$(document).ready(function () {

    var mesg = "Just a string";
    var str;
    var maxyx = {row: 0, col: 0};

    x.initscr($("#container"));

    maxyx = x.getmaxyx();

    x.mvprintw(maxyx.row/2, (maxyx.col - mesg.length)/2, mesg);

    x.mvprintw(maxyx.row - 2, 0, "This screen has "+maxyx.row+" rows and "+maxyx.col+" columns\n");

    x.printw("Try resizing your window (if possible, but not) and then run this program again");
    x.refresh();

});

var x = new Webcurses('Example 03');
