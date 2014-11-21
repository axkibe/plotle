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
			'ast.astCall',
		attributes :
			{
				'func' :
					{
						comment :
							'the function to call',
						type :
							'Object' // Expression
					},
			},
		twig :
			'->expression',
	};
}

var
	astCall,
	jools,
	tools;


astCall = require( '../jion/this' )( module );

jools = require( '../jools/jools' );

tools = require( './tools' );


/*
| Returns a call with a parameter appended
*/
astCall.prototype.addArgument =
	function(
		expr
	)
{
	return (
		this.create(
			'twig:add',
			jools.uid( ), // FIXME
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
***/	astCall.prototype.inspect =
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
/**/				r = 0, rZ = this.ranks.length;
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
/**/			result += ' )';
/**/		}
/**/
/**/		return result + postfix;
/**/	};
/**/}

} )( );
