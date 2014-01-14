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


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {

		name :
			'Range',

		unit :
			'Mark',

		subclass :
			'Mark.Mark',

		attributes :
			{
				bPath :
					{
						comment :
							'path of the begin of the range',

						type :
							'Path'
					},

				bAt :
					{
						comment :
							'offset of the begin of the range',

						type :
							'Integer'
					},

				docTree :
					{
						comment :
							'the document tree the range belongs to',

						type :
							'Tree'
					},

				ePath :
					{
						comment :
							'path of the end of the range',

						type :
							'Path'
					},

				eAt :
					{
						comment :
							'offset of the end of the range',

						type :
							'Integer'
					},

				retainx :
					{
						comment :
							'x-position of the caret kept',

						type :
							'Number'
					}
			}
	};
}


var
	Range =
		Mark.Range;

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
| Return true if begin equals end
*/
Jools.lazyFixate(
	Range.prototype,
	'empty',
	function( )
	{
		return (
			this.bPath.equals( this.ePath )
			&&
			this.bAt === this.eAt
		);
	}
);


/*
| Sets _front/_back so _front is before _back.
|
| FIXME remove
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
