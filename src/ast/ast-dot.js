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
			'ast.astDot',
		attributes :
			{
				expr :
					{
						comment :
							'the expression to get the member of',
						type :
							'Object' // FUTURE ->expression
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
	astDot,
	aMember;

astDot =
module.exports =
	require( '../jion/this' )( module );

aMember = require( './a-member' );


/*
| Initializer.
*/
astDot.prototype._init =
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
astDot.prototype.astDot =
	function(
		member // member string
	)
{
	// checks if member is a string is done in 'astDot'

	return (
		astDot.create(
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
astDot.prototype.aMember =
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
