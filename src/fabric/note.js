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
		doc :
		{
			// the notes document
			type : 'fabric_doc',
			json : true
		},
		fontsize :
		{
			// the fontsize of the note
			type : 'number',
			json : true
		},
		path :
		{
			// the path of the note
			type : [ 'undefined', 'jion$path' ]
		},
		zone :
		{
			// the notes zone
			type : 'gleam_rect',
			json : true
		}
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
