/*
| The base of all meshcraft nodes.
|
| Authors: Axel Kittenberger
*/


/*
| Imports
*/
var Jools;


/*
| Exports
*/
var Twig =
	null;


/*
| Capsule
*/
( function( ) {
"use strict";


/*
| Node imports
*/
if( typeof( window ) === 'undefined' )
{
	Jools = require( './jools' );
}


/*
| Constructor
*/
Twig =
	function( )
{
};


/*
| Returns the rank of the key
| That means it returns the index of key in the ranks array.
*/
Twig.prototype.rankOf =
	function( key )
{
	var ranks =
		this.ranks;

	if( !Jools.isArray( ranks ) )
	{
		throw new Error( 'twig has no ranks' );
	}

	if( !Jools.isString( key ) )
	{
		throw new Error('key no string');
	}

	// checks ranking cache
	var rof =
		this._$rof;

	if( !rof )
	{
		Object.defineProperty(
			this,
			'_$rof',
			rof = { }
		);
	}

	var r =
		rof[ key ];

	if( Jools.is( r ) )
	{
		return r;
	}

	var x =
		Jools.is( this.copse[key] ) ?
			ranks.indexOf( key ) :
			-1;

	return rof[ key ] = x;
};


/*
| Returns length of a copse
*/
Jools.lazyFixate(
	Twig.prototype,
	'length',
	function( )
	{
		return this.ranks.length;
	}
);


/*
| Creates a new unique identifier
*/
Twig.prototype.newUID =
	function( )
{
	var u =
		Jools.uid( );

	return (
		( !Jools.is( this.copse[ u ] ) ) ?
			u :
			this.newUID( )
	);
};


/*
| Returns the twig type.
*/
Twig.getType =
	function( o )
{
	switch( o.constructor )
{
	case Array :
		return 'Array';

	case Boolean :
		return 'Boolean';

	case Number :
		return 'Number';

	case String :
		return 'String';

	default :
		return o.type;
	}
};


/*
| Node export
*/
if( typeof( window ) === 'undefined')
{
	module.exports = Twig;
}

} )( );

