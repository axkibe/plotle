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
		// FIXME remove undefined
		offset : { type : [ 'undefined', '../trace/offset' ] },
	};
}


const tim_path_list = tim.require( 'tim.js/pathList' );

const mark_pat = tim.require( './pat' );


/*
| The caret with offset - 1.
*/
def.lazy.backward =
	function( )
{
	const pat = this.pat.backward;

	if( !pat ) return;

	const c = this.create( 'pat', pat );

	tim.aheadValue( c, 'forward', this );

	return c;
};


/*
| Creation Shortcut.
*/
def.static.createPathAt =
	function(
		path,
		at
	)
{
	return mark_caret.create( 'pat', mark_pat.create( 'path', path, 'at', at ) );
};


/*
| The mark where the caret is.
*/
def.lazy.caret =
	function( )
{
	return this.pat;
};


/*
| The caret with offset + 1.
*/
def.lazy.forward =
	function( )
{
	const c = this.create( 'pat', this.pat.forward );

	tim.aheadValue( c, 'backward', this );

	return c;
};


/*
| The item path.
|
| This is either undefined or a path list of length === 1
*/
def.lazy.itemPaths =
	function( )
{
	const path = this.pat.path;

	if( path.length < 3 || path.get( 0 ) !== 'space' ) return;

	return tim_path_list.create( 'list:append', path.limit( 3 ) );
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
| A caret mark has a caret.
|
| (the text range is the other mark which has this too )
*/
def.proto.hasCaret = true;


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
| The caret with offset = 0.
*/
def.lazy.zero =
	function( )
{
	return this.create( 'pat', this.pat.zero );
};


} );
