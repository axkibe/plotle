/*
| A variable reference to be generated
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
			'ast_var',
		attributes :
			{
				'name' :
					{
						comment :
							'the variable name',
						type :
							'string'
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
	ast_dot,
	ast_member,
	ast_var,
	tools;


ast_var = require( '../jion/this' )( module );

ast_dot = require( './dot' );

ast_member = require( './member' );

tools = require( './tools' );

/*
| Initializer.
*/
ast_var.prototype._init =
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
ast_var.prototype.$dot =
	function(
		member // member string
	)
{
	// checking if member is a string is done in 'ast_dot.create'

	return ast_dot.create( 'expr', this, 'member', member );
};


/*
| Creates a generic member access of a variable.
*/
ast_var.prototype.$member =
	function(
		member // member expression
	)
{
	return(
		ast_member.create(
			'expr', this,
			'member', tools.convert( member )
		)
	);
};


/**/if( CHECK )
/**/{
/**/	var
/**/		util;
/**/
/**/	util = require( 'util' );
/**/
/***	/
****	| Custom inspect
****	/
***/	ast_var.prototype.inspect =
/**/		function(
/**/			depth,
/**/			opts
/**/		)
/**/	{
/**/		var
/**/			postfix,
/**/			result;
/**/
/**/		if( !opts.ast )
/**/		{
/**/			result = 'ast{ ';
/**/
/**/			postfix = ' }';
/**/		}
/**/		else
/**/		{
/**/			result = postfix = '';
/**/		}
/**/
/**/		opts.ast = true;
/**/
/**/		result += this.name;
/**/
/**/		return result + postfix;
/**/	};
/**/}


} )( );
