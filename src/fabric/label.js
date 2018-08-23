/*
| An item with resizing text.
*/
'use strict';


tim.define( module, ( def, self ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// the labels document
		doc : { type : '../fabric/doc', json : true, transform : '_transformDoc' },

		// the fontsize of the label
		fontsize : { type : 'number', json : true },

		// the path of the doc
		path : { type : [ 'undefined', 'tim.js/path' ] },

		pos : { type : '../gleam/point', json : true },
	};

	def.json = 'label';
}


/*
| Puts in the path to doc child.
*/
def.func._transformDoc =
	function(
		doc
	)
{
	const path = this.path;

	if( !path ) return doc;

	return doc.create( 'path', path.append( 'doc' ) );
};


} );
