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

            self.ram = [];
            for (row = 0; row < self.nlines; row++) {
                self.ram[row] = [];
                for (col = 0; col < self.ncols; col++) {
                    self.ram[row][col] = {
                        ch: ch,
                        bg: bg,
                        fg: fg
                    };
                    if (attr) {
                        self.ram[row][col].attr = attr;
                    }
                }
            }
        },

        /**
         * Очистка окна и сброс курсора
         */
        clear: function() {
            var self = this;

            self.cursor.x = 0;
            self.cursor.y = 0;
            self.fill(' ', 0, 0, 0);
        },

        /**
         * Печать строки в окне
         * @param str
         * @param attr
         */
        printw: function (str, attr) {
            var self = this;
            var i, len, y, x, ch;

            for (i = 0, len = str.length; i < len; i++) {

                if (str[i] === ' ') {
                    ch = '&nbsp;'
                } else {
                    ch = str[i];
                }

                if (ch === '\n') {
                    self.cursor.y++;
                    self.cursor.x = 0;
                    continue;
                }

                if (self.cursor.x >= self.ncols) {
                    self.cursor.y++;
                    self.cursor.x = 0;
                }
                if (self.cursor.y >= self.nlines) {
                    self.cursor.y = 0;
                    self.cursor.x = 0;
                }

                self.ram[self.cursor.y][self.cursor.x++].ch = ch;

                if (attr) {
                    self.ram[self.cursor.y][self.cursor.x].attr = attr;
                }
            }
        },

        /**
         * Перемещение курсора
         * @param row
         * @param col
         */
        setcursor: function (row, col) {
            var self = this;

            if (row >= 0 && row < self.nlines) {
                self.cursor.y = row;
            }
            if (col >= 0 && col < self.ncols) {
                self.cursor.x = col;
            }
        },

        /**
         * Добавление символа в позицию курсора
         * @param chr
         * @param attr
         */
        addch: function (chr, attr) {
            var self = this;

            chr = chr === ' ' ? '&nbsp;' : chr;

            self.ram[self.cursor.y][self.cursor.x].ch = chr;
            if (attr) {
                self.ram[self.cursor.y][self.cursor.x].attr = attr;
            }
        },

        /**
         * Получение правой границы окна
         * @returns {number}
         */
        getmaxx: function () {
            var self = this;

            return self.ncols;
        },

        /**
         * Получение нижней границы окна
         * @returns {number}
         */
        getmaxy: function () {
            var self = this;

            return self.nlines;
        },

        /**
         * Получение курсора
         * @returns {WebcursesWindow.cursor|{y, x}}
         */
        getyx: function () {
            var self = this;

            return self.cursor;
        },

        /**
         * Изменение цвета и атрибутов строки в окне
         * @param counter
         * @param attr
         * @param bg
         * @param fg
         */
        chgat: function(counter, attr, bg, fg) {
            var self = this;
            var x_from, x_to;
            var y;

            x_from = self.cursor.x;
            y = self.cursor.y;

            if ( counter < 0 || (x + counter) > self.ncols) {
                x_to = self.ncols;
            } else {
                x_to = x_from + counter;
            }

            for (var i = x_from; i < x_to; i++) {
                self.ram[y][i].bg = bg;
                self.ram[y][i].fg = fg;
                if (attr) {
                    self.ram[y][i].attr = attr;
                }
            }
        },

        /**
         * Перемещение окна
         * @param row
         * @param col
         */
        move: function(row, col) {
            var self = this;

            self.begin_y = row;
            self.begin_x = col;
        },

        /**
         * Получение смещения окна относительно верхнего левого угла рабочей области
         * @returns {{begin_y: number, begin_x: number}}
         */
        getbegyx: function () {
            var self = this;

            return {y: self.begin_y, x: self.begin_x};
        },

        has_border: false,

        /**
         * Установка  или сброс рамки
         * @param ls
         * @param rs
         * @param ts
         * @param bs
         * @param tl
         * @param tr
         * @param bl
         * @param br
         * @param attr
         * @param bg
         * @param fg
         */
        border: function (ls, rs, ts, bs, tl, tr, bl, br, attr, bg, fg) {
            var self = this;
            var i;

            // Если не хватает хотя бы одного параметра - удаляем рамку
            if (ls === undefined || rs === undefined || ts === undefined || bs === undefined ||
                tl === undefined || tr === undefined || bl === undefined || br === undefined) {
                for (i = 0; i < self.ncols; i++) {
                    self.ram[0][i].ch = ' ';
                    self.ram[self.nlines - 1].ch = ' ';
                }
                for (i = 1; i < self.nlines - 1; i++) {
                    self.ram[i][0] = ' ';
                    self.ram[i][self.ncols - 1].ch = ' ';
                }
                self.has_border = false;
                return;
            }

            self.ram[0][0].ch = tl;
            self.ram[0][self.ncols - 1].ch = tr;
            self.ram[self.nlines - 1][0].ch = bl;
            self.ram[self.nlines - 1][self.ncols - 1].ch = br;
            for (i = 1; i < self.ncols - 1; i++) {
                self.ram[0][i].ch = ts;
                self.ram[self.nlines - 1][i].ch = bs;
            }
            for (i = 1; i < self.nlines - 1; i++) {
                self.ram[i][0].ch = ls;
                self.ram[i][self.ncols - 1].ch = rs;
            }

            if (bg !== undefined) {
                self.ram[0][0].bg = bg;
                self.ram[0][self.ncols - 1].bg = bg;
                self.ram[self.nlines - 1][0].bg = bg;
                self.ram[self.nlines - 1][self.ncols - 1].bg = bg;
                for (i = 1; i < self.ncols - 1; i++) {
                    self.ram[0][i].bg = bg;
                    self.ram[self.nlines - 1][i].bg = bg;
                }
                for (i = 1; i < self.nlines - 1; i++) {
                    self.ram[i][0].bg = bg;
                    self.ram[i][self.ncols - 1].bg = bg;
                }
            }

            if (fg !== undefined) {
                self.ram[0][0].fg = fg;
                self.ram[0][self.ncols - 1].fg = fg;
                self.ram[self.nlines - 1][0].fg = fg;
                self.ram[self.nlines - 1][self.ncols - 1].fg = fg;
                for (i = 1; i < self.ncols - 1; i++) {
                    self.ram[0][i].fg = fg;
                    self.ram[self.nlines - 1][i].fg = fg;
                }
                for (i = 1; i < self.nlines - 1; i++) {
                    self.ram[i][0].fg = fg;
                    self.ram[i][self.ncols - 1].fg = fg;
                }
            }

            if (attr !== undefined) {
                self.ram[0][0].attr = attr;
                self.ram[0][self.ncols - 1].attr = attr;
                self.ram[self.nlines - 1][0].attr = attr;
                self.ram[self.nlines - 1][self.ncols - 1].attr = attr;
                for (i = 1; i < self.ncols - 1; i++) {
                    self.ram[0][i].attr = attr;
                    self.ram[self.nlines - 1][i].attr = attr;
                }
                for (i = 1; i < self.nlines - 1; i++) {
                    self.ram[i][0].attr = attr;
                    self.ram[i][self.ncols - 1].attr = attr;
                }
            }

            self.has_border = true;
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

        ACS_ULCORNER:       '+',
        ACS_LLCORNER:       '+',
        ACS_URCORNER:       '+',
        ACS_LRCORNER:       '+',
        ACS_RTEE:           '+',
        ACS_LTEE:           '+',
        ACS_BTEE:           '+',
        ACS_TTEE:           '+',
        ACS_HLINE:          '-',
        ACS_VLINE:          '|',
        ACS_PLUS:           '+',
        ACS_S1:             '-',
        ACS_S9:             '_',
        ACS_DIAMOND:        '+',
        ACS_CKBOARD:        ':',
        ACS_DEGREE:         '\'',
        ACS_PLMINUS:        '#',
        ACS_BULLET:         'o',
        ACS_LARROW:         '<',
        ACS_RARROW:         '>',
        ACS_DARROW:         'v',
        ACS_UARROW:         '^',
        ACS_BOARD:          '#',
        ACS_LANTERN:        '#',
        ACS_BLOCK:          '#',

        WACS_ULCORNER:       '┌',
        WACS_LLCORNER:       '└',
        WACS_URCORNER:       '┐',
        WACS_LRCORNER:       '┘',
        WACS_RTEE:           '├',
        WACS_LTEE:           '┤',
        WACS_BTEE:           '┴',
        WACS_TTEE:           '┬',
        WACS_HLINE:          '─',
        WACS_VLINE:          '│',
        WACS_PLUS:           '┼',
        WACS_S1:             '▔',
        WACS_S9:             '█',
        WACS_DIAMOND:        '▚',
        WACS_CKBOARD:        '░',
        WACS_DEGREE:         '𝆩',
        WACS_PLMINUS:        '#',
        WACS_BULLET:         'o',
        WACS_LARROW:         '⇦',
        WACS_RARROW:         '⇨',
        WACS_DARROW:         '⇩',
        WACS_UARROW:         '⇧',
        WACS_BOARD:          '▚',
        WACS_LANTERN:        '#',
        WACS_BLOCK:          '█',

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
        COLOR_DIMGRAY:      'g',
        COLOR_LIGHTRED:     'h',
        COLOR_LIGHTGREEN:   'i',
        COLOR_LIGHTYELLOW:  'j',
        COLOR_LIGHTBLUE:    'k',
        COLOR_LIGHTMAGENTA: 'l',
        COLOR_LIGHTCYAN:    'm',
        COLOR_LIGHTGRAY:    'n',

        KEY_BSPC:   8,
        KEY_TAB:    9,
        KEY_ENTER:  13,
        KEY_PAUSE:  19,
        KEY_ESC:    27,
        KEY_PGUP:   33,
        KEY_PGDN:   34,
        KEY_END:    35,
        KEY_HOME:   36,
        KEY_INS:    45,
        KEY_DEL:    46,
        KEY_F1:     112,
        KEY_F2:     113,
        KEY_F3:     114,
        KEY_F4:     115,
        KEY_F5:     116,
        KEY_F6:     117,
        KEY_F7:     118,
        KEY_F8:     119,
        KEY_F9:     120,
        KEY_F10:    121,
        KEY_F11:    122,
        KEY_LEFT:   37,
        KEY_UP:     38,
        KEY_RIGHT:  39,
        KEY_DOWN:   40,

        KEY_A:      97,
        KEY_W:      119,
        KEY_D:      100,
        KEY_S:      115,

        color_pairs:    {},

        // Состояние системы (потом перенести в webmarc)
        status: 'start',

        // id рабочего пространства
        wss: 'workspace',

        ram: [],

        buffer: {
            html: ''
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

            self.wload('stdscr', scr);
        },

        /**
         * Загрузка в "видеопамять" окна объекта экрана
         * @param id
         * @param scr
         */
        wload: function (id, scr) {
            var self = this;
            var win;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            win = self.getwin(id);

            win.load(src);
        },

        /**
         * Создание нового окна
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

            // Создаем стандартное окно ручным способом
            // newwin() - не годится из-за проверки на наличие stdscr
            self.Windows[0] = new WebcursesWindow('stdscr', self.SCREEN_H, self.SCREEN_W, 0, 0, 0);

            // Очищаем "системную видео-память"
            // (именно после создания стандартного окна)
            self.clear();

            // Обновляем экран
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

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

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
         * @param id
         */
        wclearw: function (id) {
            var self = this;
            var win;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            win = self.getwin(id);
            win.fill(' ', self.COLOR_BLACK, self.COLOR_WHITE);
        },

        /**
         * Очистка стандартного окна stdscr
         */
        clearw: function () {
            var self = this;

            self.wclearw('stdscr');
        },

        /**
         * Обновление экрана
         */
        refresh: function () {
            var self = this;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            self.compose();
            self.ram2buffer();
            $("#" + self.wss).html(self.buffer.html);

        },

        /**
         * Раздельная установка атрибута
         * @param attr
         */
        attron: function (attr) {
            var self = this;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            self.ATTR = self.ATTR | attr;
        },

        /**
         * Раздельный сброс атрибута
         * @param attr
         */
        attroff: function (attr) {
            var self = this;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            self.ATTR = self.ATTR ^ attr;
        },

        /**
         * Комплексная установка атрибута
         * @param attr
         */
        attrset: function (attr) {
            var self = this;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            self.ATTR = attr;
        },

        /**
         *
         * @param row
         * @param col
         */
        setcursor: function (row, col) {
            var self = this;

            self.wmove('stdscr', row, col);
        },

        /**
         * Перемещение курсора окна
         * @param id
         * @param row
         * @param col
         */
        wmove: function (id, row, col) {
            var self = this;
            var win;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            win = self.getwin(id);
            win.setcursor(row, col);
        },

        /**
         * Добавление символа в позицию курсора в стандартном окне
         * @param chr
         */
        addch: function (chr) {
            var self = this;

            self.waddch('stdscr', chr);
        },

        /**
         * Добавление символа в позицию курсора в окне
         * @param id
         * @param chr
         */
        waddch: function (id, chr) {
            var self = this;
            var win;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            win = self.getwin(id);
            win.addch(chr, self.ATTR);
        },

        /**
         * Добавление символа с перемещением курсора в стандартном окне
         * @param row
         * @param col
         * @param chr
         */
        mvaddch: function (row, col, chr) {
            var self = this;

            self.waddch('stdscr', chr);
        },

        /**
         * Добавление символа с перемещением курсора в окне
         * @param id
         * @param row
         * @param col
         * @param chr
         */
        wmvaddch: function (id, row, col, chr) {
            var self = this;
            var win;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            win = self.getwin(id);
            win.setcursor(row, col);
            win.addch(chr, self.ATTR);
        },

        /**
         * Печать строки в стандартном окне
         * @param str
         */
        printw: function(str) {
            var self = this;

            self.wprintw('stdscr', str);
        },

        /**
         * Печать строки в окне
         * @param id
         * @param str
         */
        wprintw: function (id, str) {
            var self = this;
            var i, len, y, x, ch;
            var win;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            win = self.getwin(id);
            win.printw(str, self.ATTR);
        },

        /**
         * Печать строки в указанной позиции стандартного окна
         * @param row
         * @param col
         * @param str
         */
        mvprintw: function (row, col, str) {
            var self = this;

            self.wmvprintw('stdscr', row, col, str);
        },

        /**
         * Печать строки в указанной позиции окна
         * @param id
         * @param row
         * @param col
         * @param str
         */
        wmvprintw: function (id, row, col, str) {
            var self = this;
            var win;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            win = self.getwin(id);
            win.setcursor(row, col);
            win.printw(str, self.ATTR);
        },

        /**
         * Получение правой границы стандартного окна
         * @returns {*}
         */
        getmaxx: function () {
            var self = this;

            return self.wgetmaxx('stdscr');
        },

        /**
         * Получение правой границы окна
         * @param id
         * @returns {*}
         */
        wgetmaxx: function (id) {
            var self = this;
            var win;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            win = self.getwin(id);
            return win.getmaxx();
        },

        /**
         * Получение нижней границы стандартного окна
         * @returns {*}
         */
        getmaxy: function () {
            var self = this;

            return self.wgetmaxy('stdscr');
        },

        /**
         * Получение нижней границы окна
         * @param id
         * @returns {*}
         */
        wgetmaxy: function (id) {
            var self = this;
            var win;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            win = self.getwin(id);
            return win.getmaxy();
        },

        /**
         * Получение координат курсора стандартного окна
         * @returns {*|{y, x}}
         */
        getyx: function () {
            var self = this;

            return self.wgetyx('stdscr');
        },

        /**
         * Получение координат курсора окна
         * @param id
         * @returns {*|{y, x}}
         */
        wgetyx: function (id) {
            var self = this;
            var win;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            win = self.getwin(id);
            return win.getyx();
        },

        /**
         * Установка режима ожидания ввода строки
         * @deprecated
         * Должно быть реализовано на уровне приложения
         */
        getstr: function () {
            var self = this;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            self.status = 'getstr';
        },

        /**
         * Инициализация цветовой пары
         * @param id
         * @param bg
         * @param fg
         */
        init_pair: function(id, bg, fg) {
            var self = this;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            self.color_pairs[id] = {
                bg: bg,
                fg: fg
            };
        },

        /**
         * Изменение атрибутов и окраски строки в стандартном окне
         * @param counter
         * @param attr
         * @param color_pair_index
         */
        chgat: function(counter, attr, color_pair_index) {
            var self = this;

            self.wchgat('stdscr', counter, attr, color_pair_index);
        },

        /**
         * Изменение атрибутов и окраски строки в окне
         * @param id
         * @param counter
         * @param attr
         * @param color_pair_id
         */
        wchgat: function (id, counter, attr, color_pair_id) {
            var self = this;
            var win;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            win = self.getwin(id);
            win.chgat(counter, attr, self.color_pairs[color_pair_index].bg, self.color_pairs[color_pair_index].fg);
        },

        /**
         * Изменение атрибутов и окраски строки в указанной позиции стандартного окна
         * @param row
         * @param col
         * @param counter
         * @param attr
         * @param color_pair_id
         */
        mvchgat: function (row, col, counter, attr, color_pair_id) {
            var self = this;

            self.wmvchgat('stdscr', row, col, counter, attr, color_pair_id);
        },

        /**
         * Изменение атрибутов и окраски строки в указанной позиции окна
         * @param id
         * @param row
         * @param col
         * @param counter
         * @param attr
         * @param color_pair_id
         */
        wmvchgat: function(id, row, col, counter, attr, color_pair_id) {
            var self = this;
            var win;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            win = self.getwin(id);
            win.setcursor(row, col);
            win.chgat(counter, attr, self.color_pairs[color_pair_index].bg, self.color_pairs[color_pair_index].fg);
        },

        /**
         * Перемещение окна
         */
        movewin: function (id, row, col) {
            var self = this;
            var win;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            if (id === 0 || id === 'stdscr') {
                console.log("Невозможно переместить стандартное окно");
            }

            win = self.getwin(id);
            win.move(row, col);
        },

        movewinto: function (id, direction, distance) {
            var self = this;
            var win, begin;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            if (id === 0 || id === 'stdscr') {
                console.log("Невозможно переместить стандартное окно");
            }

            distance = distance === undefined ? 1 : distance;

            win = self.getwin(id);
            begin = win.getbegyx();

            switch (direction) {

                case 'left':
                    begin.x-=distance;
                    break;

                case 'up':
                    begin.y-=distance;
                    break;

                case 'right':
                    begin.x+=distance;
                    break;

                case 'down':
                    begin.y+=distance;
                    break;

                default:
                    break;
            }
            win.move(begin.y, begin.x);
        },

        /**
         * Удаление окна
         * @param id
         */
        delwin: function (id) {
            var self = this;
            var win;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            win = self.getwin(id);
            delete self.Windows[win.layer];
        },

        /**
         * Получение смещения окна относительно верхнего левого угла
         * @param id
         * @returns {*|{begin_y: number, begin_x: number}}
         */
        wgetbegyx: function (id) {
            var self = this;
            var win;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            win = self.getwin(id);
            return win.getbegyx();
        },

        /**
         * Установка или сброс рамки окна
         * @param id
         * @param ls
         * @param rs
         * @param ts
         * @param bs
         * @param tl
         * @param tr
         * @param bl
         * @param br
         * @param attr
         * @param bg
         * @param fg
         */
        wborder: function (id, ls, rs, ts, bs, tl, tr, bl, br, attr, bg, fg) {
            var self = this;
            var win;

            if (!self.is_init()) {
                console.log("Screen is not initialized");
                return;
            }

            win = self.getwin(id);
            win.border(ls, rs, ts, bs, tl, tr, bl, br, attr, bg, fg);
        },

        /**
         * Установка или сброс рамки стандартного окна
         * @param ls
         * @param rs
         * @param ts
         * @param bs
         * @param tl
         * @param tr
         * @param bl
         * @param br
         * @param attr
         * @param bg
         * @param fg
         */
        border: function (ls, rs, ts, bs, tl, tr, bl, br, attr, bg, fg) {
            var self = this;

            self.wborder('stdscr', ls, rs, ts, bs, tl, tr, bl, br, attr, bg, fg);
        },

        /**
         * Рисуем одну из стандартных рамок в окне
         * @param id
         * @param type
         */
        wbox: function (id, type) {
            var self = this;

            switch (type) {
                case 'ascii':
                    self.wborder(id, self.ACS_VLINE, self.ACS_VLINE, self.ACS_HLINE, self.ACS_HLINE,
                        self.ACS_ULCORNER, self.ACS_URCORNER, self.ACS_LLCORNER, self.ACS_LRCORNER);
                    break;

                case 'utf-8':
                    self.wborder(id, self.WACS_VLINE, self.WACS_VLINE, self.WACS_HLINE, self.WACS_HLINE,
                        self.WACS_ULCORNER, self.WACS_URCORNER, self.WACS_LLCORNER, self.WACS_LRCORNER);
                    break;

                default:
                    self.wborder(id);
            }
        },

        /**
         * Рисуем одну из стандартных рамок в стандартном окне
         * @param type
         */
        box: function (type) {
            var self = this;

            self.wbox('stdscr', type);
        }




    };


    
    window.Webcurses = Webcurses;

}());
