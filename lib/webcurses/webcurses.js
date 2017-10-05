;"use strict";

(function () {

    function WebcursesWindow(title, nlines, ncols, begin_y, begin_x, layer) {
        var self = this;

        self.title = title;
        self.nlines = nlines;
        self.ncols = ncols;
        self.begin_y = begin_y;
        self.begin_x = begin_x;
        self.layer = layer === undefined ? 0: layer;
        self.ram = [];
        self.clear();
    }

    WebcursesWindow.prototype = {
        title: '',
        nlines: 0,
        ncols: 0,
        begin_y: 0,
        begin_x: 0,
        layer: 0,
        ram: [],
        cursor: {
            y: 0,
            x: 0
        },

        /**
         * Загрузка в "видеопамять" окна объекта "экрана"
         * @param scr
         */
        load: function (scr) {
            var self = this;
            var row, col, i, ch;

            for (i = 0, row = 0; row < self.nlines; row++) {
                for (col = 0; col < self.ncols; col++) {
                    self.ram[row][col].ch = scr.ch[i] === ' ' ? '&nbsp;' : scr.ch[i];
                    self.ram[row][col].bg = scr.bg[i];
                    self.ram[row][col].fg = scr.fg[i];
                    //console.log(scr.fg[i]);
                    i++;
                }
            }
        },

        /**
         * Заполнение окна
         * @param ch
         * @param bg
         * @param fg
         * @param attr
         */
        fill: function (ch, bg, fg, attr) {
            var self = this;
            var row, col;

            attr = attr === undefined ? 0 : attr;

            for (row = 0; row < self.nlines; row++) {
                for (col = 0; col < self.ncols; col++) {
                    self.ram[row][col] = {
                        ch: ch,
                        bg: bg,
                        fg: fg,
                        attr: attr
                    }
                }
            }
        },

        /**
         * Очистка окна
         */
        clear: function () {
            var self = this;
            var row, col, i;

            self.cursor.x = 0;
            self.cursor.y = 0;

            for (i = 0, row = 0; row < self.nlines; row++) {
                self.ram[row] = [];
                for (col = 0; col < self.ncols; col++) {
                    self.ram[row][col] = {
                        ch: '&nbsp;',
                        bg: 0,
                        fg: 7
                    };
                    i++;
                }
            }
        }
    };

    window.WebcursesWindow = WebcursesWindow;
}());

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

        title: '',

        Windows: [],

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

        color_pairs:    [],

        // Состояние системы (потом перенести в webmarc)
        status: 'start',

        // id рабочего пространства
        wss: 'workspace',

        ram: [],

        buffer: {
            html: ''
        },

        cursor: {
            y: 0,
            x: 0
        },

        str: '',
        
        char: '',

        /**
         * Формирование итогового буфера для вывода на экран
         */
        ram2buffer: function () {
            var self = this;
            var row, col, attr;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            self.buffer.html = '';
            for (row = 0; row < self.SCREEN_H; row++) {
                for (col = 0; col < self.SCREEN_W; col++) {

                    attr = '';

                    if (self.ram[row][col].attr & self.A_STANDOUT) {
                        attr += ' a_standout';
                    }
                    if (self.ram[row][col].attr & self.A_UNDERLINE) {
                        attr += ' a_underline';
                    }
                    if (self.ram[row][col].attr & self.A_BLINK) {
                        attr += ' a_blink';
                    }
                    if (self.ram[row][col].attr & self.A_DIM) {
                        attr += ' a_dim';
                    }
                    if (self.ram[row][col].attr & self.A_BOLD) {
                        attr += ' a_bold';
                    }
                    if (self.ram[row][col].attr & self.A_PROTECT) {
                        attr += ' a_protect';
                    }

                    if (self.ram[row][col].attr & self.A_INVIS) {
                        self.buffer.html +=
                            '<span class="row_' + row + ' col_' + col
                            + ' bg_' + self.ram[row][col].bg + ' fg_' + self.ram[row][col].bg
                            + (attr ? attr : '') + '">'
                            + (self.ram[row][col].ch === ' ' ? '&nbsp;' : self.ram[row][col].ch)
                            + '</span>';
                    } else if (self.ram[row][col].attr & self.A_REVERSE) {
                        self.buffer.html +=
                            '<span class="row_' + row + ' col_' + col
                            + ' bg_' + self.ram[row][col].fg + ' fg_' + self.ram[row][col].bg
                            + (attr ? attr : '') + '">'
                            + (self.ram[row][col].ch === ' ' ? '&nbsp;' : self.ram[row][col].ch)
                            + '</span>';
                    } else {
                        self.buffer.html +=
                            '<span class="row_' + row + ' col_' + col
                            + ' bg_' + self.ram[row][col].bg + ' fg_' + self.ram[row][col].fg
                            + (attr ? attr : '') + '">'
                            + (self.ram[row][col].ch === ' ' ? '&nbsp;' : self.ram[row][col].ch)
                            + '</span>';
                    }
                }
                self.buffer.html += '<br/>';
            }
        },

        /**
         * Загрузка в "видеопамять" стандартного окна объекта "экрана"
         * @param scr
         */
        load: function (scr) {
            var self = this;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            self.Windows[0].load(scr);
        },

        wload: function (win, scr) {
            var self = this;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            self.Windows[win].load(src);
        },

        /**
         * Создание нового окна
         *
         * @param title
         * @param nlines
         * @param ncols
         * @param begin_y
         * @param begin_x
         * @param layer
         */
        newwin: function(title, nlines, ncols, begin_y, begin_x, layer) {
            var self = this;
            var error = false;

            layer = layer === undefined ? 0 : layer;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            self.Windows.forEach(function(win, i, wins) {
                if (win.title === title) {
                    console.log('Error: Duplicate window "' + title + '"');
                    error = true;
                }

                if (win.layer === layer) {
                    //console.log('Warning: Duplicate layer "' + layer + '" - put into new layer');
                    layer = self.Windows.length;
                }
            });


/*
            Object.keys(self.Windows).forEach(function(title, i, titles) {
                if (self.Windows[title].layer === layer) {
                    //console.log('Warning: Duplicate layer "' + layer + '" - put into new layer');
                    layer = Object.keys(self.Windows).length;
                }
            });
*/

            if (!error) {
                self.Windows[layer] = new WebcursesWindow(title, nlines, ncols, begin_y, begin_x, layer);
            }
        },

        /**
         * Компоновка "системной видеопамяти"
         */
        compose: function() {
            var self = this;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            /*
                        Object.keys(self.Windows).forEach(function(title, i, titles) {
                            range[self.Windows[title].layer] = self.Windows[title].ram;
                            //console.log(self.Windows[title].layer);
                        });
                        console.log(rams);

                        rams.forEach(function(ram, i, rams) {


                        });
            */
            var row,col;
            //console.log(self.Windows);

            self.Windows.forEach(function(win, i, wins) {
                //console.log(win);
                if (self.ram === undefined) {
                    self.ram = [];
                }
                for (row = 0; row < win.nlines; row++) {
                    if (self.ram[row + win.begin_y] === undefined) {
                        self.ram[row + win.begin_y] = [];
                    }
                    for (col = 0; col < win.ncols; col++) {
                        self.ram[row + win.begin_y][col + win.begin_x] = win.ram[row][col];
                    }
                }
            });

            //console.log(self.ram);
        },

        /**
         * Получение объекта окна по ID - индексу/слою или названию окна
         * @param id
         * @returns {{set, expr}|*|{ID, NAME, TAG}|{}}
         */
        getwin: function (id) {
            var self = this;
            var win;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            win = typeof id === "string" ? self.Windows.find(function(w) {
                return w.title === id;
            }) : self.Windows[id];

            return win;
        },

        /**
         * Заполнение окна с помощью встроенного метода
         * @param id
         * @param ch
         * @param bg
         * @param fg
         * @param attr
         */
        wfillw: function (id, ch, bg, fg, attr) {
            var self = this;
            var row, col;
            var win;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            win = self.getwin(id);

            win.fill(ch, bg, fg, attr);
        },

        /**
         * Заполнение стандартного окна
         * @param ch
         * @param bg
         * @param fg
         * @param attr
         */
        fillw: function (ch, bg, fg, attr) {
            var self = this;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            self.wfillw('stdscr', ch, bg, fg, attr);
        },

        /**
         * Инициализация экрана
         * @param container
         */
        initscr: function (container) {
            var self = this;

            if (self.is_init()) {
                console.log("Screen is initialized already");
                return;
            }

            /**
             * Подготовка контейнера
             */
            container.append('<div id="' + self.wss + '"></div>');

            // Объект рабочего пространства
            var ws = $("#" + self.wss);

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
            //this.initkbd();

            /**
             * Формирование стандартного окна и обновление экрана
             */

            // Очищаем "системную видео-память"
            self.clear();

            // Создаем стандартное окно ручным способом
            // newwin() - не годится из-за проверки на наличие stdscr
            self.Windows[0] = new WebcursesWindow('stdscr', self.SCREEN_H, self.SCREEN_W, 0, 0, 0);

            self.refresh();
        },

        /**
         * Проверка инициализации webcurses
         * @returns {boolean}
         */
        is_init: function () {
            var self = this;
            var has_stdscr = false, has_wss = false;

            has_stdscr = !! self.Windows.find(function(win) {
                return win.title === 'stdscr';
            });

            has_wss = !! $("#" + self.wss).length;

            return has_stdscr && has_wss;
        },

        /**
         * @deprecated
         * Не уверен, что эта функция нужна,
         * т.к. реализация взаимодействия с клавиатурой
         * для каждого приложения своя
         */
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

        /**
         * @deprecated
         * Не уверен, что эта функция нужна,
         * т.к. реализация взаимодействия с клавиатурой
         * для каждого приложения своя
         * @returns {boolean}
         */
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

        /**
         * Очистка "системной видеопамяти"
         */
        clear: function () {
            var self = this;
            var row, col;
            self.ram = [];
            self.buffer = [];

            for (row = 0; row < self.SCREEN_H; row++) {
                self.ram[row] = [];
                for (col = 0; col < self.SCREEN_W; col++) {
                    self.ram[row][col] = {
                        ch: ' ',
                        bg: self.COLOR_BLACK,
                        fg: self.COLOR_WHITE
                    };
                }
            }

        },

        /**
         * Очистка окна
         * @param win
         */
        wclearw: function (win) {
            var self = this;

            self.wfillw(win, ' ', self.COLOR_BLACK, self.COLOR_WHITE);
        },

        /**
         * Очистка стандартного окна stdscr
         */
        clearw: function () {
            var self = this;

            self.wclearw(0);
        },

        /**
         * Печать строки в стандартном окне
         * @param str
         */
        printw: function(str) {
            var self = this;

            self.wprintw(0, str);
        },

        /**
         * Печать строки в окне
         * @param win
         * @param str
         */
        wprintw: function (win, str) {
            var self = this;
            var i, len, y, x, ch;

            for (i = 0, len = str.length; i < len; i++) {

                if (str[i] === ' ') {
                    ch = '&nbsp;'
                } else {
                    ch = str[i];
                }

                if (ch === '\n') {
                    self.Windows[win].cursor.y++;
                    self.Windows[win].cursor.x = 0;
                    continue;
                }

                if (self.Windows[win].cursor.x >= self.Windows[win].ncols) {
                    self.Windows[win].cursor.y++;
                    self.Windows[win].cursor.x = 0;
                }
                if (self.Windows[win].cursor.y >= self.Windows[win].nlines) {
                    self.Windows[win].cursor.y = 0;
                    self.Windows[win].cursor.x = 0;
                }

                self.Windows[win].ram[self.Windows[win].cursor.y][self.Windows[win].cursor.x].attr = self.ATTR;
                
                self.Windows[win].ram[self.Windows[win].cursor.y][self.Windows[win].cursor.x++].ch = ch;
            }
        },

        refresh: function () {
            var self = this;

            self.compose();
            self.ram2buffer();
            $("#" + self.wss).html(self.buffer.html);

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

        attron: function (attr) {
            var self = this;
            self.ATTR = self.ATTR | attr;
        },

        attroff: function (attr) {
            var self = this;
            self.ATTR = self.ATTR ^ attr;
        },

        attrset: function (attr) {
            var self = this;
            self.ATTR = attr;
        },

        move: function (row, col) {
            var self = this;
            if (row < self.SCREEN_H) {
                self.cursor.y = row;
            }
            if (col < self.SCREEN_W) {
                self.cursor.x = col;
            }
        },

        addch: function (chr) {
            var self = this;

            if (chr === ' ') {
                chr = '&nbsp;'
            }

            self.ram[self.cursor.y][self.cursor.x].attr = self.ATTR;

            self.ram[self.cursor.y][self.cursor.x].ch = chr;
            //console.log(this.cursor.y, this.cursor.x, this.ram[this.cursor.y][this.cursor.x].ch);
        },

        mvaddch: function (row, col, chr) {
            var self = this;

            self.move(row, col);
            self.addch(chr);
        },

        getmaxx: function () {
            var self = this;

            return self.SCREEN_W;
        },

        getmaxy: function () {
            var self = this;

            return self.SCREEN_H;
        },

        getmaxyx: function () {
            var self = this;

            return {row: self.SCREEN_H, col: self.SCREEN_W};
        },

        mvprintw: function (row, col, str) {
            var self = this;

            self.move(Math.round(row), Math.round(col));
            self.printw(str);
        },

        getstr: function () {
            var self = this;

            self.status = 'getstr';
        },

        getyx: function () {
            var self = this;

            return {y: self.cursor.y, x: self.cursor.x};
        },

        init_pair: function(index, bg, fg) {
            var self = this;

            self.color_pairs[index] = {
                bg: bg,
                fg: fg
            };
        },

        chgat: function(counter, attr, color_pair_index) {
            var self = this;

            var x_from = self.cursor.x,
                x_to = 0,
                y = self.cursor.y;

            if ( counter < 0 || (x + counter) > self.SCREEN_W) {
                x_to = self.SCREEN_W;
            } else {
                x_to = x_from + counter;
            }

            for (var i = x_from; i < x_to; i++) {
                if (color_pair_index && self.color_pairs[color_pair_index] !== undefined) {
                    self.ram[y][i].bg = self.color_pairs[color_pair_index].bg;
                    self.ram[y][i].fg = self.color_pairs[color_pair_index].fg;
                }
                if (attr) {
                    self.ram[y][i].attr = attr;
                }
            }
        },
        
        mvchgat: function(row, col, counter, attr, color_pair_index) {
            var self = this;

            var x_from = col,
                x_to = 0,
                y = row;

            if ( counter < 0 || (x + counter) > self.SCREEN_W) {
                x_to = self.SCREEN_W;
            } else {
                x_to = x_from + counter;
            }

            for (var i = x_from; i < x_to; i++) {
                if (color_pair_index && self.color_pairs[color_pair_index] !== undefined) {
                    self.ram[y][i].bg = self.color_pairs[color_pair_index].bg;
                    self.ram[y][i].fg = self.color_pairs[color_pair_index].fg;
                }
                if (attr) {
                    self.ram[y][i].attr = attr;
                }
            }
        }

    };
    
    window.Webcurses = Webcurses;

}());
