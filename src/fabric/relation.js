/*
| Relates two items (including other relations).
*/
'use strict';


tim.define( module, 'fabric_relation', ( def, fabric_relation ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// the labels document
		doc : { type : 'fabric_doc', json : true },

		// the fontsize of the label
		fontsize : { type : 'number', json : true },

		// item the relation goes from
		item1key : { type : 'string', json : true },

		// item the relation goes to
		item2key : { type : 'string', json : true },

		// the path of the doc
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// position
		pos : { type : 'gleam_point', json : true },
	};

	def.init = [ ];

	def.json = 'relation';
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

