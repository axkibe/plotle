/*
| A text range.
*/
'use strict';


tim.define( module, ( def, mark_range ) => {


if( TIM )
{
	def.attributes =
	{
		// begin of the range
		begin : { type : './pat' },

		// the document the range belongs to
		doc : { type : '../fabric/doc' },

		// end of the range
		end : { type : './pat' },

		// x-position of the caret kept
		retainx : { type : [ 'undefined', 'number' ] }
	};
}

const tim_path_list = tim.require( 'tim.js/pathList' );


/*
| Returns the mark where the caret should show up.
*/
def.lazy.caret = function( ) { return this.end; };


/*
| The doc path.
*/
def.lazy.docPath =
	function( )
{
	const beginPath = this.begin.path;

	if( beginPath.length < 4 || beginPath.get( 0 ) !== 'space' ) return;

/**/if( CHECK )
/**/{
/**/	if( beginPath.get( 3 ) !== 'doc' ) throw new Error( );
/**/}

	return beginPath.limit( 4 );
};


/*
| The begin or end
| dependening on which comes first in the doc.
*/
def.lazy.front =
	function( )
{
	this._normalize( );

	return this.front;
};


/*
| The begin or end
| dependening on which comes last in the doc.
*/
def.lazy.back =
	function( )
{
	this._normalize( );

	return this.back;
};


/*
| Ranges also have caret capabilities.
|
| The caretMark is identical to end.
*/
def.proto.hasCaret = true;



/*
| The item path.
|
| This is either undefined or an path list of length === 1
*/
def.lazy.itemPaths =
	function( )
{
	const beginPath = this.begin.path;

	if( beginPath.length < 3 || beginPath.get( 0 ) !== 'space' ) return;

	return tim_path_list.create( 'list:append', beginPath.limit( 3 ) );
};


/*
| The content the mark puts into the clipboard.
*/
def.lazy.clipboard =
	function( )
{
	const front = this.front;

	const back = this.back;

	const doc = this.doc;

	const frontKey = front.path.get( -2 );

	const backKey = back.path.get( -2 );

	if( front.path.equals( back.path ) )
	{
		const text = doc.get( frontKey ).text;

		return text.substring( front.at, back.at );
	}

	const frontText = doc.get( frontKey ).text;

	const backText = doc.get( backKey ).text;

	const buf = [ frontText.substring( front.at, frontText.length ) ];

	for(
		let r = doc.rankOf( frontKey ) + 1, rl = doc.rankOf( backKey );
		r < rl;
		r++
	)
	{
		buf.push( '\n', doc.atRank( r ).text );
	}

	buf.push( '\n', backText.substring( 0, back.at ) );

	return buf.join( '' );
};


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
def.proto.containsPath =
	function(
		path
	)
{

/**/if( CHECK )
/**/{
/**/	if( path.length === 0 )	throw new Error( );
/**/}

	const dp = this.docPath;

	if( path.length <= dp.length ) return path.subPathOf( dp );

	if( path.subPathOf( this.begin.path ) || path.subPathOf( this.end.path ) ) return true;

	const fp = this.front.path;

	const bp = this.back.path;

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
| True if begin equals end
*/
def.lazy.empty =
	function( )
{
	return this.begin.equals( this.end );
};


/*
| Sets front/back so front is before back.
*/
def.proto._normalize =
	function( )
{
	const begin = this.begin;

	const end = this.end;

	if( begin.path.equals( end.path ) )
	{
		if( begin.at <= end.at )
		{
			tim.aheadValue( this, 'front', begin );
			tim.aheadValue( this, 'back', end );
		}
		else
		{
			tim.aheadValue( this, 'front', end );
			tim.aheadValue( this, 'back', begin );
		}

		return;
	}

	const bk = begin.path.get( -2 );

	const ek = end.path.get( -2 );

/**/if( CHECK )
/**/{
/**/	if( bk === ek )	throw new Error( );
/**/}

	const br = this.doc.rankOf( bk );

	const er = this.doc.rankOf( ek );

	if( br < er )
	{
		tim.aheadValue( this, 'front', begin );

		tim.aheadValue( this, 'back', end );
	}
	else
	{
		tim.aheadValue( this, 'front', end );

		tim.aheadValue( this, 'back', begin );
	}
};


} );
