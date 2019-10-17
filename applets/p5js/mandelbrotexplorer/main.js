/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 28-Nov-2018
 * Original code by Kato https://www.openprocessing.org/user/114431
 */

// Last update 02-Oct-2019

let mandelbrot;

let WIDTH = 770;
let HEIGHT = 590;
let ctlsBack = 180;
let sizePlot = false;
let starting = false;
let up = 1;
let down = 2;
let left = 3;
let right = 4;
let zoomin = 5;
let zoomout = 6;
let reset = 7;
let infor = 8;
let changeC = false;

let buttonUP;
let buttonDOWN;
let buttonLEFT;
let buttonRIGHT;

let buttonZOOMIN;
let buttonZOOMOUT;

let buttonRESET;
let buttonINFO;

let sliderIter;


var cnv;

function centerCanvas() {
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    cnv.position(x, y);
}

function setup() {
    cnv = createCanvas(WIDTH, HEIGHT);
    cursor(HAND);
    
    mandelbrot = new Mandelbrot();
    pixelDensity(1);//I need this for small devices
    
    controlsUI();
    
}

//function windowResized() {
 //  centerCanvas();
       // resizeCanvas(510, 490);
    
//}

function draw() {
    background(200);
    
    //Initial message
    if (starting == false) {
        fill(190);
        stroke(190);
        rect(0,0, width, height);
        fill(0);
        stroke(0);
        textAlign(CENTER);
        textSize(32);
        text("Click to start!", width / 2, height / 2);
    }
    if(starting == true){
    //
    textAlign(LEFT);
    mandelbrot.update();
    mandelbrot.plot();
    fill(0);
    stroke(0);
    strokeWeight(0.2);
    textSize(22);
    text("Control keys", 35, 70);
    text("Iterations", 35, 450);
    }

    
    up = 1;
    down = 2;
    left = 3;
    right = 4;
    zoomin = 5;
    zoomout = 6;
    reset = 7;
    infor = 8;
    //console.log(infor);
    
}

function keyReleased() {
    if (keyCode === 73)//I key
        mandelbrot.printDebug = !mandelbrot.printDebug;
   
}



//function mouseWheel() {
//    if(starting == true){
//    mandelbrot.zoomAt(mouseX, mouseY, 0.85, event.delta < 0);
//    }
//}


// KeyCodes available at: http://keycode.info/
const KC_UP = 38;        // Move up W
const KC_DOWN = 40;        // Move down S
const KC_LEFT = 37;        // Move left A
const KC_RIGHT = 39;    // Move right D
const KC_UNZOOM = 189;    // Zoom back -
const KC_ZOOM = 187;    // Zoom in +
const KC_RESET = 82;    // Reset zoom level and position R

class Mandelbrot {
    
    constructor(){
    this.origSize = new p5.Vector(3, 3);
    this.size = new p5.Vector(this.origSize.x, this.origSize.y);
    this.origPos = new p5.Vector(-0.7, 0);//Origin position
    this.pos = new p5.Vector(this.origPos.x, this.origPos.y);
    this.maxIter = 180;
    this.origZoom = 1;
    this.zoom = this.origZoom;
    this.printDebug = false;
    }
    
    update(){
        
        var moveSpeed = 0.1 * this.zoom;
        if (up === -1 || keyIsDown(KC_UP))
            this.pos.y -= moveSpeed;
        if (down === -2 || keyIsDown(KC_DOWN))
            this.pos.y += moveSpeed;
        if (left === -3 || keyIsDown(KC_LEFT))
            this.pos.x -= moveSpeed;
        if (right === -4 || keyIsDown(KC_RIGHT))
            this.pos.x += moveSpeed;
        if (zoomout === -6 || keyIsDown(KC_UNZOOM))
            this.zoomAt(395, 245, 0.95, false);
        if (zoomin === -5 || keyIsDown(KC_ZOOM))
            this.zoomAt(395, 245, 0.95, true);
        if (infor === -8)
            this.printDebug = !this.printDebug;
        if (reset === -7 ||keyIsDown(KC_RESET))
        {
            this.size.x = this.origSize.x;
            this.size.y = this.origSize.y;
            this.pos.x = this.origPos.x;
            this.pos.y = this.origPos.y;
            this.zoom = this.origZoom;
        }
        this.maxIter = sliderIter.value();
        
    }
    
    zoomAt(x, y, ammount, isZoomIn){
        
        ammount = isZoomIn ? ammount : 1 / ammount;
        x = map(x, ctlsBack, width, this.pos.x - this.size.x / 2, this.pos.x + this.size.x / 2);
        y = map(y, height, 0,  this.pos.y - this.size.y / 2, this.pos.y + this.size.y / 2);
        this.pos.x = x + (this.pos.x - x) * ammount;
        this.pos.y = y + (this.pos.y - y) * ammount;
        this.zoom *= ammount;
        this.size.x = this.origSize.x * this.zoom;
        this.size.y = this.origSize.y * this.zoom;
        
    }
    
    plot(){
        
        loadPixels();
        
        var cX = this.pos.x + map(mouseX, ctlsBack, width, -this.size.x / 2, this.size.x / 2);//this is for Mandelbrot
        var cY = this.pos.y + map(mouseY, height, 0, -this.size.y / 2, this.size.y / 2);//this is for Mandelbrot
        
        for (var x = ctlsBack; x < width; x++) {
            for (var y = 0; y < height; y++) {
                var sqZ = new p5.Vector(0, 0);
                var z = new p5.Vector(
                                      this.pos.x + map(x, ctlsBack, width, -this.size.x / 2, this.size.x / 2),
                                      this.pos.y + map(y, height, 0, -this.size.y / 2, this.size.y / 2)
                                      );
                var c = new p5.Vector(z.x, z.y);
                
                var iter = 0;
                while (iter < this.maxIter) {
                    sqZ.x = z.x * z.x - z.y * z.y;
                    sqZ.y = 2 * z.x * z.y;
                    z.x = sqZ.x + c.x;
                    z.y = sqZ.y + c.y;
                    if (abs(z.x + z.y) > 16)
                        break;
                    iter++;
                }
                setPixelHSV(x, y, map(iter, 0, this.maxIter, 0, 1), 1, iter !== this.maxIter);
            }
        }
        updatePixels();
        if (this.printDebug) {
            //Frame reference
            
            stroke(220);
            strokeWeight(2);
            line((width+ctlsBack)/2, 0, (width+ctlsBack)/2, height);
            line(ctlsBack, height/2, (width+ctlsBack), height/2);
            ellipse((width+ctlsBack)/2, height/2, 8, 8);
            
            fill(255);
            stroke(0);
            strokeWeight(2);
            textSize(18);
            text("x: " + str( round( this.pos.x * 100 )/100 )
                 + "\ny: " + str( round( this.pos.y * 100 )/100 )
                 + "\nzoom: " + str( round(  (1 / this.zoom) * 100 )/100 )
                 + "\niterations: " + str( round(  (this.maxIter) * 100 )/100 )
                 , ctlsBack + 10, 15
                 );
        }
        //draw constant label
        fill(255);
        stroke(0);
        strokeWeight(2);
        textSize(20);
        if ( mouseX > ctlsBack ){
        text("Mouse: (" + str(round(cX*100)/100.0) + "," + str(round(cY*100)/100.0) + ")", ctlsBack + 10, height-15);
        }
        
        var xc = mouseX;
        var yc = mouseY;
        if(xc<=ctlsBack){
            fill(200);}
        else{
            fill(255);}
        noStroke();
        ellipse(xc, yc, 8, 8);
        
    }
    
}

function mouseClicked() {
    starting = true;
    if (changeC) {
        changeC = false;
    } else {
        changeC = true;
    }
}


function setPixelRGB(x, y, r, g, b) {
    var pixelID = (x + y * width) * 4;
    pixels[pixelID + 0] = r;
    pixels[pixelID + 1] = g;
    pixels[pixelID + 2] = b;
    pixels[pixelID + 3] = 255;
}

function setPixelHSV(x, y, h, s, v) {
    var r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    setPixelRGB(x, y, Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
}

function controlsUI(){
    buttonUP = createButton('&uarr;');
    buttonUP.position(70, 100);
    buttonUP.style('font-size','20');
    buttonUP.style('box-shadow', 'inset 0px 1px 0px 0px #ffffff');
    buttonUP.style('background', 'linear-gradient(to bottom, #ffffff 5%, #f6f6f6 100%)');
    buttonUP.style('background-color', '#ffffff');
    buttonUP.style('border-radius', '6px');
    buttonUP.style('border', '1px solid #dcdcdc');
    buttonUP.style('font-family', 'Arial');
    buttonUP.style('font-weight', 'bold');
    buttonUP.style('padding', '6 px 10 px');
    buttonUP.mousePressed(userUP);
    
    buttonDOWN = createButton('&darr;');
    buttonDOWN.position(buttonUP.x, buttonUP.y+45);
    buttonDOWN.style('font-size','20');
    buttonDOWN.style('box-shadow', 'inset 0px 1px 0px 0px #ffffff');
    buttonDOWN.style('background', 'linear-gradient(to bottom, #ffffff 5%, #f6f6f6 100%)');
    buttonDOWN.style('background-color', '#ffffff');
    buttonDOWN.style('border-radius', '6px');
    buttonDOWN.style('border', '1px solid #dcdcdc');
    buttonDOWN.style('font-family', 'Arial');
    buttonDOWN.style('font-weight', 'bold');
    buttonDOWN.style('padding', '6 px 10 px');
    buttonDOWN.mousePressed(userDOWN);
    
    buttonLEFT = createButton('&larr;');
    buttonLEFT.position(buttonUP.x-50, (buttonUP.y+45));
    buttonLEFT.style('font-size','20');
    buttonLEFT.style('box-shadow', 'inset 0px 1px 0px 0px #ffffff');
    buttonLEFT.style('background', 'linear-gradient(to bottom, #ffffff 5%, #f6f6f6 100%)');
    buttonLEFT.style('background-color', '#ffffff');
    buttonLEFT.style('border-radius', '6px');
    buttonLEFT.style('border', '1px solid #dcdcdc');
    buttonLEFT.style('font-family', 'Arial');
    buttonLEFT.style('font-weight', 'bold');
    buttonLEFT.style('padding', '6 px 10 px');
    buttonLEFT.mousePressed(userLEFT);
    
    buttonRIGHT = createButton('&rarr;');
    buttonRIGHT.position(buttonUP.x+45, (buttonUP.y+45));
    buttonRIGHT.style('font-size','20');
    buttonRIGHT.style('box-shadow', 'inset 0px 1px 0px 0px #ffffff');
    buttonRIGHT.style('background', 'linear-gradient(to bottom, #ffffff 5%, #f6f6f6 100%)');
    buttonRIGHT.style('background-color', '#ffffff');
    buttonRIGHT.style('border-radius', '6px');
    buttonRIGHT.style('border', '1px solid #dcdcdc');
    buttonRIGHT.style('font-family', 'Arial');
    buttonRIGHT.style('font-weight', 'bold');
    buttonRIGHT.style('padding', '6 px 10 px');
    buttonRIGHT.mousePressed(userRIGHT);
    
    buttonZOOMIN = createButton('&plus;');
    buttonZOOMIN.position(buttonUP.x, buttonUP.y+100);
    buttonZOOMIN.style('font-size','20');
    buttonZOOMIN.style('box-shadow', 'inset 0px 1px 0px 0px #ffffff');
    buttonZOOMIN.style('background', 'linear-gradient(to bottom, #ffffff 5%, #f6f6f6 100%)');
    buttonZOOMIN.style('background-color', '#ffffff');
    buttonZOOMIN.style('border-radius', '6px');
    buttonZOOMIN.style('border', '1px solid #dcdcdc');
    buttonZOOMIN.style('font-family', 'Arial');
    buttonZOOMIN.style('font-weight', 'bold');
    buttonZOOMIN.style('padding', '6 px 10 px');
    buttonZOOMIN.mousePressed(userZOOMIN);
    
    buttonZOOMOUT = createButton('&minus;');
    buttonZOOMOUT.position(buttonUP.x, buttonUP.y+140);
    buttonZOOMOUT.style('font-size','20');
    buttonZOOMOUT.style('box-shadow', 'inset 0px 1px 0px 0px #ffffff');
    buttonZOOMOUT.style('background', 'linear-gradient(to bottom, #ffffff 5%, #f6f6f6 100%)');
    buttonZOOMOUT.style('background-color', '#ffffff');
    buttonZOOMOUT.style('border-radius', '6px');
    buttonZOOMOUT.style('border', '1px solid #dcdcdc');
    buttonZOOMOUT.style('font-family', 'Arial');
    buttonZOOMOUT.style('font-weight', 'bold');
    buttonZOOMOUT.style('padding', '6 px 10 px');
    buttonZOOMOUT.mousePressed(userZOOMOUT);
    
    buttonRESET = createButton('R');
    buttonRESET.position(buttonUP.x, buttonUP.y+190);
    buttonRESET.style('font-size','20');
    buttonRESET.style('box-shadow', 'inset 0px 1px 0px 0px #ffffff');
    buttonRESET.style('background', 'linear-gradient(to bottom, #ffffff 5%, #f6f6f6 100%)');
    buttonRESET.style('background-color', '#ffffff');
    buttonRESET.style('border-radius', '6px');
    buttonRESET.style('border', '1px solid #dcdcdc');
    buttonRESET.style('font-family', 'Arial');
    buttonRESET.style('font-weight', 'bold');
    buttonRESET.style('padding', '6 px 10 px');
    buttonRESET.mousePressed(userRESET);
                                           
    buttonINFO = createButton('I');
    buttonINFO.position(buttonUP.x, buttonUP.y+240);
    buttonINFO.style('font-size','20');
    buttonINFO.style('box-shadow', 'inset 0px 1px 0px 0px #ffffff');
    buttonINFO.style('background', 'linear-gradient(to bottom, #ffffff 5%, #f6f6f6 100%)');
    buttonINFO.style('background-color', '#ffffff');
    buttonINFO.style('border-radius', '6px');
    buttonINFO.style('border', '1px solid #dcdcdc');
    buttonINFO.style('font-family', 'Arial');
    buttonINFO.style('font-weight', 'bold');
    buttonINFO.style('padding', '6 px 10 px');
    buttonINFO.mousePressed(userINFO);
    
    sliderIter = createSlider(0, 400, 100, 1);
    sliderIter.style('width', '130px')
    sliderIter.position(buttonUP.x-50, buttonUP.y+370)
}

function userUP() {
    up = -1;
}

function userDOWN() {
    down = -2;
}

function userLEFT() {
    left = -3;
}

function userRIGHT() {
    right = -4;
}

function userZOOMIN() {
    zoomin = -5;
}

function userZOOMOUT() {
    zoomout = -6;
}

function userRESET() {
    reset = -7;
}
                                           
function userINFO() {
    infor = -8;
}


/*function mousePressed() {
    up = true;
}

function mouseReleased() {
    up = false;
}*/
