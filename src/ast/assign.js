/*
| An assignment in an abstract syntax tree.
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
	return{
		id :
			'ast_assign',
		attributes :
			{
				left :
					{
						comment :
							'left-hand side',
						type :
							'->astExpression'
					},
				right :
					{
						comment :
							'right-hand side',
						type :
							'->astExpression'
					}
			}
	};
}


var
	ast_assign;


ast_assign = require( '../jion/this' )( module );


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
***/	ast_assign.prototype.inspect =
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
/**/		result += ' = ';
/**/
/**/		result += '( ' +  util.inspect( this.right, opts ) + ' )';
/**/
/**/		return result + postfix;
/**/	};
/**/}

} )( );
