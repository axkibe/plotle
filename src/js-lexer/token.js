/*
| A lexer token.
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
			'jsLexer.token',
		attributes :
			{
				type :
					{
						comment :
							'the token type',
						type :
							'String'
					},
				value :
					{
						comment :
							'the token value',
						type :
							'Object',
						defaultValue :
							undefined
					}
			},
		node :
			true,
		init :
			[ ]
	};
}


var
	token;


token =
module.exports =
	require( '../jion/this' )( module );


/*
| Initializer.
*/
token.prototype._init =
	function( )
{

/**/if( CHECK )
/**/{
/**/	switch( this.type )
/**/	{
/**/		case '.' :
/**/		case '+' :
/**/		case '<' :
/**/		case '>' :
/**/		case '!' :
/**/		case '++' :
/**/		case '||' :
/**/		case '&&' :
/**/		case '[' :
/**/		case ']' :
/**/		case 'number' :
/**/		case 'string' :
/**/		case 'identifier' :
/**/
/**/			break;
/**/
/**/		default :
/**/
/**/			throw new Error( );
/**/	}
/**/}

};


} )( );
