/*
| A text range.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	marks;


/*
| Imports
*/
var
	jion,
	jools;


/*
| Capsule
*/
(function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		name :
			'range',
		unit :
			'marks',
		attributes :
			{
				bPath :
					{
						comment :
							'path of the begin of the range',
						type :
							'jion.path'
					},
				bAt :
					{
						comment :
							'offset of the begin of the range',
						type :
							'Integer'
					},
				doc :
					{
						comment :
							'the document the range belongs to',
						type :
							'visual.doc'
					},
				ePath :
					{
						comment :
							'path of the end of the range',
						type :
							'jion.path'
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
							'Number',
						defaultValue :
							null
					}
			}
	};
}


var
	range;

range = marks.range;


/*
| The begin or end path,
| dependening on which comes first in the doc.
*/
jools.lazyValue(
	range.prototype,
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
| The begin or end offset,
| dependening on which comes first in the doc.
*/
jools.lazyValue(
	range.prototype,
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
| The begin or end path,
| dependening on which comes last in the doc.
*/
jools.lazyValue(
	range.prototype,
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
| The begin or end path,
| dependening on which comes last in the doc.
*/
jools.lazyValue(
	range.prototype,
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
range.prototype.hasCaret = true;


/*
| The caret's path.
|
| This allows a common interface with text range.
*/
jools.lazyValue(
	range.prototype,
	'caretPath',
	function( )
	{
		return this.ePath;
	}
);


/*
| The caret's offset.
|
| This allows a common interface with text range.
*/
jools.lazyValue(
	range.prototype,
	'caretAt',
	function( )
	{
		return this.eAt;
	}
);


/*
| The item's path.
*/
jools.lazyValue(
	range.prototype,
	'itemPath',
	function( )
	{
		if( this.bPath.length < 3 )
		{
			return jion.path.empty;
		}

		return this.bPath.limit( 3 );
	}
);


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
range.prototype.containsPath =
	function(
		path
	)
{

/**/if( CHECK )
/**/{
/**/	if( path.length === 0 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return (
		path.subPathOf( this.bPath )
		||
		path.subPathOf( this.ePath )
	);
};



/*
| The content the mark puts into the clipboard.
*/
jools.lazyValue(
	range.prototype,
	'clipboard',
	function( )
	{
		var
			backAt,
			backKey,
			backText,
			backPath,
			buf,
			doc,
			frontAt,
			frontKey,
			frontText,
			frontPath,
			r, rZ,
			text;

		frontPath = this.frontPath;

		frontAt = this.frontAt;

		backPath = this.backPath;

		backAt = this.backAt;

		doc = this.doc;

		frontKey = frontPath.get( -2 );

		backKey = backPath.get( -2 );

		if( frontPath.equals( backPath ) )
		{
			text = doc.twig[ frontKey ].text;
		
			return text.substring( frontAt, backAt );
		}

		frontText = doc.twig[ frontKey ].text;

		backText = doc.twig[ backKey ].text;

		buf =
			[
				frontText.substring( frontAt, frontText.length )
			];

		for(
			r = doc.rankOf( frontKey ) + 1, rZ = doc.rankOf( backKey );
			r < rZ;
			r++
		)
		{
			buf.push(
				'\n',
				doc.twig[ doc.ranks[ r ] ].text
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
| True if begin equals end
*/
jools.lazyValue(
	range.prototype,
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
range.prototype._normalize =
	function( )
{
	var
		bAt,
		bPath,
		bk,
		br,
		eAt,
		ePath,
		ek,
		er;

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

	bk =
		bPath.get( -2 ),
	ek =
		ePath.get( -2 );

	if( CHECK )
	{
		if( bk === ek )
		{
			throw new Error( 'bk === ek' );
		}
	}

	br =
		this.doc.rankOf( bk );
	er =
		this.doc.rankOf( ek );

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
