/**
 * Created by nimda on 10.09.2016.
 */
"use strict";

const SCREEN_H = 25;
const SCREEN_W = 80;

$(document).ready(function(){

    // Размер экрана
    var window_w = $(window).width();
    var window_h = $(window).height();
    console.log("window: ", window_w, "x", window_h);

    // Размер блока scr
    $(".scr").css("width", window_w + "px");
    $(".scr").css("height", window_h + "px");
    var scr_w = $(".scr").width();
    var scr_h = $(".scr").height();
    console.log("scr: ", scr_w, "x", scr_h);

    // Размер grid
    var grid_w = $(".grid").width();
    var grid_h = $(".grid").height();
    console.log("grid: ", grid_w, "x", grid_h);

    // Коэффициенты трансформации
    var transf_w = scr_w / grid_w;
    var transf_h = scr_h / grid_h;
    console.log("transf: ", transf_w, "x", transf_h);

    // Трансформация
    $(".grid").css("display","block");
    $(".grid").css("width",grid_w);
    $(".grid").css("transform-origin", transf_w/2 + "px " + transf_h/2 + "px");
    $(".grid").css("transform", "scale("+transf_w+", "+transf_h+")");

    // Выводим информацию
    $(".grid").html("<span class='red'>Проверка</span>");

});