/*
| Various tools for abstract syntax use
|
| Authors: Axel Kittenberger
*/


var
	tools;

tools =
module.exports =
	{ };


/*
| Capsule
*/
(function() {
'use strict';


var
	astNumber,
	astNull,
	astVar,
	jools,
	shorthand;


astNull = require( './ast-null' );

astNumber = require( './ast-number' );

astVar = require( './ast-var' );

jools = require( '../jools/jools' );

shorthand = require( './shorthand' );



/*
| Tokenizes a javascript string.
|
| Returns an array of tokens.
*/
tools.tokenize =
	function( code )
{
	var
		c,
		ch,
		cZ,
		token,
		tokens;

	if( !jools.isString( code ) )
	{
		throw new Error( 'cannot tokenize non-strings' );
	}

	tokens = [ ];

	for(
		c = 0, cZ = code.length;
		c < cZ;
		c++
	)
	{
		ch = code[ c ];

		if( ch.match( /\s/ ) )
		{
			// skips whitespaces
			continue;
		}

		if( ch.match(/[a-zA-Z_]/ ) )
		{
			token = ch;

			// a name specifier
			while( c + 1 < cZ && code[ c+ 1 ].match( /[a-zA-Z0-9_]/ ) )
			{
				token += code[ ++c ];
			}

			tokens.push( token );

			continue;
		}

		if( ch === '.' )
		{
			tokens.push( ch );

			continue;
		}

		throw new Error( 'parse error with: "' + code + '"' );
	}

	return tokens;
};


/*
| Parses a code to create an ast of it
*/
tools.parse =
	function( code )
{
	var
		tokens;

	if( !jools.isString( code ) )
	{
		throw new Error( 'cannot parse non-strings' );
	}

	tokens = tools.tokenize( code );

	if( tokens.length !== 1 )
	{
		throw new Error( );
	}

	return astVar.create( 'name', tokens[ 0 ] );
};


/*
| Converts an argument to ast usage.
|
| simple strings -> astVar
| simple numbers -> astNumber
*/
tools.convertArg =
	function( arg )
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( arg === null )
	{
		return astNull.create( );
	}

	if( arg === undefined )
	{
		return astVar.create( 'name', 'undefined' );
	}

	if( arg === true )
	{
		return shorthand.astTrue;
	}

	if( arg === false )
	{
		return shorthand.astFalse;
	}

	if( arg === undefined )
	{
		return shorthand.astUndefined;
	}

	if( jools.isString( arg ) )
	{
		return tools.parse( arg );
	}

	if( typeof( arg ) === 'number' )
	{
		return astNumber.create( 'number', arg );
	}

/**/if( CHECK )
/**/{
/**/	if( arg.reflect.substr( 0, 4 ) !== 'ast.' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return arg;
};


} )( );
