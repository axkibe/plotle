/*
| A parser state.
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
			'jsParser.tokenSpec',
		attributes :
			{
				prePrec :
					{
						comment :
							'operator precedence in prefix conditions',
						type :
							'Integer'
					},
				postPrec :
					{
						comment :
							'operator precedence in postfix conditions',
						type :
							'Integer'
					},
				handler :
					{
						comment :
							'Handler function to be called',
						type :
							'Object',
					},
				astCreator :
					{
						comment :
							'For some handlers, the ast creator function for it to call',
						type :
							'Object',
						defaultValue :
							undefined
					}
			},
		node :
			true
	};
}


var
	tokenSpec;

tokenSpec =
module.exports =
	require( '../jion/this' )( module );


/*
| Returns the precedence of the 
| token in given ast context
*/
tokenSpec.prototype.precedence =
	function(
		ast
	)
{
	if( ast )
	{
		return this.postPrec;
	}
	else
	{
		return this.prePrec;
	}
};


} )( );
