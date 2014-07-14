/*
| Gets a member of a table specified by a literal.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule
*/
(function() {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		name :
			'Dot',
		unit :
			'Code',
		attributes :
			{
				expr :
					{
						comment :
							'the expression to get the member of',
						type :
							'Object'
					},
				member :
					{
						comment :
							'the members name',
						type :
							'String'
					}
			},
		node :
			true,
		init :
			[ ]
	};
}


var
	Dot;

Dot =
	require( '../jion/this' )( module );

/*
| Initializer.
*/
Dot.prototype._init =
	function( )
{
	var
		regex;

/**/if( CHECK )
/**/{
/**/	regex =
/**/		/^([a-zA-Z_])([a-zA-Z0-9_])*$/;
/**/
/**/	if( !regex.test( this.member ) )
/**/	{
/**/		throw new Error( 'invalid member name' );
/**/	}
/**/
/**/	switch( this.name )
/**/	{
/**/		case 'true' :
/**/		case 'false' :
/**/
/**/			throw new Error( 'member must not be a literal' );
/**/	}
/**/}
};


/*
| Creates a dot member access of a dot.
*/
Dot.prototype.Dot =
	function(
		member // member string
	)
{
	// checking if member is a string is done in 'Dot'
	return (
		Dot.Create(
			'expr',
				this,
			'member',
				member
		)
	);
};


/*
| Node export.
*/
module.exports =
	Dot;


} )( );
