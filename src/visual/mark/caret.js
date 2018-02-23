/*
| The virtual caret.
*/
'use strict';


tim.define( module, ( def ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// offset of the caret
		at : { type : [ 'undefined', 'integer' ], assign : '' },

		// the shell has the system focus
		focus : { type : 'boolean', defaultValue : 'true' },

		// path of the caret
		path : { type : [ 'undefined', 'tim.js/path' ], assign : '' },

		// x-position of the caret kept
		retainx : { type : [ 'undefined', 'number' ] },

		// the text mark
		textMark : { type : [ 'undefined', './text' ] },
	};

	def.init = [ 'path', 'at' ];
}


const pathList = tim.import( 'tim.js', 'pathList' );

const visual_mark_text = require( './text' );


/*
| Initializer.
*/
def.func._init =
	function(
		path,
		at
	)
{
	if( path )
	{
		this.textMark =
			visual_mark_text.create(
				'path', path,
				'at', at
			);
	}
};


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| The textMark where the caret is.
*/
def.lazy.caret =
	function( )
{
	return this.textMark;
};


/*
| The item path.
|
| This is either undefined or an pathList of length === 1
*/
def.lazy.itemPaths =
	function( )
{
	const path = this.textMark.path;

	if( path.length < 3 || path.get( 0 ) !== 'spaceVisual' ) return;

	return pathList.create( 'list:append', path.limit( 3 ) );
};


/*
| The widget's path.
*/
def.lazy.widgetPath =
	function( )
{
	const path = this.textMark.path;

	if( path.length < 5 || path.get( 0 ) !== 'form' ) return;

	return path.limit( 5 );
};


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Recreates this mark with a transformation
| applied.
*/
def.func.createTransformed =
	function(
		changes
	)
{
	if( this.textMark.path.get( 0 ) !== 'spaceVisual' ) return this;

	const tm = this.textMark.createTransformed( changes );

	if( !tm ) return undefined;

	return this.create( 'textMark', tm );
};


/*
| A caret mark has a caret.
|
| (the text range is the other mark
|  which has this too )
*/
def.func.hasCaret = true;


/*
| The content the mark puts into the clipboard.
*/
def.func.clipboard = '';


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

	return path.subPathOf( this.textMark.path );
};


} );
