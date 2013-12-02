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
	Jools;


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
		docTree,
		bSign,
		eSign,
		retainx
	)
{
	this.docTree =
		docTree;

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
		docTree,
		bSign,
		eSign,
		retainx
	)
{
	return new Range(
		_tag,
		docTree,
		bSign,
		eSign,
		retainx
	);
};


/*
| Returns the signature which comes first in docTree.
*/
Object.defineProperty(
	Range.prototype,
	'front',
	{
		get : function( )
		{
			if( !this._front )
			{
				this._normalize( );
			}
				
			return this._front;
		}
	}
);


/*
| Returns the signature which comes last in docTree.
*/
Object.defineProperty(
	Range.prototype,
	'back',
	{
		get : function( )
		{
			if( !this._back )
			{
				this._normalize( );
			}
				
			return this._back;
		}
	}
);


/*
| The text the selection selects.
|
| TODO lazy fixate this
*/
Range.prototype.innerText =
	function( )
{
	var
		s1 =
			this.front,

		s2 =
			this.back,

		tree =
			this.docTree,

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


/*
| Sets _front/_back so _front is before _back.
*/
Range.prototype._normalize =
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
			this._front =
				this.bSign;

			this._back =
				this.eSign;
		}
		else
		{
			this._front =
				this.eSign;

			this._back =
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
			this.docTree.rankOf( k1 ),

		r2 =
			this.docTree.rankOf( k2 );

	if( r1 < r2 )
	{
		this._front =
			s1;

		this._back =
			s2;
	}
	else
	{
		this._front =
			s2;

		this._back =
			s1;
	}
};



})( );
