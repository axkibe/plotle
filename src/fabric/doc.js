/*
| A sequence of paragraphs.
*/
'use strict';


tim.define( module, ( def, fabric_doc ) => {


if( TIM )
{
	def.attributes =
	{
		// the path of the doc
		path : { type : [ 'undefined', 'tim.js/src/path' ] }
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
	// FIXME, check why undefined paras are requested
	if( !para || para.path || !this.path ) return para;

	return para.create( 'path', this.path.append( 'twig' ).appendNC( name ) );
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
