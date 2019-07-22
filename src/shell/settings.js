/*
| Shell global settings.
|
| FIXME remove (it should all be in config!)
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;


/*
| If false don't do any animations.
*/
def.static.animation = true;


/*
| Milliseconds for zoom animation to all/home.
*/
def.static.animationZoomAllHomeTime = 120;


/*
| Milliseconds for zoom animation in single in or out steps.
*/
def.static.animationZoomStepTime = 40;

// blink speed of the caret.
// Note currently not blinking, but used to check
// the input box.
def.static.caretBlinkSpeed = 530;


// milliseconds after mouse down, dragging starts
def.static.dragtime = 400;

// pixels after mouse down and move, dragging starts
def.static.dragbox = 10;

/*
| Zooming settings.
*/
def.static.zoomBase = 1.1;

def.static.zoomMin = -150;

def.static.zoomMax = 150;

/*
| Max. number of undo events queued.
*/
def.static.maxUndo = 1000;

/*
| Do not cache the glyph for fonts larger than this.
| Only applicable if opentype is true
*/
def.static.glyphCacheLimit = 250;
//def.static.glyphCacheLimit = Number.POSITIVE_INFINITY;

/*
| Maximum size of a glint graphic cache
| in width * height
*/
def.static.glintCacheLimit = 32767;
//def.static.glintCacheLimit = 1073741823;
//def.static.glintCacheLimit = Number.POSITIVE_INFINITY;


/*
| Pixels to scroll on a wheel event
*/
def.static.textWheelSpeed = 12 * 5;


} );
