/*
| An item with resizing text.
*/
'use strict';


tim.define( module, 'fabric_label', ( def, fabric_label ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		doc :
		{
			comment : 'the labels document',
			type : 'fabric_doc',
			json : true
		},
		fontsize :
		{
			comment : 'the fontsize of the label',
			type : 'number',
			json : true
		},
		path :
		{
			comment : 'the path of the doc',
			type : [ 'undefined', 'tim$path' ]
		},
		pos :
		{
			comment : 'position',
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
