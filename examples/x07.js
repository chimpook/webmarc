/**
 * Example 7.
 * Window Border example
 */

;"use strict";

var app = {

    x: new Webcurses('Example 7. Window Border example'),

    start: function () {
        var self = this;
        var height, width, startx, starty;

        self.x.initscr($("#container"));

        self.x.printw('Press F1 to exit');

        height = 3;
        width = 10;
        starty = (self.x.LINES - height) / 2;
        startx = (self.x.COLS - width) / 2;

        self.x.newwin('my_win', height, width, starty, startx);
        self.x.wbox('my_win', 'utf-8');

        self.x.refresh();
        self.buildbacklink();
    },

    process: function () {
        var self = this;

        $(document).keypress(function(event) {
            //self.x.wprintw('test', String(event.which));

            // Управляем первым окном (под Chrome не работает, там events надо как-то по-другому организовывать)
            switch (event.keyCode) {

                case self.x.KEY_LEFT:
                    self.x.movewinto('my_win', 'left');
                    break;

                case self.x.KEY_UP:
                    self.x.movewinto('my_win', 'up');
                    break;

                case self.x.KEY_RIGHT:
                    self.x.movewinto('my_win', 'right');
                    break;

                case self.x.KEY_DOWN:
                    self.x.movewinto('my_win', 'down');
                    break;

                case self.x.KEY_F1:
                    window.location.href = "../";
                    break;

                default:
                    break;
            }

            //console.log('keyCode: ' + event.keyCode + ', Which: ' + event.which);

            self.x.refresh();
            event.preventDefault();
        });
    },

    buildbacklink: function () {
        var self = this;

        $("body").append('<div class="back" style="position: absolute; top: ' + self.x.ws_height + 'px;">' +
            '<a href="../index.html" style="color: royalblue;">Back to Index</a>' +
            '</div>');
    }
};

$(document).ready(function () {
    app.start();
    app.process();
});