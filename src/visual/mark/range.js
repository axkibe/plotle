/*
| A text range.
|
| FIXME rename begin/end to beginMark/endMark
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
			begin :
			{
				comment : 'begin of the range',
				type : 'visual_mark_text'
			},
			doc :
			{
				comment : 'the document the range belongs to',
				type : 'fabric_doc'
			},
			end :
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

	bP = this.begin.path;

	eP = this.end.path;

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
| The begin or end path,
| dependening on which comes first in the doc.
*/
jion.lazyValue(
	prototype,
	'front',
	function( )
	{
		this._normalize( );

		return this.front;
	}
);


/*
| The begin or end path,
| dependening on which comes last in the doc.
*/
jion.lazyValue(
	prototype,
	'back',
	function( )
	{
		this._normalize( );

		return this.back;
	}
);



/*
| Ranges also have caret capabilities.
|
| The caretPath and caretAt are identical to
| end.path and end.at
*/
prototype.hasCaret = true;


/*
| The caret's path.
|
| This allows a common interface with text range.
*/
jion.lazyValue(
	prototype,
	'caretPath',
	function( )
	{
		return this.end.path;
	}
);


/*
| The caret's offset.
|
| This allows a common interface with text range.
*/
jion.lazyValue(
	prototype,
	'caretAt',
	function( )
	{
		return this.end.at;
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
		if( this.begin.path.length < 3 )
		{
			return;
		}

		return this.begin.path.limit( 3 );
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
			back,
			backKey,
			backText,
			buf,
			doc,
			front,
			frontKey,
			frontText,
			r, rZ,
			text;

		front = this.front;

		back = this.back;

		doc = this.doc;

		frontKey = front.path.get( -2 );

		backKey = back.path.get( -2 );

		if( front.path.equals( back.path ) )
		{
			text = doc.get( frontKey ).text;

			return text.substring( front.at, back.at );
		}

		frontText = doc.get( frontKey ).text;

		backText = doc.get( backKey ).text;

		buf =
			[
				frontText.substring( front.at, frontText.length )
			];

		for(
			r = doc.rankOf( frontKey ) + 1, rZ = doc.rankOf( backKey );
			r < rZ;
			r++
		)
		{
			buf.push( '\n', doc.atRank( r ).text );
		}

		buf.push( '\n', backText.substring( 0, back.at ) );

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
		path.subPathOf( this.begin.path )
		||
		path.subPathOf( this.end.path )
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
	if( this.begin.path.get( 0 ) !== 'spaceVisual' ) return this;

	return(
		this.create(
			'begin', this.begin.createTransformed( changes ),
			'end', this.end.createTransformed( changes )
		)
	);
};



/*
| True if begin equals end
*/
jion.lazyValue(
	prototype,
	'empty',
	function( )
	{
		return this.begin.equals( this.end );
	}
);


/*
| Sets front/back so front is before back.
*/
prototype._normalize =
	function( )
{
	var
		begin,
		bk,
		br,
		end,
		ek,
		er;

	begin = this.begin;

	end = this.end;

	if( begin.path.equals( end.path ) )
	{
		if( begin.at <= end.at )
		{
			jion.aheadValue( this, 'front', begin );

			jion.aheadValue( this, 'back', end );
		}
		else
		{
			jion.aheadValue( this, 'front', end );

			jion.aheadValue( this, 'back', begin );
		}

		return;
	}

	bk = begin.path.get( -2 );

	ek = end.path.get( -2 );

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
		jion.aheadValue( this, 'front', begin );

		jion.aheadValue( this, 'back', end );
	}
	else
	{
		jion.aheadValue( this, 'front', end );

		jion.aheadValue( this, 'back', begin );
	}
};


})( );
