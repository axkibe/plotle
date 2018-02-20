/*
---
name: String.SHA-1
description: String SHA1 hashing.
license: MIT-style
authors: [Christopher Pitt, Enrique Erne]
...
[Axel Kittenberger]
* imported from:
> https://github.com/sixtyseconds/mootools-string-cryptography/blob/master/Source/String.SHA-1.js
> https://github.com/sixtyseconds/mootools-string-cryptography/blob/master/Source/String.UTF-8.js
* made browser/node shared friendly
* changed it to not alter String.prototype
* cleaned from jshint warnings
* restructured code
* changed to tim.js structure
* changed to ES6
* integrated into tim.js structure
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
'use strict';


tim.define( module, ( def ) => {


const toUTF8 =
	function(
		str
	)
{
	let result = '';

	const code = String.fromCharCode;

	str = str.replace( /\r\n/g, '\n' );

	for( let a = 0, b; ( b = str.charCodeAt( a ) ); a++ )
	{
		if( b < 128 )
		{
			result += code( b );
		}
		else if( ( b > 127 ) && ( b < 2048 ) )
		{
			result +=
				code( ( b >> 6 ) | 192 )
				+ code( ( b & 63 ) | 128 );
		}
		else
		{
			result +=
				code( ( b >> 12 ) | 224 )
				+ code( ( ( b >> 6 ) & 63 ) | 128 )
				+ code( ( b & 63 ) | 128 );
		}
	}

	return result;
};


const rotateLeft =
	function( a, b )
{
	return ( a << b ) | ( a >>> ( 32 - b ) );
};


const tohex =
	function( a )
{
	let r = '';

	for( let b = 7; b >= 0; b-- )
	{
		r += ( (a >>> (b * 4) ) & 0x0f ).toString( 16 );
	}

	return r;
};


def.static.calc =
	function( str )
{
	let h1 = 0x67452301;

	let h2 = 0xEFCDAB89;

	let h3 = 0x98BADCFE;

	let h4 = 0x10325476;

	let h5 = 0xC3D2E1F0;

	let t1, t2, t3, t4, t5;

	str = toUTF8(str);

	const len = str.length;

	const words = [ ];

	const buffer = new Array( 80 );

	const code = function( a ) { return str.charCodeAt( a ); };

	const assign =
		function( c )
	{
		const b5 = t5;

		t5 = t4;

		t4 = t3;

		t3 = rotateLeft(t2, 30);

		t2 = t1;

		t1 = ( rotateLeft( t1, 5 ) + b5 + buffer[ a ] + c ) & 0x0ffffffff;
	};

	let a;

	for( a = 0; a < len - 3; a += 4 )
	{
		words.push(
			code( a ) << 24
			| code( a + 1 ) << 16
			| code( a + 2 ) << 8
			| code( a + 3 )
		);
	}

	switch( len % 4 )
	{
		case 0: a = 0x080000000; break;

		case 1: a = code( len - 1 ) << 24 | 0x0800000; break;

		case 2: a = code( len - 2 ) << 24 | code( len - 1 ) << 16 | 0x08000; break;

		case 3: a = code( len - 3 ) << 24 | code( len - 2 ) << 16 | code( len - 1 ) << 8 | 0x80; break;
	}

	words.push( a );

	while( ( words.length % 16 ) != 14 )
	{
		words.push( 0 );
	}

	words.push( len >>> 29 );

	words.push( ( len << 3 ) & 0x0ffffffff );

	for( let b = 0; b < words.length; b += 16 )
	{
		for( a = 0; a < 16; a++ )
		{
			buffer[ a ] = words[ b + a ];
		}

		for( a = 16; a <= 79; a++ )
		{
			buffer[ a ] =
				rotateLeft(
					buffer[ a - 3 ]
					^ buffer[ a - 8 ]
					^ buffer[ a - 14 ]
					^ buffer[ a - 16 ]
					,
					1
				);
		}

		t1 = h1; t2 = h2; t3 = h3; t4 = h4; t5 = h5;

		a = 0;

		for(; a < 20; a++ )
		{
			assign( ( ( t2 & t3 ) | ( ~t2 & t4 ) ) + 0x5A827999 );
		}

		for(; a < 40; a++ )
		{
			assign( ( t2 ^ t3 ^ t4 ) + 0x6ED9EBA1 );
		}

		for(; a < 60; a++ )
		{
			assign( ( ( t2 & t3 ) | ( t2 & t4 ) | ( t3 & t4 ) ) + 0x8F1BBCDC );
		}

		for(; a < 80; a++ )
		{
			assign( ( t2 ^ t3 ^ t4 ) + 0xCA62C1D6 );
		}

		h1 = ( h1 + t1 ) & 0x0ffffffff;

		h2 = ( h2 + t2 ) & 0x0ffffffff;

		h3 = ( h3 + t3 ) & 0x0ffffffff;

		h4 = ( h4 + t4 ) & 0x0ffffffff;

		h5 = ( h5 + t5 ) & 0x0ffffffff;
	}

	return( tohex( h1 ) + tohex( h2 ) + tohex( h3 ) + tohex( h4 ) + tohex( h5 ) ).toLowerCase( );
};


} );

