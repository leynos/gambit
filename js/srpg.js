/*
 * Copyright © 2014, David McIntosh <dmcintosh@df12.net>
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

var $ = require("jquery");

// Encapsulate tile drawing methods
var Tiler = function(context, src, tileW, tileH) {
    this.image = new Image();
    this.image.src = src;
    this.tileW = tileW;
    this.tileH = tileH;

    // Draw a single tile (referncing X, Y pos on the spritesheet) at the given
    // destination position
    this.draw = function(tileNumX, tileNumY, destX, destY, destW, destH) {
        context.drawImage(this.image, 
            tileNumX * this.tileW, 
            tileNumY * this.tileH, 
            this.tileW, this.tileH, 
            destX, destY, 
            destW, destH);
    };

    // Draw the map in its entirity.  Later, we'll add clipping options, etc.
    this.drawMap = function(offsetX, offsetY) {
        for (var i=0; i<16; i++) {
            for (var j=0; j<16; j++) {
                // For now, we're just drawing boring grass
                this.draw(14, 4, 
                    i*this.tileW + offsetX, j*this.tileH + offsetY, 32, 32);
            }
        }
    };
};

// The "Game" object
var Gambit = function(canvas) {
    var context = canvas.getContext("2d");
    var viewportW = canvas.width;
    var viewportH = canvas.height;
    var tiler = new Tiler(context, "img/mountain_landscape_23.png", 32, 32);
    var offset = {
        x: 0,
        y: 0
    };

    this.run = function() {
        tiler.drawMap(0, 0);

        // Add a listener for dragging
        $(canvas).on("mousedown.scroller", function(evt) {

            // Drag origin
            var origin = {
                x: evt.pageX,
                y: evt.pageY
            };

            // Current drag delta
            newOffset = {
                x: 0,
                y: 0
            };

            var doc = $(document);
            doc.on("mousemove.scroller", function(evt) {
                newOffset.x = evt.pageX - origin.x;
                newOffset.y = evt.pageY - origin.y;
                $("#pos-x").html(newOffset.x + offset.x);
                $("#pos-y").html(newOffset.y + offset.y);

                // We're drawing the whole map in its entirity every frame.
                // Very inefficient.  Eventually, we'll use propery scrolling
                context.clearRect(0, 0, viewportW, viewportH);
                tiler.drawMap(newOffset.x + offset.x, newOffset.y + offset.y);
            });

            doc.on("mouseup.scroller", function(evt) {

                // remove handlers so no more dragging happens
                doc.off("mousemove.scroller mouseup.scroller");

                // update global offset
                offset.x += newOffset.x;
                offset.y += newOffset.y;
            });
        });
    };
}

var canvas;
canvas = document.getElementById("main");
canvas.width = 512;
canvas.height = 521;

var game = new Gambit(canvas);
game.run();
