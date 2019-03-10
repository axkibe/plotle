/*
| A sequence of paragraphs.
*/
'use strict';


tim.define( module, ( def, fabric_doc ) => {


if( TIM )
{
	def.attributes =
	{
		// width available to fill( 0 for labels is infinite )
		flowWidth : { type : [ 'undefined', 'number' ] },

		// the path of the doc
		path : { type : [ 'undefined', 'tim.js/src/path/path' ] },
	};

	def.json = 'fabric_doc';

	def.twig = [ './para' ];
}



/*
| Forwards the path to paras.
*/
def.adjust.get =
	function(
		name,
		para
	)
{
	if( !para ) return;

	const path = para.path || ( this.path && this.path.append( 'twig' ).appendNC( name ) );

	return(
		para.create(
			'flowWidth', this.flowWidth,
			'path', path,
		)
	);
};


/*
| True if all paras are effectively empty or has only blank characters.
*/
def.lazy.isBlank =
	function( )
{
	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const para = this.atRank( r );

		if( !para.isBlank ) return false;
	}

	return true;
};


} );
