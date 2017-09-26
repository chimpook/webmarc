"use strict";

/**
 * Webmarc webcurses App
 */

$(document).ready(function () {

    //console.time('init');
    app.initscr($("#container"));
    //console.timeEnd('init');

    app.load(webscreen.start);
    app.refresh();

    /**
     * По нажатию на Enter переключаем демонстрационные экраны
     */
    app.process();

});

var app = new Webcurses('Webmarc windows demo');

app.process = function() {
    var self = this;
    $(document).keypress(function (event) {

        switch (self.status) {

            case 'start':

                if (event.keyCode === 13) {
                    self.load(webscreen.work);
                    self.status = 'work';
                }
                if (event.keyCode === 27) {
                    self.load(webscreen.end);
                    self.status = 'end';
                }

                break;

            case 'work':

                if (event.keyCode === 27) {
                    self.load(webscreen.end);
                    self.status = 'end';
                }

                break;

            case 'end':
                console.log(event);
                break;

        }

        self.refresh();
        event.preventDefault();
    });
};
