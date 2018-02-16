/*
| A paragraph.
*/
'use strict';


tim.define( module, 'fabric_para', ( def, fabric_para ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// the path of the para
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// the paragraphs text
		text : { type : 'string', json : true }
	};
}


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| Shortcut to the para's key.
| It is the last path entry.
*/
def.lazy.key =
	function( )
{
	return this.path.get( -1 );
};


/*
| The path to the .text attribute
*/
def.lazy.textPath =
	function( )
{
	return this.path && this.path.append( 'text' );
};


/*
| True if the para is effectively empty or has only blank characters.
*/
def.lazy.isBlank =
	function( )
{
	return /^\s*$/.test( this.text );
};


} );
