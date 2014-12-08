/*
| Tests if a < b.
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
			'ast_astLessThan',
		attributes :
			{
				left :
					{
						comment :
							'left expression',
						type :
							'Object'
					},
				right :
					{
						comment :
							'right expression',
						type :
							'Object'
					}
			}
	};
}


var
	ast_lessThan;

ast_lessThan = require( '../jion/this' )( module );


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
***/	ast_lessThan.prototype.inspect =
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
/**/		result += '( ' +  util.inspect( this.left, opts ) + ' )';
/**/
/**/		result += ' < ';
/**/
/**/		result += '( ' +  util.inspect( this.right, opts ) + ' )';
/**/
/**/		return result + postfix;
/**/	};
/**/}



} )( );
