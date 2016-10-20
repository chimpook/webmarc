;"use strict";

/**
 * WEBCURSES Module
 */
(function () {

    //var a = $("body");
    //console.log(a);
    //var a = "qwer";

    function Webcurses(title) {
        this.title = title;
        //console.log($);
    }


    var version = '0.1';
    
    Webcurses.prototype = {
        SCREEN_W: 80,
        SCREEN_H: 25,
        FONT_AJUST: 0.58,
        GRID: 0,
        A_BOLD: 0,

        // Состояние системы (потом перенести в webmarc)
        status: 'start',

        // id рабочего пространства
        wss: 'workspace',

        ram: [],

        buf: '',

        cursor: {
            y: 0,
            x: 0
        },

        str: '',
        
        char: '',

        /**
         * Инициализация экрана
         */
        initscr: function (container) {

            // "Очищаем" видео-память
            this.clear();

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
            this.initkbd();
        },
        
        initkbd: function() {
            var self = this;
            $(document).keypress(function(event) {
                switch (self.status) {
                    case 'getch':
                        self.char = String.fromCharCode(event.which);
                        self.status = '';
                        break;
                    default:
                        break;
                }
                event.preventDefault();
            });
        },

        clear: function () {
            // Формируем массив видеопамяти
            var row, col;
            this.ram = [];
            this.cursor.x = 0;
            this.cursor.y = 0;
            this.buf = '';
            for (row = 0; row < this.SCREEN_H; row++) {
                this.ram[row] = [];
                for (col = 0; col < this.SCREEN_W; col++) {
                    this.ram[row][col] = {ch: ' ', bg: 0, fg: 7};
                }
            }
        },

        /**
         * Формирование буффера для вывода на экран
         */
        ram2buf: function () {
            var row, col;
            this.buf = '';
            for (row = 0; row < this.SCREEN_H; row++) {
                for (col = 0; col < this.SCREEN_W; col++) {
                    this.buf +=
                        '<span class="row_' + row + ' col_' + col
                        + ' bg_' + this.ram[row][col].bg + ' fg_' + this.ram[row][col].fg
                        + (this.ram[row][col].a_bold ? ' a_bold' : '') + '">'
                        + (this.ram[row][col].ch == ' ' ? '&nbsp;' : this.ram[row][col].ch)
                        + '</span>';
                }
                this.buf += '<br/>';
            }
        },

        printw: function (str) {
            var y, x, ch;

            for (var i = 0, len = str.length; i < len; i++) {

                if (str[i] === ' ') {
                    ch = '&nbsp;'
                } else {
                    ch = str[i];
                }

                if (ch == '\n') {
                    this.cursor.y++;
                    this.cursor.x = 0;
                    continue;
                }

                if (this.cursor.x >= this.SCREEN_W) {
                    this.cursor.y++;
                    this.cursor.x = 0;
                }
                if (this.cursor.y >= this.SCREEN_H) {
                    this.cursor.y = 0;
                    this.cursor.x = 0;
                }

                if (this.A_BOLD) {
                    this.ram[this.cursor.y][this.cursor.x].a_bold = 1;
                }
                this.ram[this.cursor.y][this.cursor.x++].ch = ch;
            }
        },

        refresh: function () {
            this.ram2buf();
            $("#" + this.wss).html(this.buf);

            /*
             // Этот метод обновления экрана отличается просто адовой ресурсоемкостью - до 1000 мс
             var row, col, chplace;
             for (row = 0; row < this.SCREEN_H; row++) {
             for (col = 0; col < this.SCREEN_W; col++) {
             chplace = $("#" + this.wss + " span.row_" + row + ".col_" + col);

             chplace.removeClass(function (index, css){
             return (css.match (/(^|\s)[bf]g_\S+/g) || []).join(' ');
             });
             chplace.addClass('bg_'+this.ram[row][col].bg);
             chplace.addClass('fg_'+this.ram[row][col].fg);

             chplace.html(this.ram[row][col].ch);
             }
             }
             */

        },

        load: function (scr) {
            var row, col, i, ch;
            for (i = 0, row = 0; row < this.SCREEN_H; row++) {
                for (col = 0; col < this.SCREEN_W; col++) {
                    if (scr.ch[i] === ' ') {
                        ch = '&nbsp;'
                    } else {
                        ch = scr.ch[i];
                    }
                    this.ram[row][col].ch = ch;
                    this.ram[row][col].bg = scr.bg[i];
                    this.ram[row][col].fg = scr.fg[i];
                    //console.log(scr.fg[i]);
                    i++;
                }
            }
        },

        attron: function (attr) {
            this.A_BOLD = 1;
        },

        attroff: function (attr) {
            this.A_BOLD = 0;
        },

        move: function (row, col) {
            if (row ^ 0 < this.SCREEN_H) {
                this.cursor.y = row ^ 0;
            }
            if (col ^ 0 < this.SCREEN_W) {
                this.cursor.x = col ^ 0;
            }
        },

        addch: function (chr) {
            if (chr === ' ') {
                chr = '&nbsp;'
            }

            if (this.A_BOLD) {
                this.ram[this.cursor.y][this.cursor.x].a_bold = 1;
            }

            this.ram[this.cursor.y][this.cursor.x].ch = chr;
            console.log(this.cursor.y, this.cursor.x, this.ram[this.cursor.y][this.cursor.x].ch);
        },

        mvaddch: function (row, col, chr) {
            this.move(row, col);
            this.addch(chr);
        },

        getmaxx: function () {
            return this.SCREEN_W;
        },

        getmaxy: function () {
            return this.SCREEN_H;
        },

        getmaxyx: function () {
            return {row: this.SCREEN_H, col: this.SCREEN_W};
        },

        mvprintw: function (row, col, str) {
            this.move(row, col);
            this.printw(str);
        },

        getstr: function () {
            this.status = 'getstr';
        },

        getyx: function () {
            return {y: this.cursor.y, x: this.cursor.x};
        },
        
        getch: function () {
            this.status = 'getch';
            while (this.status === 'getch') {}
            return this.chr;
        }
        
    };
    
    window.Webcurses = Webcurses;

}());
