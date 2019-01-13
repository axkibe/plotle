/*
| A text range.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// begin of the range
		beginMark : { type : './text' },

		// the document the range belongs to
		doc : { type : '../../fabric/doc' },

		// end of the range
		endMark : { type : './text' },

		// x-position of the caret kept
		retainx : { type : [ 'undefined', 'number' ] }
	};
}

const pathList = require( 'tim.js/src/pathList' );


/*
| Returns the mark where the caret should show up.
*/
def.lazy.caret =
	function( )
{
	return this.endMark;
};


/*
| The doc path.
*/
def.lazy.docPath =
	function( )
{
	const beginPath = this.beginMark.path;

	if( beginPath.length < 4 || beginPath.get( 0 ) !== 'spaceVisual' ) return;

/**/if( CHECK )
/**/{
/**/	if( beginPath.get( 3 ) !== 'doc' ) throw new Error( );
/**/}

	return beginPath.limit( 4 );
};


/*
| The beginMark or endMark
| dependening on which comes first in the doc.
*/
def.lazy.frontMark =
	function( )
{
	this._normalize( );

	return this.frontMark;
};


/*
| The beginMark or endMark
| dependening on which comes last in the doc.
*/
def.lazy.backMark =
	function( )
{
	this._normalize( );

	return this.backMark;
};


/*
| The common path this is the part that begin
| and share in common
*/
/*
def.lazy.commonPath =
	function( )
{
	const bP = this.beginMark.path;

	const eP = this.endMark.path;

	const bZ = bP.length;

	const eZ = eP.length;

	const mZ = Math.min( bZ, eZ );

	let a;

	for( a = 0; a < mZ; a++ )
	{
		if( bP.get( a ) !== eP.get( a ) ) break;
	}

	return bP.limit( a );
};
*/


/*
| Ranges also have caret capabilities.
|
| The caretMark is identical to endMark.
*/
def.func.hasCaret = true;



/*
| The item path.
|
| This is either undefined or an pathList of length === 1
*/
def.lazy.itemPaths =
	function( )
{
	const beginPath = this.beginMark.path;

	if( beginPath.length < 3 || beginPath.get( 0 ) !== 'spaceVisual' ) return;

	return pathList.create( 'list:append', beginPath.limit( 3 ) );
};


/*
| The content the mark puts into the clipboard.
*/
def.lazy.clipboard =
	function( )
{
	const frontMark = this.frontMark;

	const backMark = this.backMark;

	const doc = this.doc;

	const frontKey = frontMark.path.get( -2 );

	const backKey = backMark.path.get( -2 );

	if( frontMark.path.equals( backMark.path ) )
	{
		const text = doc.get( frontKey ).text;

		return text.substring( frontMark.at, backMark.at );
	}

	const frontText = doc.get( frontKey ).text;

	const backText = doc.get( backKey ).text;

	const buf =
	[
		frontText.substring(
			frontMark.at, frontText.length
		)
	];

	for(
		let r = doc.rankOf( frontKey ) + 1, rZ = doc.rankOf( backKey );
		r < rZ;
		r++
	)
	{
		buf.push( '\n', doc.atRank( r ).text );
	}

	buf.push( '\n', backText.substring( 0, backMark.at ) );

	return buf.join( '' );
};


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
def.func.containsPath =
	function(
		path
	)
{

/**/if( CHECK )
/**/{
/**/	if( path.length === 0 )	throw new Error( );
/**/}

	const dp = this.docPath;

	if( path.length <= dp.length )
	{
		return path.subPathOf( dp );
	}

	if(
		path.subPathOf( this.beginMark.path )
		|| path.subPathOf( this.endMark.path )
	) return true;

	const fp = this.frontMark.path;

	const bp = this.backMark.path;

	const doc = this.doc;

	const fr = doc.rankOf( fp.get( -2 ) );

	const br = doc.rankOf( bp.get( -2 ) );

	// NOTE: this code is untested.

	for( let r = fr + 1; r < br; r++ )
	{
		if( path.get( dp.length + 1 ) === doc.keyAtRank( r ) ) return true;
	}

	return false;
};


/*
| Recreates this mark with a transformation
| applied.
*/
def.func.createTransformed =
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

	const bm = this.beginMark.createTransformed( changes );

	if( bm === undefined ) return;

	const em = this.endMark.createTransformed( changes );

	if( em === undefined ) return;

	return(
		this.create(
			'beginMark', bm,
			'endMark', em,
			'doc', doc
		)
	);
};



/*
| True if beginMark equals endMark
*/
def.lazy.empty =
	function( )
{
	return this.beginMark.equals( this.endMark );
};


/*
| Sets frontMark/backMark so frontMark is before backMark.
*/
def.func._normalize =
	function( )
{
	const beginMark = this.beginMark;

	const endMark = this.endMark;

	if( beginMark.path.equals( endMark.path ) )
	{
		if( beginMark.at <= endMark.at )
		{
			tim.aheadValue( this, 'frontMark', beginMark );

			tim.aheadValue( this, 'backMark', endMark );
		}
		else
		{
			tim.aheadValue( this, 'frontMark', endMark );

			tim.aheadValue( this, 'backMark', beginMark );
		}

		return;
	}

	const bk = beginMark.path.get( -2 );

	const ek = endMark.path.get( -2 );

/**/if( CHECK )
/**/{
/**/	if( bk === ek )	throw new Error( );
/**/}

	const br = this.doc.rankOf( bk );

	const er = this.doc.rankOf( ek );

	if( br < er )
	{
		tim.aheadValue( this, 'frontMark', beginMark );

		tim.aheadValue( this, 'backMark', endMark );
	}
	else
	{
		tim.aheadValue( this, 'frontMark', endMark );

		tim.aheadValue( this, 'backMark', beginMark );
	}
};


} );
