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
		id :
			'ast.astVar',
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
	astDot,
	astMember,
	astVar,
	tools;


astVar =
module.exports =
	require( '../jion/this' )( module );

astDot = require( './ast-dot' );

astMember = require( './ast-member' );

tools = require( './tools' );

/*
| Initializer.
*/
astVar.prototype._init =
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
astVar.prototype.astDot =
	function(
		member // member string
	)
{
	// checking if member is a string is done in 'astDot'
	return(
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
astVar.prototype.astMember =
	function(
		member // member expression
	)
{
	return(
		astMember.create(
			'expr',
				this,
			'member',
				tools.convertArg( member )
		)
	);
};


} )( );
