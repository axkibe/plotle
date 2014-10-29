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
	token,
	tokenList;


token =
module.exports =
	require( '../jion/this' )( module );


/**/if( CHECK )
/**/{
/**/	tokenList = { };
/**/	tokenList[ '=' ] = true;
/**/	tokenList[ '.' ] = true;
/**/	tokenList[ ',' ] = true;
/**/	tokenList[ '+' ] = true;
/**/	tokenList[ '<' ] = true;
/**/	tokenList[ '>' ] = true;
/**/	tokenList[ '!' ] = true;
/**/	tokenList[ '[' ] = true;
/**/	tokenList[ ']' ] = true;
/**/	tokenList[ '(' ] = true;
/**/	tokenList[ ')' ] = true;
/**/	tokenList[ '++' ] = true;
/**/	tokenList[ '||' ] = true;
/**/	tokenList[ '&&' ] = true;
/**/	tokenList[ '===' ] = true;
/**/	tokenList[ '!==' ] = true;
/**/	tokenList[ 'true' ] = true;
/**/	tokenList[ 'false' ] = true;
/**/	tokenList.number = true;
/**/	tokenList.string = true;
/**/	tokenList.identifier = true;
/**/}



/*
| Initializer.
*/
token.prototype._init =
	function( )
{

/**/if( CHECK )
/**/{
/**/	if( !tokenList[ this.type ] )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

};


} )( );
