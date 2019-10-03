/*
| Shell global settings.
|
| FIXME remove (it should all be in config!)
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;


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
