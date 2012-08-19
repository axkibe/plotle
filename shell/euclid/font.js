/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .'       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--'

                                       ," ,-. ,-. |-
                                       |- | | | | |
                                       |  `-' ' ' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A font face style.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/*
| Export
*/
var Euclid;
Euclid = Euclid || {};


/*
| Imports
*/
var Jools;


/*
| Capsule
*/
(function() {
'use strict';

if (typeof(window) === 'undefined')
	{ throw new Error('this code needs a browser!'); }


/*
| Constructor.
|
| size   : font size in pixel
| family : font family
| fill   : font color
| align  : horizontal align
| base   : vertical base position
|
| or
|
| o : one object that contains it all
*/
var Font = Euclid.Font = function(size_o, family, fill, align, base)
{
	if (typeof(size_o) === 'object' && !(size_o instanceof Number))
	{
		this.size    = size_o.size;
		this.family  = size_o.family;
		this.fill    = size_o.fill;
		this.align   = size_o.align;
		this.base    = size_o.base;
	}
	else
	{
		this.size    = size_o;
		this.family  = family;
		this.fill    = fill;
		this.align   = align;
		this.base    = base;
	}

	Jools.immute(this);
};


/*
| Returns the CSS-string for this font.
*/
Font.prototype.getCSS = function()
{
	if (this._$css)
		{ return this._$css; }

	return this._$css = this.size + 'px ' + this.family;
};

} ) ();
