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
			'jsParser_tokenSpec',
		attributes :
			{
				associativity :
					{
						comment :
							'"r2l", "l2r" or "n/a"',
							// right to left
							// left to right
							// not applicable
						type :
							'String',
					},
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
							'For some handlers, the ast creator function'
							+ ' for it to call',
						type :
							'Object',
						defaultValue :
							undefined
					}
			},
		init :
			[ ]
	};
}


var
	tokenSpec;

tokenSpec = require( '../jion/this' )( module );


/*
| Initializer.
*/
tokenSpec.prototype._init =
	function( )
{

/**/if( CHECK )
/**/{
/**/	if(
/**/		this.associativity !== 'l2r'
/**/		&&  this.associativity !== 'r2l'
/**/		&&  this.associativity !== 'n/a'
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

};


/*
| Returns the precedence of the
| token in given ast context
*/
tokenSpec.prototype.prec =
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
