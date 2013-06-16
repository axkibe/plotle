/*
| A text range.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Range =
	null;


/*
| Imports
*/
var Jools;
var shell;
var system;
var Visual;


/*
| Capsule
*/
(function( ) {
'use strict';

if( typeof( window ) === 'undefined' )
{
	throw new Error( 'this code requires a browser!' );
}


/*
| Constructor.
*/
Range =
	function(
		sign1,
		sign2
	)
{
	this.sign1 =
		sign1;

	this.sign2 =
		sign2;

	this.$begin =
	this.$end =
		null;

	Jools.immute( this );
};


/*
| Sets begin/end so begin is before end.
*/
Range.prototype.normalize =
	function(
		space
	)
{
	var
		s1 =
			this.sign1,

		s2 =
			this.sign2;

	if( s1.path.get(-1) !== 'text' )
	{
		throw new Error( 's1.path.get(-1) !== "text"' );
	}

	if( s2.path.get( -1 ) !== 'text' )
	{
		throw new Error( 's2.path.get(-1) !== "text"' );
	}

	if( s1.path.equals( s2.path ) )
	{
		if( s1.at1 <= s2.at1 )
		{
			this.$begin =
				this.sign1;

			this.$end =
				this.sign2;
		}
		else
		{
			this.$begin =
				this.sign2;

			this.$end =
				this.sign1;
		}
		return;
	}

	var
		k1 =
			s1.path.get( -2 ),

		k2 =
			s2.path.get( -2 );

	if( k1 === k2 )
	{
		throw new Error( 'k1 === k2' );
	}

	var pivot =
		space.getSub( s1.path, 'Doc' );

	if(
		pivot !== space.getSub( s2.path, 'Doc' )
	)
	{
		throw new Error( 'pivot(s1) !== pivot(s2)' );
	}

	var
		r1 =
			pivot.twig.rankOf( k1 ),

		r2 =
			pivot.twig.rankOf( k2 );

	if( r1 < r2 )
	{
		this.$begin =
			s1;

		this.$end =
			s2;
	}
	else
	{
		this.$begin =
			s2;

		this.$end =
			s1;
	}
};


/*
| The text the selection selects.
*/
Range.prototype.innerText =
	function(
		space
	)
{
	if( !this.active )
	{
		return '';
	}

	this.normalize( space );

	var s1 =
		this.$begin;

	var s2 =
		this.$end;

	if( s1.path.equals( s2.path ) )
	{
		var text =
			space.getSub(
				s1.path,
				'Para'
			).twig.text;

		return text.substring(
			s1.at1,
			s2.at1
		);
	}

	var pivot =
		space.getSub(s1.path, 'Doc');

	var twig =
		pivot.twig;

	var key1 =
		s1.path.get( -2 );

	var key2 =
		s2.path.get(-2);

	var text1 =
		twig.copse[ key1 ].text;

	var text2 =
		twig.copse[ key2 ].text;

	var buf = [
		text1.substring(
			s1.at1,
			text1.length
		)
	];

	for(
		var r = twig.rankOf(key1), rZ = twig.rankOf(key2);
		r < rZ - 1;
		r++
	)
	{
		buf.push(
			'\n',
			twig.copse[ twig.ranks[ r ] ].text
		);
	}

	buf.push(
		'\n',
		text2.substring( 0, s2.at1 )
	);

	return buf.join( '' );
};



})( );
