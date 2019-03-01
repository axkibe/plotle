/*
| A paragraph.
*/
'use strict';


tim.define( module, ( def, fabric_para ) => {


if( TIM )
{
	def.attributes =
	{
		// the path of the para
		path : { type : [ 'undefined', 'tim.js/src/path/path' ] },

		// the paragraphs text
		text : { type : 'string', json : true }
	};

	// FIXME change to 'para'
	def.json = 'fabric_para';
}


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
