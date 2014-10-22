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
			'jsParser.state',
		attributes :
			{
				ast :
					{
						comment :
							'current ast entity',
						type :
							'Object',
						allowsNull :
							true
					},
				tokens :
					{
						comment :
							'ray of tokens to parse',
						type :
							'Object' // FUTURE jsLexer.tokenRay
					},
				tpos :
					{
						comment :
							'current position in token ray',
						type :
							'Integer'
					}
			},
		node :
			true
	};
}


module.exports =
	require( '../jion/this' )( module );


} )( );
