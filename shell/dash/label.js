 /**____
 \  ___ `'.                          .
  ' |--.\  \                       .'|
  | |    \  '                     <  |
  | |     |  '    __               | |
  | |     |  | .:--.'.         _   | | .'''-.
  | |     ' .'/ |   \ |      .' |  | |/.'''. \
  | |___.' /' `" __ | |     .   | /|  /    | |
 /_______.'/   .'.''| |   .'.'| |//| |     | |
 \_______|/   / /   | |_.'.'.-'  / | |     | |
              \ \._,\ '/.'   \_.'  | '.    | '.
               `--'  `"            '---'   '---'
                 ,       .       .
                 )   ,-. |-. ,-. |
                /    ,-| | | |-' |
                `--' `-^ ^-' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A label on a dashboard.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Export
*/
var Dash;
Dash = Dash || {};

/**
| Imports
*/
var Curve;
var Euclid;
var Jools;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Constructor.
*/
var Label = Dash.Label = function(twig, panel, inherit, name) {
	this.name    = name;
	this.twig    = twig;
	this.panel   = panel;
	this.pos     = Curve.computePoint(twig.pos, panel.iframe);
	// if not null, overrides the design text
	// TODO rename $text
	this.text    = inherit ? inherit.text : null;
};

/**
| Labels cannot focus.
*/
Label.prototype.canFocus = function() {
	return false;
};

/**
| Draws the label on the fabric.
*/
Label.prototype.draw = function(fabric) {
	fabric.setFont(this.twig.font);
	fabric.fillText(this.text || this.twig.text, this.pos);
};

/**
| Clears cache.
*/
Label.prototype.poke = function() {
	this.panel.poke();
};

/**
| Force clears all caches.
*/
Label.prototype.knock = function() {
	// pass
};

/**
| Mouse hover.
*/
Label.prototype.mousehover = function(p, shift, ctrl) {
	return null;
};

/**
| Mouse down
*/
Label.prototype.mousedown = function(p, shift, ctrl) {
	return null;
};

})();
