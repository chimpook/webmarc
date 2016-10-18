"use strict";

/**
 * Example of initscr and printw and refresh
 */

$(document).ready(function () {

    x1.initscr($("#container"));

    x1.printw("Пример в действии:\n\n");
    x1.printw("Для запуска тестов мы будем использовать соответствующие JavaScript-библиотеки\n\n");
    x1.printw("Мы будем использовать:\n\n");
    x1.printw("  - Mocha - эта библиотека содержит общие функции для тестирования, включая describe и it.\n");
    x1.printw("  - Chai - библиотека поддерживает разнообразные функции для проверок. "+
        "Есть разные „cтили‟ проверки результатов, с которыми мы познакомимся позже, "+
        "на текущий момент мы будем использовать лишь assert.equal.\n");
    x1.printw("  - Sinon - для эмуляции и хитрой подмены функций „заглушками‟, понадобится позднее.\n\n");
    x1.printw("Эти библиотеки позволяют тестировать JS не только в браузере, но и на сервере Node.JS. "+
        "Здесь мы рассмотрим браузерный вариант, серверный использует те же функции.");

    x1.refresh();

});

var x1 = new Webcurses('Example 1');