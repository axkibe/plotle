/*
| A text range.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Mark;


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

if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code requires a browser!'
	);
}


var
	_tag =
		'X4052376';

/*
| Constructor.
*/
var
Range =
Mark.Range =
	function(
		tag,
		doc,
		bSign,
		eSign,
		retainx
	)
{
	this.doc =
		doc;

	if( CHECK )
	{
		if( bSign.path.get( -1 ) !== 'text' )
		{
			throw new Error(
				'bSign.path.get( -1 ) !== "text"'
			);
		}

		if( eSign.path.get( -1 ) !== 'text' )
		{
			throw new Error(
				'eSign.path.get( -1 ) !== "text"'
			);
		}
	}

	this.bSign =
		bSign;

	this.eSign =
		eSign;

	this.retainx =
		retainx;

	this.$begin =
	this.$end =
		null;

	Mark.call( this );
};


Jools.subclass(
	Range,
	Mark
);


/*
| Creates a mark
*/
Range.create =
	function(
		doc,
		bSign,
		eSign,
		retainx
	)
{
	return new Range(
		_tag,
		doc,
		bSign,
		eSign,
		retainx
	);
};


/*
| Sets begin/end so begin is before end.
*/
Range.prototype.normalize =
	function( )
{
	var
		s1 =
			this.bSign,

		s2 =
			this.eSign;

	if( s1.path.equals( s2.path ) )
	{
		if( s1.at1 <= s2.at1 )
		{
			this.$begin =
				this.bSign;

			this.$end =
				this.eSign;
		}
		else
		{
			this.$begin =
				this.eSign;

			this.$end =
				this.bSign;
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
	function( )
{
	this.normalize( );

	var
		s1 =
			this.$begin,

		s2 =
			this.$end,

		tree =
			this.doc.tree,

		key1 =
			s1.path.get( -2 ),

		key2 =
			s2.path.get(-2);


	if( s1.path.equals( s2.path ) )
	{
		var
			text =
				tree.twig[ key1 ].twig.text;

		return text.substring(
			s1.at1,
			s2.at1
		);
	}

	var
		text1 =
			tree.twig[ key1 ].twig.text,

		text2 =
			tree.twig[ key2 ].twig.text,

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
			tree.twig[ tree.ranks[ r ] ].twig.text
		);
	}

	buf.push(
		'\n',
		text2.substring( 0, s2.at1 )
	);

	return buf.join( '' );
};


/*
| Reflection.
*/
Range.prototype.type =
	'range';


/*
| Returns this if an entity of that path should
| be concerned about this mark.
*/
Range.prototype.concerns =
	function(
		path
	)
{
	if(
		path
		&&
		path.subPathOf( this.bSign.path ) )
	{
		return this;
	}
	else
	{
		return null;
	}
};


/*
| Returns true if this mark equals another.
*/
Range.prototype.equals =
	function(
		mark
	)
{
	if( !mark )
	{
		return false;
	}

	return (
		this === mark
		||
		(
			this.type === mark.type
			&&
			this.bSign.path.equals( mark.bSign.path )
			&&
			this.bSign.at1 === mark.bSign.at1
			&&
			this.eSign.path.equals( mark.bSign.path )
			&&
			this.eSign.at1 === mark.eSign.at1
			&&
			this.retainx === mark.retainx
		)
	);
};


/*
| Return true if bSign equals eSign
*/
Jools.lazyFixate(
	Range.prototype,
	'empty',
	function( )
	{
		return (
			this.bSign.path.equals( this.eSign.path ) &&
			this.bSign.at1 === this.eSign.at1
		);
	}
);


})( );
