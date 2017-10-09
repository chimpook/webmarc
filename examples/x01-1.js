/**
 * Example 1.
 * The Hello World !!! Program
 * Extended example of getch command
 */

;"use strict";

var app = {

    x: new Webcurses('Example 1. Extended example of getch command.'),

    status: 'wait',

    strings: [],

    start: function () {
        var self = this;
        self.x.initscr($("#container"));
        self.x.printw("Hello World !!! \nPress enter:\n");
        self.x.refresh();
        self.x.makebacklink("../index.html");
    },

    findWait: function() {
        var self = this;

        for (var i = 0; i < self.strings.length; i++) {
            if (self.strings[i].status === 'wait') {
                return i;
            }
        }
    },

    process: function () {
        var self = this;

        $(document).keypress(function(event) {

            switch (event.keyCode) {

                case self.x.KEY_ENTER:

                    var w = self.findWait();

                    if (w !== undefined) {
                        self.strings[w].status = 'ready';

                        for (var i = w; i < self.strings.length && self.strings[i].status === 'ready'; i++) {
                            self.x.printw(self.strings[i].text);
                            self.strings[i].status = 'done';
                        }
                        self.x.refresh();
                    }
                    break;

                default:
                    break;
            }
            //console.log('keyCode: ' + event.keyCode + ', Which: ' + event.which);

            self.x.refresh();
            event.preventDefault();
        });
    },

    getch: function () {
        var self = this;

        self.status = 'wait';
    },

    print: function(string) {
        var self = this;
        var index = self.strings.length;

        self.strings[index] = {
            text: string,
            status: self.status
        };

        self.status = 'ready';
    }
};

$(document).ready(function () {
    app.start();
    app.getch();
    app.print("Первая строка\n");
    app.getch();
    app.print("Вторая строка\n");
    app.print("Третья строка\n");
    app.getch();
    app.print("Четвертая строка\n");
    app.process();
});