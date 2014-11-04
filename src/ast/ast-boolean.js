/*
| A boolean literal.
| ( true or false )
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
			'ast.astBoolean',
		node :
			true,
		attributes :
			{
				'boolean' :
					{
						comment :
							'the boolean',
						type :
							'Boolean'
					}
			}
	};
}


var
	astBoolean;

astBoolean = require( '../jion/this' )( module );


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
***/	astBoolean.prototype.inspect =
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
/**/		result += this.boolean ? 'true' : 'false';
/**/
/**/		return result + postfix;
/**/	};
/**/}

} )( );
