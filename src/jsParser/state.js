/*
| A parser state.
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
			'jsParser_state',
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
				prec : // XXX remove
					{
						comment :
							'current precedence',
						type :
							'Integer',
						defaultValue :
							null
					},
				spec :
					{
						comment :
							'current precedence spec',
						type :
							'jsParser_tokenSpec',
						defaultValue :
							undefined, // XXX required
						assign :
							null // XXX
					}
			},
		init :
			[ 'spec' ] // XXX no spec
	};
}


var
	jools,
	state;

state = require( '../jion/this' )( module );

jools = require( '../jools/jools' );


/*
| Initializer.
*/
state.prototype._init =
	function( spec )
{
	// XXX replace with ahead
	if( spec )
	{
		this.prec = spec.prec( this.ast );
	}
};


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
			( this.pos < this.tokens.length )
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
			( this.pos + 1 < this.tokens.length )
			? this.tokens[ this.pos + 1 ]
			: null
		);
	}
);


} )( );
