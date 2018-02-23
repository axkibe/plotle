/*
| A fix sized text item.
|
| Has potentionaly a scrollbar.
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
		// the notes document
		doc : { type : './doc', json : true },

		// the fontsize of the note
		fontsize : { type : 'number', json : true },

		// the path of the note
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// the notes zone
		zone : { type : '../gleam/rect', json : true },
	};

	def.json = 'note';

	def.init = [ ];
}


/*
| Initializer.
*/
def.func._init =
	function( )
{
	this.doc =
		this.doc.create(
			'path', this.path && this.path.append( 'doc' )
		);
};


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


} );
