/*
| A single widget marked ( without caret or range )
*/
'use strict';


tim.define( module, 'visual_widget', ( def, visual_widget ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		path :
		{
			// path of the item
			type : 'jion$path'
		}
	};
}


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


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


/*:::::::::::.
:: Functions
'::::::::::::*/


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
