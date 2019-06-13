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

		// begin of the range
		beginOffset : { type : '../trace/offset' },

		// the document the range belongs to
		doc : { type : '../fabric/doc' },

		// end of the range
		end : { type : './pat' },

		// end of the range
		endOffset : { type : '../trace/offset' },

		// x-position of the caret kept
		retainx : { type : [ 'undefined', 'number' ] }
	};
}

const tim_path_list = tim.require( 'tim.js/pathList' );

const trace_para = tim.require( '../trace/para' );


/*
| Returns the mark where the caret should show up.
*/
// FIXME remove
def.lazy.caret = function( ) { return this.end; };


/*
| The offset where the caret is.
*/
def.lazy.caretOffset = function( ) { return this.endOffset; };


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
def.lazy.front = function( ) { this._normalize( ); return this.front; };


/*
| The begin or end
| dependening on which comes first in the doc.
*/
def.lazy.frontOffset = function( ) { this._normalize( ); return this.frontOffset; };


/*
| The begin or end
| dependening on which comes last in the doc.
*/
def.lazy.back = function( ) { this._normalize( ); return this.back; };


/*
| The begin or end
| dependening on which comes last in the doc.
*/
def.lazy.backOffset = function( ) { this._normalize( ); return this.backOffset; };


/*
| Ranges also have caret capabilities.
|
| The caretMark is identical to end.
| FIXME remove this is duplicate to caretOffset
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
	const frontOffset = this.frontOffset;

	const backOffset = this.backOffset;

	const frontTrace = frontOffset.tracePara;

	const backTrace = backOffset.tracePara;

	const doc = this.doc;

	const frontKey = frontTrace.key;

	const backKey = backTrace.key;

	if( frontTrace.equals( backTrace ) )
	{
		const text = doc.get( frontKey ).text;

		return text.substring( frontOffset.at, backOffset.at );
	}

	let text = doc.get( frontKey ).text;

	text = text.substring( frontOffset.at, text.length );

	for(
		let r = doc.rankOf( frontKey ) + 1, rl = doc.rankOf( backKey );
		r < rl;
		r++
	)
	{
		text += '\n' + doc.atRank( r ).text;
	}

	return text + doc.get( backKey ).text.substring( 0, backOffset.at );
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
def.lazy.empty = function( ) { return this.begin.equals( this.end ); };


/*
| Returns true if this mark encompasses the trace.
*/
def.proto.encompasses =
	function(
		trace
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	const tPara = trace.tracePara;

	if( tPara ) return this._encompassesPara( tPara );

	return this.beginOffset.hasTrace( trace );
};


/*
| Returns true if the range encompasses the para
| specified by the trace
*/
def.proto._encompassesPara =
	function(
		trace
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/
/**/	if( trace.timtype !== trace_para ) throw new Error( );
/**/}

	trace = trace.tracePara;

	if( !trace ) return;

	const tDoc = this.beginOffset.traceDoc;

	// not even the same doc?
	if( !tDoc.equals( trace.traceDoc ) ) return;

	const ftp = this.frontOffset.tracePara;

	const btp = this.backOffset.tracePara;

	const tkey = trace.key;

	const doc = this.doc;

	const fr = doc.rankOf( ftp.key );

	const br = doc.rankOf( btp.key );

	// NOTE: this code is untested.

	for( let r = fr; r <= br; r++ )
	{
		if( tkey === doc.keys[ r ] ) return true;
	}

	return false;
};


/*
| Sets front/back so front is before back.
*/
def.proto._normalize =
	function( )
{
	const begin = this.begin;
	const end = this.end;

	const bto = this.beginOffset;
	const eto = this.endOffset;

	const btp = bto.tracePara;
	const etp = eto.tracePara;

	if( btp.equals( etp ) )
	{
		if( bto.at <= eto.at )
		{
			tim.aheadValue( this, 'front', begin );
			tim.aheadValue( this, 'back', end );

			tim.aheadValue( this, 'frontOffset', bto );
			tim.aheadValue( this, 'backOffset', eto );
		}
		else
		{
			tim.aheadValue( this, 'front', end );
			tim.aheadValue( this, 'back', begin );

			tim.aheadValue( this, 'frontOffset', eto );
			tim.aheadValue( this, 'backOffset', bto );
		}

		return;
	}

	const bKey = btp.key;
	const eKey = etp.key;

/**/if( CHECK )
/**/{
/**/	if( bKey === eKey ) throw new Error( );
/**/}

	const doc = this.doc;
	const bRank = doc.rankOf( bKey );
	const eRank = doc.rankOf( eKey );

	if( bRank < eRank )
	{
		tim.aheadValue( this, 'front', begin );
		tim.aheadValue( this, 'back', end );

		tim.aheadValue( this, 'frontOffset', bto );
		tim.aheadValue( this, 'backOffset', eto );
	}
	else
	{
		tim.aheadValue( this, 'front', end );
		tim.aheadValue( this, 'back', begin );

		tim.aheadValue( this, 'frontOffset', eto );
		tim.aheadValue( this, 'backOffset', bto );
	}
};


} );
