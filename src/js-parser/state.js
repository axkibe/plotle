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
				pos :
					{
						comment :
							'current position in token ray',
						type :
							'Integer'
					},
				prec :
					{
						comment :
							'current precedence',
						type :
							'Integer',
						defaultValue :
							null
					}
			},
		node :
			true
	};
}


var
	jools,
	state;

state =
module.exports =
	require( '../jion/this' )( module );

jools = require( '../jools/jools' );


/*
| True if pos is at end of the token ray.
*/
jools.lazyValue(
	state.prototype,
	'reachedEnd',
	function( )
	{
		return this.pos >= this.tokens.length;
	}
);


/*
| The current token.
*/
jools.lazyValue(
	state.prototype,
	'current',
	function( )
	{
		return(
			this.pos < this.tokens.length
			?  this.tokens[ this.pos ]
			: null
		);
	}
);


/*
| The preview token.
*/
jools.lazyValue(
	state.prototype,
	'preview',
	function( )
	{
		return(
			this.pos + 1 < this.tokens.length
			? this.tokens[ this.pos + 1 ]
			: null
		);
	}
);


} )( );
