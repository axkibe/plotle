/*
| A single widget marked ( without caret or range )
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// path of the item
		path : { type : 'tim.js/src/path' }
	};
}


/*
| A widget has no item paths.
*/
def.lazy.paths = () => undefined;


/*
| The widget's path.
*/
def.lazy.widgetPath =
	function( )
{
	return this.path;
};


/*
| Widget marks have no carets.
*/
def.func.hasCaret = false;


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
/**/	if( path.length === 0 ) throw new Error( );
/**/}

	return path.subPathOf( this.path );
};


} );
