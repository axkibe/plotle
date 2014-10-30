/*
| A jion id.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule.
*/
(function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'jion.id',
		node :
			true,
		attributes :
			{
				'name' :
					{
						comment :
							'the name part of the id if applicable',
						type :
							'String',
						defaultValue :
							undefined
					},
				'unit' :
					{
						comment :
							'the unit part of the id if applicable',
						type :
							'String',
						defaultValue :
							undefined
					}
			},
		init :
			[ ]
	};
}


var
	astString,
	id,
	jools;

id =
module.exports =
	require( '../jion/this' )( module );

astString = require( '../ast/ast-string.js' );

jools = require( '../jools/jools' );


/*
| Initializer.
*/
id.prototype._init =
	function( )
{
	// FIXME?
};


/*
| Create the id from a string specifier.
*/
id.createFromString =
	function(
		string
	)
{
	var
		split;

	split = string.split( '.' );

	if( split.length <= 1 )
	{
		return id.create( 'name', string );
	}

	if( split.length > 2 )
	{
		throw new Error( );
	}

	return(
		id.create(
			'unit', split[ 0 ],
			'name', split[ 1 ]
		)
	);
};


/*
| This id as astString
*/
jools.lazyValue(
	id.prototype,
	'astString',
	function( )
	{
		if( this.unit )
		{
			return(
				astString.create(
					'string', this.unit + '.' + this.name
				)
			);
		}
		else
		{
			return(
				astString.create(
					'string', this.name
				)
			);
		}
	}
);

} )( );
