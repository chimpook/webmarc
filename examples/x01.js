"use strict";

/**
 * Example of initscr, printw, refresh and getch
 */

$(document).ready(function () {

    x.initscr($("#container"));

    x.printw("Пример в действии:\n\n");
    x.refresh();

    // Вот такая реализация getch :^\
    x.status = 'getch';
    var t = function() {
        if(x.status !== 'getch') {

            x.printw("Для запуска тестов мы будем использовать соответствующие JavaScript-библиотеки\n\n");
            x.printw("Мы будем использовать:\n\n");
            x.printw("  - Mocha - эта библиотека содержит общие функции для тестирования, включая describe и it.\n");
            x.printw("  - Chai - библиотека поддерживает разнообразные функции для проверок. " +
                "Есть разные „cтили‟ проверки результатов, с которыми мы познакомимся позже, " +
                "на текущий момент мы будем использовать лишь assert.equal.\n");
            x.printw("  - Sinon - для эмуляции и хитрой подмены функций „заглушками‟, понадобится позднее.\n\n");
            x.printw("Эти библиотеки позволяют тестировать JS не только в браузере, но и на сервере Node.JS. " +
                "Здесь мы рассмотрим браузерный вариант, серверный использует те же функции.");
            x.refresh();

        } else {
            //console.log('wait fot t');
            setTimeout(t, 100);
        }
    };
    t();


});

var x = new Webcurses('Example 01');