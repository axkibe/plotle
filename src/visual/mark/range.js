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
		}
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
| The doc path.
*/
jion.lazyValue(
	prototype,
	'docPath',
	function( )
{
	var
		beginPath;

	beginPath = this.beginMark.path;

	if(
		beginPath.length < 4
		|| beginPath.get( 0 ) !== 'spaceVisual'
	)
	{
		return;
	}

/**/if( CHECK )
/**/{
/**/	if( beginPath.get( 3 ) !== 'doc' ) throw new Error( );
/**/}

	return beginPath.limit( 4 );
}
);


/*
| The common path this is the part that begin
| and share in common
*/
jion.lazyValue(
	prototype,
	'commonPath',
	function( )
{
	var
		a,
		bP,
		bZ,
		eP,
		eZ,
		mZ;

	bP = this.beginMark.path;

	eP = this.endMark.path;

	bZ = bP.length;

	eZ = eP.length;

	mZ = Math.min( bZ, eZ );

	for( a = 0; a < mZ; a++ )
	{
		if( bP.get( a ) !== eP.get( a ) ) break;
	}

	return bP.limit( a );
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
	var
		beginPath;

	beginPath = this.beginMark.path;

	if(
		beginPath.length < 3
		|| beginPath.get( 0 ) !== 'spaceVisual'
	)
	{
		return;
	}

	return beginPath.limit( 3 );
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
	var
		bp,
		br,
		doc,
		dp,
		fp,
		fr,
		r;

/**/if( CHECK )
/**/{
/**/	if( path.length === 0 )	throw new Error( );
/**/}

	dp = this.docPath;

	if( path.length <= dp.length )
	{
		return path.subPathOf( dp );
	}

	if(
		path.subPathOf( this.beginMark.path )
		|| path.subPathOf( this.endMark.path )
	) return true;

	fp = this.frontMark.path;

	bp = this.backMark.path;

	doc = this.doc;

	fr = doc.rankOf( fp.get( -2 ) );
	
	br = doc.rankOf( bp.get( -2 ) );

	// NOTE: this code is untested.

	for( r = fr + 1; r < br; r++ )
	{
		if( path.get( dp.length + 1 ) === doc.keyAtRank( r ) )
		{
			return true;
		}
	}

	return false;
};


/*
| Recreates this mark with a transformation
| applied.
*/
prototype.createTransformed =
	function(
		changes,
		doc
	)
{

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 2 ) throw new Error( );
/**/}

	if( this.beginMark.path.get( 0 ) !== 'spaceVisual' ) return this;

	return(
		this.create(
			'beginMark', this.beginMark.createTransformed( changes ),
			'endMark', this.endMark.createTransformed( changes ),
			'doc', doc
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
