"use strict";

const SCREEN_W = 80;
const SCREEN_H = 25;

$(document).ready(function(){

    // Инициализируем рабочую область
    var ws = webcurses.initscr();

    // Выводим информацию
    ws.html("<span class='info'>Проверка вывода текста в подготовленную рабочую область</span>");


});

var webcurses = {

    initscr : function() {

        if (! $(".container").length) {
            $("body").append("<div class='container'></div>");
        }
        var container = $(".container");

        container.append(this.buildWorkspace(SCREEN_W, SCREEN_H));

        var ws = $(".workspace");

        // Размер контейнера
        var container_w = container.width();
        var container_h = container.height();
        //console.log("container: ", container_w, "x", container_h);

        // Размер рабочей области
        var ws_w = ws.width();
        var ws_h = ws.height();
        //console.log("workspace: ", ws_w, "x", ws_h);

        // Коэффициенты трансформации
        var transf_w = container_w / ws_w;
        var transf_h = container_h / ws_h;
        //console.log("transf: ", transf_w, "x", transf_h);

        // Трансформация
        ws.css("display", "block");
        //ws.css("width", container_w);
        ws.css("transform-origin", transf_w/2 + "px " + transf_h/2 + "px");
        ws.css("transform", "scale("+transf_w+", "+transf_h+")");

        // Очистка рабочей области
        ws.html("");

        return ws;
    },

    buildWorkspace : function(width, height) {
        var grid = new Array();
        for (var i=1; i<=height; i++) {
            for (var j=1; j<=width; j++) {
                if (
                    i == 1 && j == 1
                    || i == 1 && (j % 10 == 0)
                    || (i % 5 == 0) && j == 1
                    || (i % 5 == 0) && (j % 10 == 0)
                ) {
                    grid.push("⊹");
                } else {
                    grid.push("&nbsp;");
                }
            }
            grid.push("<br/>");
        }
        return "<div class='workspace'>" + grid.join('') + "</div>";
    }
};