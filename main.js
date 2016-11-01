/*jslint browser: true, devel: true, white: true, eqeq: true, plusplus: true, vars: true*/


/**
    Gets the text from the field, and then returns an array with each new line in a different position.
    @return {Array}
*/
function getText(){
    "use strict";
    
    var text = document.querySelector("#textToShow").value;
    var textArray = text.split(/\r?\n/);
    
    return textArray;
}



/**
    Gets the width and height and returns them as an array
    @return {Array}
*/
function getWidthHeight(){
    "use strict";
    
    var width = document.querySelector("#imgWidth").value;
    var height = document.querySelector("#imgHeight").value;
    
    return [width, height];
}


/**
    Returns the specified font size
    @return {String}
*/
function getFontSize(){
    "use strict";
    
    return document.querySelector("#fontSize").value;
}



// Object that contains all methods pertaining to analysing the width and height of the text in relation to the specified canvas size
var textAnalyser = {
    
    /**
        Checks the width of all lines and returns an array which first position is false or true, and second position being the line number being too large
    */
    "analyseWidth":function(context, text, dimensions){
        "use strict";
        
        var finalAnswerBool = true;
        var lineNumber = 0;
        
        var i;
        for(i=0;i<text.length;i++){
            if(context.measureText(text[i]).width > dimensions[0]){
                finalAnswerBool = false;
                lineNumber = i;
            }
        }
        
        return [finalAnswerBool, lineNumber];
    },
    
    /**
        Checks the total height of the text and returns false if too tall
    */
    "analyseHeight":function(text, dimensions, fontSize){
        "use strict";
        
        if((text.length*fontSize) > dimensions[1]){
            return false;
        }
        else{
            return true;
        }
    }
};



/**
    Generates a blank canvas tag with the specified width/height, then fills it with the text
*/
function buildCanvas(){
    "use strict";
    
    var dimensions = getWidthHeight();
    var fontSize = getFontSize();
    var text = getText();
    
    var canvas = document.createElement("canvas");
    canvas.setAttribute("width",dimensions[0]);
    canvas.setAttribute("height",dimensions[1]);
    
    var context = canvas.getContext("2d");
    
    // Have to make the background black
    context.fillStyle = "#000000";
    context.fillRect(0,0,dimensions[0],dimensions[1]);
    
    // Define the font, its size and color
    context.fillStyle = "#ffc400";
    context.font = fontSize + "px Arial";
    
    var widthAnalysis = textAnalyser.analyseWidth(context, text, dimensions);
    
    if(textAnalyser.analyseHeight(text,dimensions,fontSize) == false){
        alert("Too many lines for font size / image height ratio. You can either reduce the amount of lines or reduce the font size.");
    }
    else if(widthAnalysis[0] == false){
        alert("Line number: " + widthAnalysis[1] + " is too large for the specified width. You can either seperate into a new line or reduce the font size.");    
    }
    else{
        var e = 0;
        var i;
        for(i=text.length;i--;i<0){
            context.fillText(text[i], dimensions[0] - context.measureText(text[i]).width-10, dimensions[1]-(fontSize*e)-10);
            e++;
        }
        
        
        //And now we transform into a picture then show it in the page.
        var image = document.createElement("img");
        image.setAttribute("src",canvas.toDataURL());
        
        var position = document.querySelector("#content");
        position.appendChild(image);
    }
    
    
}