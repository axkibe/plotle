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
		path : { type : [ 'undefined', 'tim.js/src/path' ] },

		// the notes zone
		zone : { type : '../gleam/rect', json : true },
	};

	def.json = 'note';
}


/*
| Puts in the path to doc child.
*/
def.transform.doc =
	function(
		doc
	)
{
	const path = this.path;

	if( !path ) return doc;

	return doc.create( 'path', path.append( 'doc' ) );
};


} );
