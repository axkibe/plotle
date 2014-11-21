/*
| Pre increments for abstract syntax trees.
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
			'ast.astPreIncrement',
		attributes :
			{
				expr :
					{
						comment :
							'the expression to pre increment',
						type :
							'Object'
					}
			}
	};
}


var
	astPreIncrement;


astPreIncrement = require( '../jion/this' )( module );


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
***/	astPreIncrement.prototype.inspect =
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
/**/		result += '++( ' +  util.inspect( this.expr, opts ) + ' )';
/**/
/**/		return result + postfix;
/**/	};
/**/}

} )( );
