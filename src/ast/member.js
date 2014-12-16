/*
| ast [ ] operator.
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
			'ast_member',
		attributes :
			{
				expr :
					{
						comment :
							'the expression to get the member of',
						type :
							'Object'
					},
				member :
					{
						comment :
							'the members expression',
						type :
							'Object'
					}
			}
	};
}


var
	ast_dot,
	ast_member;


ast_member = require( '../jion/this' )( module );


ast_dot = require( './dot' );


/*
| Creates a dot member access of a dot.
*/
ast_member.prototype.$dot =
	function(
		member // member string
	)
{
	// checks if member is a string is done in 'ast_dot.create'
	return ast_dot.create( 'expr', this, 'member', member );
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
***/	ast_member.prototype.inspect =
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
/**/		result += '( ' + util.inspect( this.expr, opts ) + ' )';
/**/
/**/		result += '[ ' + util.inspect( this.member, opts ) + ' ]';
/**/
/**/		return result + postfix;
/**/	};
/**/}


} )( );
