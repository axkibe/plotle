/*
| An item with resizing text.
*/
'use strict';


tim.define( module, ( def, fabric_label ) => {


if( TIM )
{
	def.attributes =
	{
		// the labels document
		doc : { type : '../fabric/doc', json : true },

		// the fontsize of the label
		fontsize : { type : 'number', json : true },

		// the path of the doc
		// no json thus not saved or transmitted
		path : { type : [ 'undefined', 'tim.js/src/path/path' ] },

		pos : { type : '../gleam/point', json : true },
	};

	def.json = 'label';
}


/*
| Forwards the path to the doc.
*/
def.adjust.doc =
	function(
		doc
	)
{
	const path = doc.path || ( this.path && this.path.append( 'doc' ) );

	return(
		doc.create(
			'flowWidth', 0,
			'fontsize', this.fontsize,
			'path', path
		)
	);
};


} );
