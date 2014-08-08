/*
| A variable reference to be generated
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
			'aVar',
		unit :
			'Code',
		node :
			true,
		attributes :
			{
				'name' :
					{
						comment :
							'the variable name',
						type :
							'String'
					}
			},
		init :
			[ ]
	};
}


/*
| Import
*/
var
	Code,
	aVar;

Code =
	{
		aDot :
			require( '../code/a-dot' ),
		aMember :
			require( '../code/a-member' )
	};

aVar = require( '../jion/this' )( module );


/*
| Initializer.
*/
aVar.prototype._init =
	function( )
{
	var
		regex;

/**/if( CHECK )
/**/{
/**/	regex =
/**/		/^([a-zA-Z_])([a-zA-Z0-9_])*$/;
/**/
/**/	if( !regex.test( this.name ) )
/**/	{
/**/		throw new Error( 'invalid variable name' );
/**/	}
/**/
/**/	switch( this.name )
/**/	{
/**/		case 'true' :
/**/		case 'false' :
/**/
/**/			throw new Error( 'var must not be a literal' );
/**/	}
/**/}
};


/*
| Creates a dot member access of a variable.
*/
aVar.prototype.aDot =
	function(
		member // member string
	)
{
	// checking if member is a string is done in 'aDot'
	return (
		Code.aDot.create(
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
aVar.prototype.aMember =
	function(
		member // member expression
	)
{
	return (
		Code.aMember.create(
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
module.exports = aVar;


} )( );
