"use strict";

const SCREEN_W = 80;
const SCREEN_H = 25;
const FONT_ADJUST = 0.58;

$(document).ready(function(){

    // Инициализируем рабочую область
    var ws = webcurses.initscr();

    // Выводим информацию
    //ws.html("<span class='info'>Проверка вывода текста в подготовленную рабочую область</span>");
    //webcurses.mosaic();
    ws.html(webcurses.mosaic());

});

var webcurses = {

    initscr : function() {

        if (! $(".container").length) {
            $("body").append("<div class='container'></div>");
        }
        var container = $(".container");

        container.append(this.buildWorkspace(SCREEN_W, SCREEN_H, "span"));

        var ws = $(".workspace");

        // Размер контейнера
        var container_w = container.width();
        var container_h = container.height();
        //console.log("container: ", container_w, "x", container_h);

        // Размер рабочей области
        var ws_w = ws.width();
        var ws_h = ws.height();
        //console.log("workspace: ", ws_w, "x", ws_h);

        /**
         * Рассчитываем размер шрифта таким образом,
         * чтобы наиболее точно вписать рабочую область в контейнер
         * @type {number}
         */
        // Подгонка по высоте
        var font_h = container_h / SCREEN_H ^ 0; // -SCREEN_H - пока включена сетка
        var font_w = font_h * FONT_ADJUST;
        if ((font_w + 1) * SCREEN_W > container_w) {
            // Подгонка по ширине
            console.log("font too big");
            font_w = (container_w -1)/ SCREEN_W ^ 0;
            font_h = (font_w - 1)/ FONT_ADJUST ^ 0;
        }

        ws.css("font-size", font_h + "px");
        console.log(font_h, ' x ', font_w);

        // Коэффициенты трансформации
        var transf_w = (container_w / ws_w);
        var transf_h = (container_h / ws_h);
        //console.log("transf: ", transf_w, "x", transf_h);

        // Трансформация
        ws.css("display", "block");
        //ws.css("width", container_w);
        //ws.css("transform-origin", transf_w/2 + "px " + transf_h/2 + "px");
        //ws.css("transform-origin", "0px 0px");
        //ws.css("transform", "scale("+transf_w+", "+transf_h+")");
        //ws.css("transform", "scale("+transf_w+", 1)");

        // Очистка рабочей области
        //ws.html("");

        return ws;
    },

    buildWorkspace : function(width, height, method) {
        var grid = new Array();
        if (method === 'table') {
            grid.push("<table cellspacing='0'>");
            for (var i=1; i<=height; i++) {
                grid.push("<tr>")
                for (var j=1; j<=width; j++) {
                    if (
                        i == 1 && j == 1
                        || i == 1 && (j % 10 == 0)
                        || (i % 5 == 0) && j == 1
                        || (i % 5 == 0) && (j % 10 == 0)
                    ) {
                        grid.push("<td class='bg_ fg_2'>ъ</td>");
                    } else {
                        grid.push("<td class='bg_ fg_6'>ж</td>");
                    }
                }
                grid.push("</tr>");
            }
        } else if(method === "span") {
            for (var i=1; i<=height; i++) {
                for (var j=1; j<=width; j++) {
                    if (
                        i == 1 && j == 1
                        || i == 1 && (j % 10 == 0)
                        || (i % 5 == 0) && j == 1
                        || (i % 5 == 0) && (j % 10 == 0)
                    ) {
                        grid.push("<span class='bg_ fg_2'>ъ</span>");
                    } else {
                        grid.push("<span class='bg_ fg_6'>ж</span>");
                    }
                }
                grid.push("<br />");
            }
        } else {
            for (var i=1; i<=height; i++) {
                for (var j=1; j<=width; j++) {
                    if (
                        i == 1 && j == 1
                        || i == 1 && (j % 10 == 0)
                        || (i % 5 == 0) && j == 1
                        || (i % 5 == 0) && (j % 10 == 0)
                    ) {
                        grid.push("ъ");
                    } else {
                        grid.push("ж");
                    }
                }
                grid.push("<br />");
            }
        }
        return "<div class='workspace'>" + grid.join('') + "</div>";
    },
//▄▀█▪
    mosaic : function() {
        var data = [];
		data['content'] =
            "                  ██▄   ▄██     ▄██▀██▄     ██▀▀██▄    ██ ▄██▀    ▀ ▀        RUS"+
            "                  ████▄████     ██▄▄▄██     ██▄▄██▀    █████                    "+
            "            ▄ ▄   ██ ▀█▀ ██     ██▀▀▀██     ██         ██ ▀██▄                  "+
            "                  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ Версия 4.2  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄                 "+
            "                  █                                           █                 "+
            "                  █   ▄▄         ▄▄▄▄▄▄▄                      █                 "+
            "                  █                 ▀▀▀▀▀                     █                 "+
            "                  █                                 ▀▀▀       █                 "+
            "                  █                        ▒                  █                 "+
            "                  █                        ▒                  █                 "+
            "                  █                        ▒           ▒ЁЁЁЁ  █                 "+
            "                  █ ЁЁЁЁЁЁЁЁЁ           ▌  ▒  ▌        ▒ЁЁЁЁ_ █                 "+
            "                  █ ▒▒▒▒▒▒▒▌Ё   ЁЁЁЁ    ▀▀▀▒  ▌ ▪▪▪▪▪▪▪▪▪▪ЁЁ  █                 "+
            "                  █                Ё            ▪▪▪▪▪▪▪▪▪▪▀###█                 "+
            "                  █═════════════   ══  ═        ═             █                 "+
            "                  █▀▀▀             ▀▀▀▀__  ___________________█                 "+
            "                  █                  ▀                        █                 "+
            "                  █         ▀ ▀▀▀▀▀▀▀▀▀       ▀▀▀▀            █                 "+
            "                  █                                           █                 "+
            "                  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀                 "+
            "▄▄▄▄▄ ▄▄▄▄▄ ▄▄▄▄▄    ▄▄▄▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄▄▄▄    ▄▄▄▄▄    ▄▄  ▄▄ ▄▄  ▄▄ ▄▄▄▄▄  ▄▄"+
            "▄▄▄██ ▀███▀ ██ ██    ██ ██ ██▄█▀ ██▄██ ██ ██    ██▄█▀    ██████ ██▄███ ██▄██  ██"+
            "▄▄▄██  ███  ██▄██    ██▄██ ██ ██ ██ ██ ██▄██    ██▄██    ██▐▌██ ██▀ ██ ██     ▄▄"+
            "                                                                                "+
            'Н П О   " И Н Ф О Р М - С И С Т Е М А "               Тел   124-99-38, 127-91-47';

		data['bg'] =
            "                                                                             444"+
            "                                                                                "+
            "                                                                                "+
            "                  0                0000000000                 0                 "+
            "                   6666666666666666666666666666666666666666666                  "+
            "                   6666666666666666666666666666666666666666666                  "+
            "                   6666666666666666666666666666666666666666666                  "+
            "                   6666666666666666666666666666666666666666666                  "+
            "                   6666666666666666666666667866666666666666666                  "+
            "                   6666666666666666666666667886666666666666666                  "+
            "                   6666666666ggg6663bbbb6667886666666667gggg66                  "+
            "                   6dddddddddggg8883bbbb8b67888888888887gggg                    "+
            "                   877777778dgggggggbbbb88878887gggggggggggg                    "+
            "                   2222222228gg2222g28g888888827ggggggggg                       "+
            "                   2222222222222222222222222222222222222222222                  "+
            "                                                                                "+
            "                                                                                "+
            "                   iiiiiiiiiiiiiiiiiiiiiiiiiii333333333iiii222                  "+
            "                   222ii33333333333333333333333333333333333333                  "+
            "                  0                                           0                 "+
            "                                                                                "+
            "                                                                                "+
            "                                                                                "+
            "                                                                                "+
            "                                                                                ";

        data['fg'] =
            "4444444444444444444444444444444444444444444444444444444444444444444444444444478k"+
            "44444444444444444444444444444444444444444444444444444444444444444444444444444444"+
            "44444444444444444444444444444444444444444444444444444444444444444444444444444444"+
            "444444444444444444044444444444444447777777zzz44444444444444444044444444444444444"+
            "4444444444444444444eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee444444444444444444"+
            "4444444444444444444eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee444444444444444444"+
            "4444444444444444444eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee444444444444444444"+
            "4444444444444444444eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee444444444444444444"+
            "4444444444444444444eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee444444444444444444"+
            "4444444444444444444                                           444444444444444444"+
            "4444444444444444444                                           444444444444444444"+
            "4444444444444444444 888888888                                 444444444444444444"+
            "4444444444444444444         8                                 444444444444444444"+
            "4444444444444444444                                           444444444444444444"+
            "4444444444444444444                                           444444444444444444"+
            "4444444444444444444                                           444444444444444444"+
            "4444444444444444444                                           444444444444444444"+
            "4444444444444444444                                           444444444444444444"+
            "4444444444444444444                                           444444444444444444"+
            "44444444444444444404444444444444444444444444444444444444444444044444444444444444"+
            "44444444444444444444444444444444444444444444444444444444444444444444444444444444"+
            "44444444444444444444444444444444444444444444444444444444444444444444444444444444"+
            "44444444444444444444444444444444444444444444444444444444444444444444444444444444"+
            "44444444444444444444444444444444444444444444444444444444444444444444444444444444"+
            "77777777777777777777777777777777777777777777777777777777777777777777777777777777";
        
        //console.log(data['fg']);
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        var buffer = "";
        var letter = "";
        for (var i=0; i< SCREEN_H; i++) {
            for (var j=0; j<SCREEN_W; j++) {
                if (data['content'][i*SCREEN_W + j] === ' ') {
                    letter = '&nbsp;';
                } else {
                    letter = data['content'][i*SCREEN_W + j];
                }
                buffer += "<span class='bg_" + data['bg'][i*SCREEN_W + j] + " fg_" + data['fg'][i*SCREEN_W + j] + "'>" +
                    letter
                    + "</span>";
            }
            buffer += "<br />";
        }

        return buffer;

    }
};