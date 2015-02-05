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
						defaultValue :
							'"n/a"'
					},
				prec :
					{
						comment :
							'operator precedence',
						type :
							'integer'
					},
				handler :
					{
						comment :
							'Handler function to be called',
						type :
							'Object', // FUTURE
					},
				astCreator :
					{
						comment :
							'For some handlers, the ast creator function'
							+ ' for it to call',
						type :
							'Object',
						defaultValue :
							'undefined'
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


} )( );
