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
			'Var',
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
	Var;

Code =
	{
		Dot :
			require( '../code/dot' ),
		Member :
			require( '../code/member' )
	};

Var = require( '../jion/this' )( module );


/*
| Initializer.
*/
Var.prototype._init =
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
Var.prototype.Dot =
	function(
		member // member string
	)
{
	// checking if member is a string is done in 'Dot'
	return (
		Code.Dot.Create(
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
Var.prototype.Member =
	function(
		member // member expression
	)
{
	return (
		Code.Member.Create(
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
	Var;


} )( );
