"use strict";

/**
 * Example of move and addch
 */

$(document).ready(function () {

    var mesg = "Just a string";
    var row, col;

    webcurses.initscr($("#container"));

    row = webcurses.getmaxy();
    col = webcurses.getmaxx();

    webcurses.mvprintw(row/2, (col - mesg.length)/2, mesg);

    webcurses.mvprintw(row - 2, 0, "This screen has "+row+" rows and "+col+" columns\n");

    webcurses.printw("Try resizing your window (if possible, but not) and then run this program again");
    webcurses.refresh();

});