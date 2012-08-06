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

                         ,--. .                  .-,--.
                        | `-' |-. ,-. ,-. ,-. ,-. `|__/ ,-. . .
                        |   . | | ,-| | | | | |-' )| \  ,-| | |
                        `--'  ' ' `-^ ' ' `-| `-' `'  ` `-^ `-|
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~/| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                           `'               `-'
 An array of changes to a tree.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/*
| Export
*/
var ChangeRay;


/*
| Imports
*/
var Jools;
var Change;


/*
| Capsule
*/
(function() {
"use strict";


/*
| Node includes.
*/
if (typeof(window) === 'undefined')
{
	Jools  = require( './jools'  );
	Change = require( './change' );
}


/*
| Constructor
*/
ChangeRay = function( )
{
	this._$ray = [ ];
};


/*
| Returns a change ray with inverted changes.
*/
ChangeRay.prototype.invert = function()
{
	if ( this._$invert )
		{ return this._$invert; }

	var inv = new ChangeRay( );

	for( var a = 0, aZ = this.length; a < aZ; a++)
		{ inv._$ray[a] = this._$ray[a].invert(); }

	if ( Jools.is( this._$invert ) )
		{ Jools.innumerable( this, '_$invert', inv ); }
	else
		{ Jools.innumerable( this, '_$invert', inv ); }

	Jools.innumerable( inv, '_$invert', this );

	return inv;
};


/*
| Pushes a change to the change ray.
*/
ChangeRay.prototype.push = function( chg )
{
	if ( this._invert )
		{ this._invert = null; }

	this._$ray.push(chg);
};


/*
| Change emulates an Array with the length of 1
*/
Object.defineProperty ( ChangeRay.prototype, 'length',
	{
		get : function( )
			{ return this._$ray.length; }
	}
);


// TODO remove
Jools.keyNonGrata(ChangeRay.prototype, 0);


/*
| Gets one change.
*/
ChangeRay.prototype.get = function( idx )
{
	return this._$ray[idx];
};


/*
| Sets one change.
*/
ChangeRay.prototype.set = function( idx, chg )
{
	if ( this._invert )
		{ this._invert = null; }

	return this._$ray[idx] = chg;
};


/*
| Exports
*/
if (typeof(window) === 'undefined')
	{ module.exports = ChangeRay; }

}());
