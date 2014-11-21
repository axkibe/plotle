/*
| A string literal.
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
			'ast.astString',
		attributes :
			{
				'string' :
					{
						comment :
							'the literal',
						type :
							'String'
					}
			}
	};
}


var
	astString;

astString = require( '../jion/this' )( module );


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
***/	astString.prototype.inspect =
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
/**/		result += '"' + this.string + '"';
/**/
/**/		return result + postfix;
/**/	};
/**/}

} )( );
