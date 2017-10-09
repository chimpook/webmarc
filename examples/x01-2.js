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
    var t1 = function() {
        if(x.status !== 'getch') {

            x.printw("Для запуска тестов мы будем использовать соответствующие JavaScript-библиотеки\n\n");
            x.printw("Мы будем использовать:\n\n");
            x.printw("  - Mocha - эта библиотека содержит общие функции для тестирования, включая describe и it.\n");
            x.printw("  - Chai - библиотека поддерживает разнообразные функции для проверок. " +
                "Есть разные „cтили‟ проверки результатов, с которыми мы познакомимся позже, " +
                "на текущий момент мы будем использовать лишь assert.equal.\n");
            x.refresh();

            x.status = 'getch';
            var t2 = function() {
                if(x.status !== 'getch') {

                    x.printw("  - Sinon - для эмуляции и хитрой подмены функций „заглушками‟, понадобится позднее.\n\n");
                    x.printw("Эти библиотеки позволяют тестировать JS не только в браузере, но и на сервере Node.JS. " +
                        "Здесь мы рассмотрим браузерный вариант, серверный использует те же функции.");
                    x.refresh();
                } else {
                    setTimeout(t2, 100);
                }
            };
            t2();

        } else {
            //console.log('wait fot t1');
            setTimeout(t1, 100);
        }
    };
    t1();


});

var x = new Webcurses('Example 01');