/*
| Variable declarations in abstract syntax trees.
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
			'ast_varDec',
		attributes :
			{
				name :
					{
						comment :
							'variable name',
						type :
							'string'
					},
				assign :
					{
						comment :
							'Assignment of variable',
						type :
							'->astExpression',
						defaultValue :
							'null'
					}
			}
	};
}


var
	ast_varDec;

ast_varDec = require( '../jion/this' )( module );


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
***/	ast_varDec.prototype.inspect =
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
/**/		result += 'var ';
/**/
/**/		result += this.name;
/**/
/**/		if( this.assign )
/**/		{
/**/			result += util.inspect( this.assign, opts );
/**/		}
/**/
/**/		return result + postfix;
/**/	};
/**/}

} )( );
