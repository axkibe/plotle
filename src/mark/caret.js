/*
| The virtual caret.
*/
'use strict';


tim.define( module, ( def, mark_caret ) => {


def.extend = './base';


if( TIM )
{
	def.attributes =
	{
		// the shell has the system focus
		focus : { type : 'boolean', defaultValue : 'true' },

		// x-position of the caret kept
		retainx : { type : [ 'undefined', 'number' ] },

		// the trace of the caret
		offset : { type : '../trace/offset' },
	};
}


const mark_items = tim.require( './items' );


/*
| The caret with offset - 1.
*/
def.lazy.backward =
	function( )
{
	const b = this.offset.backward;

	if( !b ) return;

	const c = this.create( 'offset', b );

	tim.aheadValue( c, 'forward', this );

	return c;
};


/*
| The offset where the caret is.
*/
def.lazy.caretOffset = function( ) { return this.offset; };


/*
| The content the mark puts into the clipboard.
*/
def.proto.clipboard = '';


/*
| Returns true if this mark encompasses the trace.
*/
def.proto.encompasses = function( trace ) { return this.offset.hasTrace( trace ); };


/*
| The caret with offset + 1.
*/
def.lazy.forward =
	function( )
{
	const c = this.create( 'offset', this.offset.forward );

	tim.aheadValue( c, 'backward', this );

	return c;
};


/*
| A caret mark has a caret.
|
| (the text range is the other mark which has this too )
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
	const offset = this.offset;

	if( !offset.traceSpace ) return;

	return mark_items.createWithOne( offset.traceItem );
};


/*
| The widget the caret is in.
*/
def.lazy.widgetTrace = function( ) { return this.offset.traceWidget; };


/*
| The caret with offset = 0.
*/
def.lazy.zero =
	function( )
{
	return this.create( 'offset', this.offset.create( 'at', 0 ), 'retainx', undefined );
};


} );
