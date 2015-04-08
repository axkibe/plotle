/*
| Ast object literal.
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
			'ast_objLiteral',
		twig :
			'->astStatement'  // FIXME astExpression?
	};
}


var
	ast_objLiteral,
	tools;


ast_objLiteral = require( 'jion' ).this( module );


tools = require( './tools' );

/*
| Returns an object literal with a key-expr pair added.
*/
ast_objLiteral.prototype.add =
	function(
		key,
		expr
	)
{
	return(
		this.create(
			'twig:add',
			key,
			tools.convert( expr )
		)
	);
};


/**/if( CHECK )
/**/{
/**/	var
/**/		arg,
/**/		r, rZ,
/**/		util;
/**/
/**/	util = require( 'util' );
/**/
/***	/
****	| Custom inspect
****	/
***/	ast_objLiteral.prototype.inspect =
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
/**/		if( this.length === 0 )
/**/		{
/**/			result += '{ }';
/**/		}
/**/		else
/**/		{
/**/			result += '{ ';
/**/
/**/			for(
/**/				r = 0, rZ = this.length;
/**/				r < rZ;
/**/				r++
/**/			)
/**/			{
/**/				arg = this.atRank( r );
/**/
/**/				if( r > 0 )
/**/				{
/**/					result += ', ';
/**/				}
/**/
/**/				result += util.inspect( arg, opts );
/**/			}
/**/
/**/			result += ' }';
/**/		}
/**/
/**/		return result + postfix;
/**/	};
/**/}

} )( );
