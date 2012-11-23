/*
|
| The interface simulator simulates a server without ever
| talking to one. Used for debugging.
|
| Authors: Axel Kittenberger
| License: MIT(Expat), see accompanying 'License'-file
|
*/


/*
| Export
*/
var IFaceSym;


/*
| Imports
*/
var Change;
var ChangeRay;
var MeshMashine;
var Meshverse;
var Path;
var Sign;
var Tree;
var Jools;
var config;
var shell;
var system;


/*
| Capsule
*/
( function( ) {
"use strict";

if( typeof ( window ) === 'undefined' )
	{ throw new Error( 'this code nees a browser!' ); }

/*
| Constructor.
*/
IFaceSym = function( )
{
	// the current space;
	this.$space  =
		new Tree(
			{
				type  : 'Space',
				copse :
				{
					'testnote' :
					{
						type     : 'Note',
						doc      :
						{
							type  : 'Doc',
							copse :
							{
								'1' :
								{
									type : 'Para',
									text : 'muhkuh'
								}
							},
							ranks :
							[
								'1'
							]
						},
						zone     :
						{
							type : 'Rect',

							pnw  :
							{
								type : 'Point',
								x    : 0,
								y    : 0
							},

							pse  :
							{
								type : 'Point',
								x    : 100,
								y    : 100
							}
						},

						fontsize : 13
					}
				},
				ranks : [
					'testnote'
				]
			},
			Meshverse
		);

	// current update request
	this.$changes = [ ];

	this.$time = 0;
};


/*
| Sets the current user
*/
IFaceSym.prototype.setUser =
	function(
		user,
		passhash
	)
{
	this.$user     = user;
	this.$passhash = passhash;
};


/*
| Aquires a space.
*/
IFaceSym.prototype.aquireSpace = function(spacename, callback)
{
	var self = this;
	if( spacename !== 'testpad' ) {
		throw new Error(' IFaceSym only has the space "testpad"');
	}

	self.$spacename = spacename;

	callback(
		null,
		Jools.immute(
			{
				tree   : self.$space,
				name   : spacename,
				access : 'rw'
			}
		)
	);

};


/*
| Gets a twig.
*/
IFaceSym.prototype.get =
	function(
		path,
		len
	)
{
	var changes = this.$changes;
	var cZ      = changes.length;
	var time    = this.$time;
	var space   = this.$space;

	if( time < 0 || time > cZ )
		{ throw new Error('invalid time'); }

	// if the requested tree is not the latest, replay it backwards
	for (var a = cZ - 1; a >= time; a--)
	{
		var chgX = changes[ a ];

		for (var b = 0; b < chgX.length; b++)
		{
			space = chgX.
				get( 0 ).
				invert( ).
				changeTree( space ).
				tree;
		}
	}

	// returns the path requested
	return space.getPath( path, len );
};


/*
| Alters the tree
|
| TODO why doesnt this get a change?
*/
IFaceSym.prototype.alter =
	function( src, trg )
{
    var chgX = new Change(
		new Sign( src ),
		new Sign( trg )
	);

	var changes = this.$changes;
	var cZ      = changes.length;
	var time    = this.$time;

	for(var t = time; t < cZ; t++) {
		chgX = MeshMashine.tfxChgX( chgX, changes[t] );
		if (chgX === null)
		{
			return null;
		}
	}

	var r = chgX.changeTree( this.$space );
	chgX  = r.chgX;

	for(var a = 0; a < chgX.length; a++) {
		this.$changes.push( chgX.get( a ) );
	}

    this.$space = r.tree;

    return r.chgX;
};


/*
| Sets the time 'alter' and 'get' will react on
*/
IFaceSym.prototype.goToTime =
	function( time )
{
	var cZ = this.$changes.length;

	if( time > cZ || time < 0 )
		{ time = cZ; }

	return this.$time = time;
};


/*
| gets the maximum time
*/
IFaceSym.prototype.getMaxTime =
	function( time )
{
	return this.$changes.length;
};


} )( );
