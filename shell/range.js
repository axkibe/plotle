/*
| A text range.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Range =
		null;


/*
| Imports
*/
var
	Jools,
	shell,
	system,
	Visual;


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
		doc,
		sign1,
		sign2
	)
{
	this.doc =
		doc;

	if( CHECK && sign1.path.get(-1) !== 'text' )
	{
		throw new Error( 's1.path.get(-1) !== "text"' );
	}

	if( CHECK && sign2.path.get( -1 ) !== 'text' )
	{
		throw new Error( 's2.path.get(-1) !== "text"' );
	}

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
	function( )
{
	var
		s1 =
			this.sign1,

		s2 =
			this.sign2;

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

	var
		r1 =
			this.doc.tree.rankOf( k1 ),

		r2 =
			this.doc.tree.rankOf( k2 );

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

	var
		s1 =
			this.$begin,

		s2 =
			this.$end;

	if( s1.path.equals( s2.path ) )
	{
		var text =
			space.getSub(
				s1.path,
				'Para'
			).tree.text;

		return text.substring(
			s1.at1,
			s2.at1
		);
	}

	var
		tree =
			this.doc.tree,

		key1 =
			s1.path.get( -2 ),

		key2 =
			s2.path.get(-2);

		text1 =
			tree.twig[ key1 ].text;

		text2 =
			tree.twig[ key2 ].text;

		buf = [
			text1.substring(
				s1.at1,
				text1.length
			)
		];

	for(
		var r = tree.rankOf(key1), rZ = tree.rankOf(key2);
		r < rZ - 1;
		r++
	)
	{
		buf.push(
			'\n',
			tree.twig[ tree.ranks[ r ] ].text
		);
	}

	buf.push(
		'\n',
		text2.substring( 0, s2.at1 )
	);

	return buf.join( '' );
};


/*
| Return true if sign1 equals sign2
| TODO lazy fixate
*/
Range.prototype.empty =
	function( )
{
	return (
		this.sign1.path.equals( this.sign2.path ) &&
		this.sign1.at1 === this.sign2.at1
	);
}

})( );
