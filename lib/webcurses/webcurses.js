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

        SCREEN_W:       80,
        SCREEN_H:       25,
        FONT_AJUST:     0.58,
        GRID:           0,

        ATTR:           0x0000000,
        A_NORMAL:       0x0000000,
        A_STANDOUT:     0x0010000,
        A_UNDERLINE:    0x0020000,
        A_REVERSE:      0x0040000,
        A_BLINK:        0x0080000,
        A_DIM:          0x0100000,
        A_BOLD:         0x0200000,
        A_PROTECT:      0x1000000,
        A_INVIS:        0x0800000,
        A_ALTCHARSET:   0x0400000,
        A_CHARTEXT:     0x00000ff,

        color_pairs:    [],
        
        COLOR_BLACK:        '0',

        COLOR_RED:          '1',
        COLOR_GREEN:        '2',
        COLOR_YELLOW:       '3',
        COLOR_BLUE:         '4',
        COLOR_MAGENTA:      '5',
        COLOR_CYAN:         '6',
        COLOR_WHITE:        '7',
        COLOR_GRAY:         '8',

        COLOR_DARKRED:      '9',
        COLOR_DARKGREEN:    'a',
        COLOR_DARKYELLOW:   'b',
        COLOR_DARKBLUE:     'c',
        COLOR_DARKMAGENTA:  'd',
        COLOR_DARKCYAN:     'e',
        COLOR_DARKGRAY:     'f',
        
        COLOR_DIMGRAY:    'g',
        COLOR_LIGHTRED:     'h',
        COLOR_LIGHTGREEN:   'i',
        COLOR_LIGHTYELLOW:  'j',
        COLOR_LIGHTBLUE:    'k',
        COLOR_LIGHTMAGENTA: 'l',
        COLOR_LIGHTCYAN:    'm',
        COLOR_LIGHTGRAY:    'n',
        

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
             * (пока отключено)
             * TODO: Разобраться с алгоритмом и коэффициентами.
             * @type {number}
             */
/*
            // Подгонка по высоте
            var font_h = container_h / this.SCREEN_H ^ 0; // -SCREEN_H - пока включена сетка
            var font_w = font_h * this.FONT_AJUST;
            if ((font_w + this.GRID) * this.SCREEN_W > container_w) {
                // Подгонка по ширине
                //console.log("font too big");
                font_w = (container_w - this.GRID) / this.SCREEN_W ^ 0;
                font_h = (font_w - this.GRID) / this.FONT_AJUST ^ 0;
            }
            console.log(font_h, ' x ', font_w);
            ws.css("font-size", font_h + "px");

            // Коэффициенты трансформации
            var transf_w = (container_w / ws_w);
            var transf_h = (container_h / ws_h);
            //console.log("transf: ", transf_w, "x", transf_h);

            // Трансформация
            ws.css("display", "block");

            ws.css("width", container_w);
            ws.css("transform-origin", transf_w/2 + "px " + transf_h/2 + "px");
            ws.css("transform-origin", "0px 0px");
            ws.css("transform", "scale("+transf_w+", "+transf_h+")");
            ws.css("transform", "scale("+transf_w+", 1)");
*/
            // Пока за оптимальное значение принят фиксированный размер шрифта 23px
            ws.css("font-size", "23px");

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
                        self.status = 'pending';
                        break;
                    default:
                        break;
                }
                event.preventDefault();
            });
        },

        getch: function () {
            var self = this;
            this.status = 'getch';
            console.log('wait for press..');
            var wait = function() {
                if (self.status === 'getch') {
                    //console.log('wait for press..');
                    setTimeout(wait, 100);
                } else {
                    console.log('button "'+self.char+'" pressed!');
                    return self.char;
                }
            };
            wait();
            return false;
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
            var row, col, attr;
            this.buf = '';
            for (row = 0; row < this.SCREEN_H; row++) {
                for (col = 0; col < this.SCREEN_W; col++) {

                    attr = '';

                    if (this.ram[row][col].attr & this.A_STANDOUT) {
                        attr += ' a_standout';
                    }
                    if (this.ram[row][col].attr & this.A_UNDERLINE) {
                        attr += ' a_underline';
                    }
                    if (this.ram[row][col].attr & this.A_BLINK) {
                        attr += ' a_blink';
                    }
                    if (this.ram[row][col].attr & this.A_DIM) {
                        attr += ' a_dim';
                    }
                    if (this.ram[row][col].attr & this.A_BOLD) {
                        attr += ' a_bold';
                    }
                    if (this.ram[row][col].attr & this.A_PROTECT) {
                        attr += ' a_protect';
                    }

                    if (this.ram[row][col].attr & this.A_INVIS) {
                        this.buf +=
                            '<span class="row_' + row + ' col_' + col
                            + ' bg_' + this.ram[row][col].bg + ' fg_' + this.ram[row][col].bg
                            + (attr ? attr : '') + '">'
                            + (this.ram[row][col].ch === ' ' ? '&nbsp;' : this.ram[row][col].ch)
                            + '</span>';
                    } else if (this.ram[row][col].attr & this.A_REVERSE) {
                        this.buf +=
                            '<span class="row_' + row + ' col_' + col
                            + ' bg_' + this.ram[row][col].fg + ' fg_' + this.ram[row][col].bg
                            + (attr ? attr : '') + '">'
                            + (this.ram[row][col].ch === ' ' ? '&nbsp;' : this.ram[row][col].ch)
                            + '</span>';
                    } else {
                        this.buf +=
                            '<span class="row_' + row + ' col_' + col
                            + ' bg_' + this.ram[row][col].bg + ' fg_' + this.ram[row][col].fg
                            + (attr ? attr : '') + '">'
                            + (this.ram[row][col].ch === ' ' ? '&nbsp;' : this.ram[row][col].ch)
                            + '</span>';
                    }
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

                if (ch === '\n') {
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

                this.ram[this.cursor.y][this.cursor.x].attr = this.ATTR;
                
                this.ram[this.cursor.y][this.cursor.x++].ch = ch;
            }
        },

        refresh: function () {
            this.ram2buf();
            $("#" + this.wss).html(this.buf);

            /*
             // Этот метод обновления экрана отличается просто адовой ресурсоемкостью - до 1000 мс
             // UPD: если сделать detach, обработать, а потом опять attach - тормозить будет не так сильно
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
            this.ATTR = this.ATTR | attr;
        },

        attroff: function (attr) {
            this.ATTR = this.ATTR ^ attr;
        },

        attrset: function (attr) {
            this.ATTR = attr;
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

            this.ram[this.cursor.y][this.cursor.x].attr = this.ATTR;

            this.ram[this.cursor.y][this.cursor.x].ch = chr;
            //console.log(this.cursor.y, this.cursor.x, this.ram[this.cursor.y][this.cursor.x].ch);
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

        init_pair: function(index, bg, fg) {
            this.color_pairs[index] = {
                bg: bg,
                fg: fg
            };
        },

        chgat: function(counter, attr, color_pair_index) {

            var x_from = this.cursor.x,
                x_to = 0,
                y = this.cursor.y;

            if ( counter < 0 || (x + counter) > this.SCREEN_W) {
                x_to = this.SCREEN_W;
            } else {
                x_to = x_from + counter;
            }

            for (var i = x_from; i < x_to; i++) {
                if (color_pair_index && this.color_pairs[color_pair_index] !== undefined) {
                    this.ram[y][i].bg = this.color_pairs[color_pair_index].bg;
                    this.ram[y][i].fg = this.color_pairs[color_pair_index].fg;
                }
                if (attr) {
                    this.ram[y][i].attr = attr;
                }
            }
        },
        
        mvchgat: function(row, col, counter, attr, color_pair_index) {

            var x_from = col,
                x_to = 0,
                y = row;

            if ( counter < 0 || (x + counter) > this.SCREEN_W) {
                x_to = this.SCREEN_W;
            } else {
                x_to = x_from + counter;
            }

            for (var i = x_from; i < x_to; i++) {
                if (color_pair_index && this.color_pairs[color_pair_index] !== undefined) {
                    this.ram[y][i].bg = this.color_pairs[color_pair_index].bg;
                    this.ram[y][i].fg = this.color_pairs[color_pair_index].fg;
                }
                if (attr) {
                    this.ram[y][i].attr = attr;
                }
            }
        }

    };
    
    window.Webcurses = Webcurses;

}());
