/*
| A text range.
*/
'use strict';


tim.define( module, ( def, mark_range ) => {


def.extend = './base';


if( TIM )
{
	def.attributes =
	{
		// begin offset of the range
		beginOffset : { type : '../trace/offset' },

		// the document the range belongs to
		doc : { type : '../fabric/doc' },

		// end offset of the range
		endOffset : { type : '../trace/offset' },

		// x-position of the caret kept
		retainx : { type : [ 'undefined', 'number' ] }
	};
}


const trace_para = tim.require( '../trace/para' );

const mark_items = tim.require( './items' );


/*
| The beginOffset or endOffset
| dependening on which comes last in the doc.
*/
def.lazy.backOffset = function( ) { this._normalize( ); return this.backOffset; };


/*
| The offset where the caret is.
*/
def.lazy.caretOffset = function( ) { return this.endOffset; };


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
	throw new Error( 'XXX' );
};


/*
| The doc path.
*/
def.lazy.docPath =
	function( )
{
	throw new Error( 'XXX' );
};


/*
| True if beginOffset equals endOffset
*/
def.lazy.empty = function( ) { return this.beginOffset.equals( this.endOffset ); };


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
| The beginOffset or endOffset
| dependening on which comes first in the doc.
*/
def.lazy.frontOffset = function( ) { this._normalize( ); return this.frontOffset; };


/*
| Ranges also have caret capabilities.
|
| The caretMark is identical to end.
| FIXME remove this is duplicate to caretOffset
*/
def.proto.hasCaret = true;


/*
| The item traces.
|
| This is either undefined or mark_items containing the parenting item.
*/
def.lazy.itemsMark =
	function( )
{
	const offset = this.beginOffset;

	if( !offset.traceSpace ) return;

	return mark_items.createWithOne( offset.traceItem );
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
	const bto = this.beginOffset;
	const eto = this.endOffset;

	const btp = bto.tracePara;
	const etp = eto.tracePara;

	if( btp.equals( etp ) )
	{
		if( bto.at <= eto.at )
		{
			tim.aheadValue( this, 'frontOffset', bto );
			tim.aheadValue( this, 'backOffset', eto );
		}
		else
		{
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
		tim.aheadValue( this, 'frontOffset', bto );
		tim.aheadValue( this, 'backOffset', eto );
	}
	else
	{
		tim.aheadValue( this, 'frontOffset', eto );
		tim.aheadValue( this, 'backOffset', bto );
	}
};


} );
