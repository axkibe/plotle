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
	Path;


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
		bPath,
		bAt,
		ePath,
		eAt,
		retainx
	)
{
	this.docTree =
		docTree;

	if( CHECK )
	{
		if( bPath.get( -1 ) !== 'text' )
		{
			throw new Error(
				'bPath.get( -1 ) !== "text"'
			);
		}

		if( ePath.get( -1 ) !== 'text' )
		{
			throw new Error(
				'ePath.get( -1 ) !== "text"'
			);
		}
	}

	this.bPath =
		bPath;

	// FIXME remove this again when fixed affection below
	this._bDocPath =
		bPath.shorten( 2 );

	this.bAt =
		bAt;

	this.ePath =
		ePath;

	this.eAt =
		eAt;

	this.retainx =
		retainx;

	Mark.Mark.call( this );
};


Jools.subclass(
	Range,
	Mark.Mark
);


/*
| Creates a mark
*/
Range.create =
	function(
		docTree,
		bPath,
		bAt,
		ePath,
		eAt,
		retainx
	)
{
	return new Range(
		_tag,
		docTree,
		bPath,
		bAt,
		ePath,
		eAt,
		retainx
	);
};



/*
| Returns begin or end path,
| dependening on which comes first in docTree.
*/
Jools.lazyFixate(
	Range.prototype,
	'frontPath',
	function( )
	{
		if( !this._frontPath )
		{
			this._normalize( );
		}

		return this._frontPath;
	}
);


/*
| Returns begin or end offset,
| dependening on which comes first in docTree.
*/
Jools.lazyFixate(
	Range.prototype,
	'frontAt',
	function( )
	{
		if( !this._frontPath )
		{
			this._normalize( );
		}

		return this._frontAt;
	}
);


/*
| Returns begin or end path,
| dependening on which comes last in docTree.
*/
Jools.lazyFixate(
	Range.prototype,
	'backPath',
	function( )
	{
		if( !this._backPath )
		{
			this._normalize( );
		}

		return this._backPath;
	}
);


/*
| Returns begin or end path,
| dependening on which comes last in docTree.
*/
Jools.lazyFixate(
	Range.prototype,
	'backAt',
	function( )
	{
		if( !this._backPath )
		{
			this._normalize( );
		}

		return this._backAt;
	}
);


/*
| Ranges also have caret capabilities.
|
| The caretPath and caretAt are identical to
| ePath and eAt
*/
Range.prototype.hasCaret =
	true;


/*
| Returns the caret path.
|
| This allows a common interface with text range.
*/
Jools.lazyFixate(
	Range.prototype,
	'caretPath',
	function( )
	{
		return this.ePath;
	}
);


/*
| Returns the caret offset.
|
| This allows a common interface with text range.
*/
Jools.lazyFixate(
	Range.prototype,
	'caretAt',
	function( )
	{
		return this.eAt;
	}
);


/*
| Returns the items path.
*/
Jools.lazyFixate(
	Range.prototype,
	'itemPath',
	function( )
	{
		if( this.bPath.length < 2 )
		{
			return Path.empty;
		}

		return this.bPath.limit( 2 );
	}
);


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
Range.prototype.containsPath =
	function(
		path
	)
{

/**/if( CHECK )
/**/{
/**/	if( path.length === 0 )
/**/	{
/**/		throw new Error(
/**/			'invalid empty path'
/**/		);
/**/	}
/**/}

	return (
		path.subPathOf( this.bPath )
		||
		path.subPathOf( this.ePath )
	);
};



/*
| The text the selection selects.
*/
Jools.lazyFixate(
	Range.prototype,
	'innerText',
	function( )
	{
		var
			frontPath =
				this.frontPath,

			frontAt =
				this.frontAt,

			backPath =
				this.backPath,

			backAt =
				this.backAt,

			tree =
				this.docTree,

			frontKey =
				frontPath.get( -2 ),

			backKey =
				backPath.get( -2 );


		if( frontPath.equals( backPath ) )
		{
			var
				text =
					tree.twig[ frontKey ].twig.text;

			return text.substring(
				frontAt,
				backAt
			);
		}

		var
			frontText =
				tree.twig[ frontKey ].twig.text,

			backText =
				tree.twig[ backKey ].twig.text,

			buf = [
				frontText.substring(
					frontAt,
					frontText.length
				)
			];

		for(
			var r = tree.rankOf( frontKey ), rZ = tree.rankOf( backKey );
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
			backText.substring( 0, backAt )
		);

		return buf.join( '' );
	}
);


/*
| Reflection.
*/
Range.prototype.reflect =
	'Range';


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
			this.reflect === mark.reflect
			&&
			this.bPath.equals( mark.bPath )
			&&
			this.bAt === mark.bAt
			&&
			this.ePath.equals( mark.ePath )
			&&
			this.eAt === mark.eAt
			&&
			this.retainx === mark.retainx
		)
	);
};


/*
| Return true if begin equals end
*/
Jools.lazyFixate(
	Range.prototype,
	'empty',
	function( )
	{
		return (
			this.bPath.equals( this.ePath ) &&
			this.bAt === this.eAt
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
		bPath =
			this.bPath,

		bAt =
			this.bAt,

		ePath =
			this.ePath,

		eAt =
			this.eAt;


	if( bPath.equals( ePath ) )
	{
		if( bAt <= eAt )
		{
			this._frontPath =
				bPath;

			this._frontAt =
				bAt;

			this._backPath =
				ePath;

			this._backAt =
				eAt;
		}
		else
		{
			this._frontPath =
				ePath;

			this._frontAt =
				eAt;

			this._backPath =
				bPath;

			this._backAt =
				bAt;
		}

		return;
	}

	var
		bk =
			bPath.get( -2 ),

		ek =
			ePath.get( -2 );

	if( CHECK )
	{
		if( bk === ek )
		{
			throw new Error(
				'bk === ek'
			);
		}
	}

	var
		br =
			this.docTree.rankOf( bk ),

		er =
			this.docTree.rankOf( ek );

	if( br < er )
	{
		this._frontPath =
			bPath;

		this._frontAt =
			bAt;

		this._backPath =
			ePath;

		this._backAt =
			eAt;
	}
	else
	{
		this._frontPath =
			ePath;

		this._frontAt =
			eAt;

		this._backPath =
			bPath;

		this._backAt =
			bAt;
	}
};



})( );
