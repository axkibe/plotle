/*
| A call in an abstract syntax tree.
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
			'ast_call',
		attributes :
			{
				'func' :
					{
						comment :
							'the function to call',
						type :
							'->astExpression'
					},
			},
		ray :
			'->astExpression'
	};
}

var
	ast_call,
	jools,
	tools;


ast_call = require( '../jion/this' )( module );

jools = require( '../jools/jools' );

tools = require( './tools' );


/*
| Returns a call with a parameter appended
*/
ast_call.prototype.addArgument =
	function(
		expr
	)
{
	return this.append( tools.convert( expr ) );
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
***/	ast_call.prototype.inspect =
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
/**/		result += '( ' +  util.inspect( this.func, opts ) + ' )';
/**/
/**/		if( this.length === 0 )
/**/		{
/**/			result += '( )';
/**/		}
/**/		else
/**/		{
/**/			result += '( ';
/**/
/**/			for(
/**/				r = 0, rZ = this.ray.length;
/**/				r < rZ;
/**/				r++
/**/			)
/**/			{
/**/				arg = this.ray[ r ];
/**/
/**/				if( r > 0 )
/**/				{
/**/					result += ', ';
/**/				}
/**/
/**/				result += util.inspect( arg, opts );
/**/			}
/**/
/**/			result += ' )';
/**/		}
/**/
/**/		return result + postfix;
/**/	};
/**/}

} )( );
