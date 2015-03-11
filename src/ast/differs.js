/*
| AST: test for difference.
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
			'ast_differs',
		attributes :
			{
				left :
					{
						comment :
							'left expression',
						type :
							'->astExpression'
					},
				right :
					{
						comment :
							'right expression',
						type :
							'->astExpression'
					}
			}
	};
}


var
	ast_differs,
	prototype;

ast_differs = require( '../jion/this' )( module );

prototype = ast_differs.prototype;


/*
| Walks the ast tree depth-first, pre-order
| creating a transformed copy.
*/
prototype.walk =
	function(
		transform	// a function to be called for all
		//			// walked nodes.
	)
{
	var
		left,
		right;

	left = this.left.walk( transform );

	right = this.right.walk( transform );

	return transform( this.create( 'left', left, 'right', right ) );
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
***/	prototype.inspect =
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
/**/		result += ' !== ';
/**/
/**/		result += '( ' +  util.inspect( this.right, opts ) + ' )';
/**/
/**/		return result + postfix;
/**/	};
/**/}


} )( );
