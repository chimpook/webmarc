/**
 * Если не передавать параметры в модуль, будут выведены 'a', 'b' и 'x', 'T',
 * Если передать - будут выведены 'a', 'b' два раза.
 */

var G$ = G$();

G$.test();

//delete G$;

a = 'x';
b = 'T';
G$.test();

