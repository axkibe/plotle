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
				'type' :
					{
						comment :
							'the type part of the id if applicable',
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
	id;

id =
module.exports =
	require( '../jion/this' )( module );


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
		return id.create( 'type', string );
	}

	if( split.length > 2 )
	{
		throw new Error( );
	}

	return(
		id.create(
			'unit', split[ 0 ],
			'type', split[ 1 ]
		)
	);
};


} )( );
