/*
| A sequence of paragraphs.
*/
'use strict';


tim.define( module, ( def, fabric_doc ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// the path of the doc
		path : { type : [ 'undefined', 'tim.js/path' ] }
	};

	def.json = 'fabric_doc';

	def.twig = [ './para' ];
}



/*
| Transforms paras.
*/
def.transform.get =
	function(
		name,
		para
	)
{
	// FIXME, check why undefined paras are requested
	if( !para || para.path || !this.path ) return para;

	return para.create( 'path', this.path.append( 'twig' ).appendNC( name ) );
};


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


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
