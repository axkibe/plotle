/*
| A mathematical addition
| or a string concation.
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
			'ast.astPlus',
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
			},
		node :
			true
	};
}


var
	astPlus;

astPlus =
module.exports =
	require( '../jion/this' )( module );


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
***/	astPlus.prototype.inspect =
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
/**/		result += ' + ';
/**/
/**/		result += '( ' +  util.inspect( this.right, opts ) + ' )';
/**/
/**/		return result + postfix;
/**/	};
/**/}


} )( );
