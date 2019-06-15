/*
| The virtual caret.
*/
'use strict';


tim.define( module, ( def, mark_caret ) => {


if( TIM )
{
	def.attributes =
	{
		// the shell has the system focus
		focus : { type : 'boolean', defaultValue : 'true' },

		// x-position of the caret kept
		retainx : { type : [ 'undefined', 'number' ] },

		// the mark into a text (path/at)
		// FIXME remove
		pat : { type : './pat' },

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
	const pat = this.pat.backward;

	if( !pat ) return;

	const c =
		this.create(
			'offset', this.offset.backward,
			'pat', pat
		);

	tim.aheadValue( c, 'forward', this );

	return c;
};


/*
| The mark where the caret is.
*/
// FIXME remove
def.lazy.caret = function( ) { return this.pat; };


/*
| The offset where the caret is.
*/
def.lazy.caretOffset = function( ) { return this.offset; };


/*
| The content the mark puts into the clipboard.
*/
def.proto.clipboard = '';


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

	return path.subPathOf( this.pat.path );
};


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
	const c =
		this.create(
			'offset', this.offset.forward,
			'pat', this.pat.forward
		);

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
| The widget's path.
*/
def.lazy.widgetPath =
	function( )
{
	const path = this.pat.path;

	if( path.length < 5 || path.get( 0 ) !== 'forms' ) return;

	return path.limit( 5 );
};


/*
| The caret with offset = 0.
*/
def.lazy.zero =
	function( )
{
	return this.create( 'pat', this.pat.zero );
};


/*
| Extra checking.
*/
def.proto._check =
	function( )
{
	let path = this.pat.path;

	if( path.last === 'text' ) path = path.shorten;

/**/if( CHECK )
/**/{
/**/	if(
/**/		!this.offset.get( this.offset.length - 1 ).toPath.equals( path )
/**/	) throw new Error( );
/**/}
};


} );
