/*
| Relates two items (including other relations).
*/
'use strict';


tim.define( module, ( def, fabric_relation ) => {


if( TIM )
{
	def.attributes =
	{
		// the labels document
		doc : { type : './doc', json : true },

		// the fontsize of the label
		fontsize : { type : 'number', json : true },

		// item the relation goes from
		item1key : { type : 'string', json : true },

		// item the relation goes to
		item2key : { type : 'string', json : true },

		// the path of the doc
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// position
		pos : { type : '../gleam/point', json : true },
	};

	def.json = 'relation';
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
