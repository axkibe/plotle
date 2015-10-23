/*
| A text range.
*/


var
	jion,
	visual_mark_range;


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
	return{
		id : 'visual_mark_range',
		attributes :
		{
			beginMark :
			{
				comment : 'begin of the range',
				type : 'visual_mark_text'
			},
			doc :
			{
				comment : 'the document the range belongs to',
				type : 'fabric_doc'
			},
			endMark :
			{
				comment : 'end of the range',
				type : 'visual_mark_text'
			},
			retainx :
			{
				comment : 'x-position of the caret kept',
				type : [ 'undefined', 'number' ]
			}
		},
		init : [ ]
	};
}


var
	prototype;


if( NODE )
{
	jion = require( 'jion' );

	visual_mark_range = jion.this( module, 'source' );
}


prototype = visual_mark_range.prototype;


/*
| Initializer
*/
prototype._init =
	function( )
{
	var
		bP,
		bZ,
		eP,
		eZ,
		p;

	bP = this.beginMark.path;

	eP = this.endMark.path;

	for(
		p = 0, bZ = bP.length, eZ = eP.length;
		p < bZ && p < eZ;
		p++
	);

/**/if( CHECK )
/**/{
/**/	if( p === 0 ) throw new Error( );
/**/}

	this.path = bP.limit( p );
};


/*
| The beginMark or endMark
| dependening on which comes first in the doc.
*/
jion.lazyValue(
	prototype,
	'frontMark',
	function( )
	{
		this._normalize( );

		return this.frontMark;
	}
);


/*
| The beginMark or endMark
| dependening on which comes last in the doc.
*/
jion.lazyValue(
	prototype,
	'backMark',
	function( )
	{
		this._normalize( );

		return this.backMark;
	}
);


/*
| Ranges also have caret capabilities.
|
| The caretMark is identical to endMark.
*/
prototype.hasCaret = true;


/*
| Returns the mark where the caret should show up.
*/
jion.lazyValue(
	prototype,
	'caret',
	function( )
	{
		return this.endMark;
	}
);


/*
| The item's path.
*/
jion.lazyValue(
	prototype,
	'itemPath',
	function( )
	{
		if( this.beginMark.path.length < 3 ) return;

		return this.beginMark.path.limit( 3 );
	}
);


/*
| The content the mark puts into the clipboard.
*/
jion.lazyValue(
	prototype,
	'clipboard',
	function( )
	{
		var
			backKey,
			backMark,
			backText,
			buf,
			doc,
			frontKey,
			frontMark,
			frontText,
			r, rZ,
			text;

		frontMark = this.frontMark;

		backMark = this.backMark;

		doc = this.doc;

		frontKey = frontMark.path.get( -2 );

		backKey = backMark.path.get( -2 );

		if( frontMark.path.equals( backMark.path ) )
		{
			text = doc.get( frontKey ).text;

			return(
				text.substring( frontMark.at, backMark.at )
			);
		}

		frontText = doc.get( frontKey ).text;

		backText = doc.get( backKey ).text;

		buf =
		[
			frontText.substring(
				frontMark.at, frontText.length
			)
		];

		for(
			r = doc.rankOf( frontKey ) + 1, rZ = doc.rankOf( backKey );
			r < rZ;
			r++
		)
		{
			buf.push( '\n', doc.atRank( r ).text );
		}

		buf.push( '\n', backText.substring( 0, backMark.at ) );

		return buf.join( '' );
	}
);


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
prototype.containsPath =
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

	// FIXME, shouldn't this also
	// check paths of stuff inbetween?

	return(
		path.subPathOf( this.beginMark.path )
		|| path.subPathOf( this.endMark.path )
	);
};


/*
| Recreates this mark with a transformation
| applied.
|
| FIXME take the transformed doc here
*/
prototype.createTransformed =
	function(
		changes
	)
{
	if( this.beginMark.path.get( 0 ) !== 'spaceVisual' ) return this;

	return(
		this.create(
			'beginMark', this.beginMark.createTransformed( changes ),
			'endMark', this.endMark.createTransformed( changes )
		)
	);
};



/*
| True if beginMark equals endMark
*/
jion.lazyValue(
	prototype,
	'empty',
	function( )
	{
		return this.beginMark.equals( this.endMark );
	}
);


/*
| Sets frontMark/backMark so frontMark is before backMark.
*/
prototype._normalize =
	function( )
{
	var
		beginMark,
		bk,
		br,
		endMark,
		ek,
		er;

	beginMark = this.beginMark;

	endMark = this.endMark;

	if( beginMark.path.equals( endMark.path ) )
	{
		if( beginMark.at <= endMark.at )
		{
			jion.aheadValue( this, 'frontMark', beginMark );

			jion.aheadValue( this, 'backMark', endMark );
		}
		else
		{
			jion.aheadValue( this, 'frontMark', endMark );

			jion.aheadValue( this, 'backMark', beginMark );
		}

		return;
	}

	bk = beginMark.path.get( -2 );

	ek = endMark.path.get( -2 );

/**/if( CHECK )
/**/{
/**/	if( bk === ek )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	br = this.doc.rankOf( bk );

	er = this.doc.rankOf( ek );

	if( br < er )
	{
		jion.aheadValue( this, 'frontMark', beginMark );

		jion.aheadValue( this, 'backMark', endMark );
	}
	else
	{
		jion.aheadValue( this, 'frontMark', endMark );

		jion.aheadValue( this, 'backMark', beginMark );
	}
};


})( );
