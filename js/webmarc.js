/**
 * Created by nimda on 10.09.2016.
 */

const SCREEN_H = 25;
const SCREEN_W = 80;

$(document).ready(function(){

    // Размер экрана
    var window_w = $(window).width();
    var window_h = $(window).height();

    console.log("window: ", window_w, "x", window_h);

    // Размер знакоместа
    var letter_w = 2 * window_w / SCREEN_W - 4.5;
    var letter_h = 2 * window_h / SCREEN_H - 4.5;

    console.log("letter: ", letter_w, "x", letter_h);

    var vp_w = 1.25;
    var vp_h = window_h / 100;

    console.log("vp: ", vp_w, "x", vp_h);

    //$(".test").css("height", letter_h);
    //$(".test").css("width", letter_w);
    //$(".test").css("font-size", vp_w + "vw");
    //$(".test").css("line-height", 1);

    //$(".lorem").css("fontSize", letter_w + "px");
    //$(".lorem").css("line-height", 1)



    //$(".test").css("color", "red");


});