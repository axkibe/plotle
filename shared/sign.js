/*
| Signates an entry, string index or string span.
|
| Authors: Axel Kittenberger
|
*/

/*
| Exports
*/
var Sign;


/*
| Imports
*/
var Jools;


/*
| Capsule
*/
( function( ) {
"use strict";


/*
| Node includes.
*/
if(typeof( window ) === 'undefined' )
{
	Jools = require('./jools');
}


/*
| Constructor
*/
Sign = function(model /*, ...*/)
{
	var k;

	// first properties from the model are inherited

	for( k in model )
	{
		// ignores inherited properties
		if( !Object.hasOwnProperty.call( model, k ) )
		{
			continue;
		}

		if( !Sign.field[ k ] )
		{
			throw Jools.reject( 'invalid Sign property: ' + k );
		}

		this[k] = model[k];
	}

	// then properties from arguments are applied

	for(
		var a = 1, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		k =
			arguments[ a ];

		if( !Sign.field[ k ] )
		{
			throw Jools.reject('invalid Sign property: ' + k );
		}

		this[ k ] = arguments[ a + 1 ];
	}

	Jools.immute(this);
};


/*
| List of keys allowed in a signature
*/
Sign.field =
	Jools.immute({
		'at1'   : true,
		'at2'   : true,
		'path'  : true,
		'proc'  : true,
		'rank'  : true,
		'space' : true,
		'val'   : true
	});


/*
| Sets a new value of a signature.
|
| If the signature has the value preset, it checks equality.
|
| sign : signature to affix
| test : function to test existence of key (is or isnon)
| cm   : check message for failed checks
| base : base message for failed checks
| key  : key to affix at
| val  : value to affix
*/
Sign.prototype.affix = function(test, cm, base, key, val) {

	if( test( this[ key ] ) )
	{
		if( !Jools.matches( val, this[ key ] ) )
		{
			throw new Jools.reject(
				[
					cm,
					' ',
					base,
					'.',
					key,
					' faulty preset ',
					val,
					' !== ',
					this[ key ]
				].join( '' )
			);
		}

		return this;
	}

	return new Sign(
		this,
		key,
		val
	);
};


/*
| Node
*/
if (typeof(window) === 'undefined') {
	module.exports = Sign;
}

}( ) );
