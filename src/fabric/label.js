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
		doc : { type : '../fabric/doc', json : true },

		// the fontsize of the label
		fontsize : { type : 'number', json : true },

		// the path of the doc
		path : { type : [ 'undefined', 'tim.js/path' ] },

		pos : { type : '../gleam/point', json : true },
	};

	def.json = 'label';

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


} );
