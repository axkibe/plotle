/*
| A fix sized text item.
|
| Has potentionaly a scrollbar.
*/
'use strict';


tim.define( module, 'fabric_note', ( def, fabric_note ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// the notes document
		doc : { type : 'fabric_doc', json : true },

		// the fontsize of the note
		fontsize : { type : 'number', json : true },

		// the path of the note
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// the notes zone
		zone : { type : 'gleam_rect', json : true },
	};

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


/*
| Forwards zone pnw.
|
| FIXME remove
*/
/*
def.lazy.pnw =
	function( )
{
	return this.zone.pnw;
};
*/


} );
