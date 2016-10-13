"use strict";

$(document).ready(function () {

    webcurses.initscr($("#container"));
    webcurses.printw("Hello World of biggest world of the world of warcraft of billing system and state building!!!");
    webcurses.printw("---Rock'N'Roll forever!!!");
    webcurses.refresh();
    //console.log(webcurses.buf);
    //webcurses.initkeys();

});


var webcurses = {

    SCREEN_W: 80,
    SCREEN_H: 25,
    FONT_AJUST: 0.58,
    GRID: 0,

    // id рабочего пространства
    wss: 'workspace',

    ram: [],

    buf: '',

    cursor: {
        y: 0,
        x: 0
    },

    /**
     * Инициализация экрана
     */
    initscr: function (container) {

        // Формируем массив видеопамяти
        var row, col;
        for (row = 0; row < this.SCREEN_H; row++) {
            this.ram[row] = [];
            for (col = 0; col < this.SCREEN_W; col++) {
                this.ram[row][col] = {ch: '', bg: 0, fg: 7};
            }
        }

        // Формируем буффер для вывода
        this.ram2buf();

        // Выводим рабочую область в контейнер
        container.append('<div id="' + this.wss + '">' + this.buf + '</div>');

        // Объект рабочего пространства
        var ws = $("#" + this.wss);

        // Размер контейнера
        var container_w = container.width();
        var container_h = container.height();

        // Размер рабочей области
        var ws_w = ws.width();
        var ws_h = ws.height();

        /**
         * Рассчитываем размер шрифта таким образом,
         * чтобы наиболее точно вписать рабочую область в контейнер
         * @type {number}
         */
        // Подгонка по высоте
        var font_h = container_h / this.SCREEN_H ^ 0; // -SCREEN_H - пока включена сетка
        var font_w = font_h * this.FONT_AJUST;
        if ((font_w + this.GRID) * this.SCREEN_W > container_w) {
            // Подгонка по ширине
            //console.log("font too big");
            font_w = (container_w - this.GRID) / this.SCREEN_W ^ 0;
            font_h = (font_w - this.GRID) / this.FONT_AJUST ^ 0;
        }

        ws.css("font-size", font_h + "px");
        //console.log(font_h, ' x ', font_w);

        // Коэффициенты трансформации
        var transf_w = (container_w / ws_w);
        var transf_h = (container_h / ws_h);
        //console.log("transf: ", transf_w, "x", transf_h);

        // Трансформация
        ws.css("display", "block");
        //ws.css("width", container_w);
        //ws.css("transform-origin", transf_w/2 + "px " + transf_h/2 + "px");
        //ws.css("transform-origin", "0px 0px");
        //ws.css("transform", "scale("+transf_w+", "+transf_h+")");
        //ws.css("transform", "scale("+transf_w+", 1)");

        // Очистка рабочей области
        //ws.html("");
    },

    /**
     * Формирование буффера для вывода на экран
     */
    ram2buf: function () {
        var row, col;
        for (row = 0; row < this.SCREEN_H; row++) {
            for (col = 0; col < this.SCREEN_W; col++) {
                this.ram[row][col] = {ch: '&nbsp;', bg: 0, fg: 7};
                this.buf +=
                    '<span class="row_' + row + ' col_' + col + ' bg_' + this.ram[row][col].bg + ' fg_' + this.ram[row][col].fg + '">'
                    + this.ram[row][col].ch
                    + '</span>';
            }
            this.buf += '<br/>';
        }
    },

    printw: function (str) {
        var y, x;
        for (var i = 0, len = str.length; i < len; i++) {

            if (this.cursor.x >= this.SCREEN_W) {
                this.cursor.y++;
                this.cursor.x = 0;
            }
            if (this.cursor.y >= this.SCREEN_H) {
                this.cursor.y = 0;
                this.cursor.x = 0;
            }

            this.ram[this.cursor.y][this.cursor.x++].ch = str[i];
        }
    },

    refresh: function () {
        //console.log(this.ws[0].id);
        var row, col, ch;
        for (row = 0; row < this.SCREEN_H; row++) {
            for (col = 0; col < this.SCREEN_W; col++) {
                ch = this.ram[row][col].ch == ' ' ? '&nbsp;' : this.ram[row][col].ch;
                $("#" + this.wss + " span.row_" + row + ".col_" + col).html(ch);
                //console.log("#"+this.wss+" .row_"+row+" .col_"+col);
            }
        }
    }

};