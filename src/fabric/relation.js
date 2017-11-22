/*
| Relates two items (including other relations).
*/
'use strict';


tim.define( module, 'fabric_relation', ( def, fabric_relation ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


/*
| The jion definition.
*/
if( TIM )
{
	def.attributes =
	{
		doc :
		{
			// the labels document
			type : 'fabric_doc',
			json : true,
		},
		fontsize :
		{
			// the fontsize of the label
			type : 'number',
			json : true,
		},
		item1key :
		{
			// item the relation goes from
			type : 'string',
			json : true,
		},
		item2key :
		{
			// item the relation goes to
			type : 'string',
			json : true
		},
		path :
		{
			// the path of the doc
			type : [ 'undefined', 'jion$path' ]
		},
		pos :
		{
			// position
			type : 'gleam_point',
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


} );

