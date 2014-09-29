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
		id :
			'ast.aDot',
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



/*
| Import
*/
var
	aDot,
	aMember;

aDot =
module.exports =
	require( '../jion/this' )( module );

aMember = require( './a-member' );


/*
| Initializer.
*/
aDot.prototype._init =
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
aDot.prototype.aDot =
	function(
		member // member string
	)
{
	// checks if member is a string is done in 'aDot'

	return (
		aDot.create(
			'expr',
				this,
			'member',
				member
		)
	);
};


/*
| Creates a generic member access of a variable.
*/
aDot.prototype.aMember =
	function(
		member // member expression
	)
{
	return (
		aMember.create(
			'expr',
				this,
			'member',
				member
		)
	);
};


} )( );
