/*
| A fix sized text item.
|
| Has potentionaly a scrollbar.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// the notes document
		doc : { type : './doc', json : true },

		// the fontsize of the note
		fontsize : { type : 'number', json : true },

		// the path of the note
		path : { type : [ 'undefined', 'tim.js/src/path/path' ] },

		// the notes zone
		zone : { type : '../gleam/rect', json : true },
	};

	def.json = 'note';
}


const gruga_note = require( '../gruga/note' );


/*
| Forwards the path to the doc.
*/
def.adjust.doc =
	function(
		doc
	)
{
	const path = doc.path || ( this.path && this.path.append( 'doc' ) );

	const zone = this.zone;

	return(
		doc.create(
			'flowWidth', zone.width - gruga_note.innerMargin.x,
			'path', path
		)
	);
};


} );
