/*
| A sequence of paragraphs.
*/
'use strict';


tim.define( module, 'fabric_doc', ( def, fabric_doc ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		path :
		{
			// the path of the doc
			type : [ 'undefined', 'jion$path' ]
		}
	};

	def.twig = [ 'fabric_para' ];

	def.init = [ 'twigDup' ];

	def.json = true;
}


/*
| Initializer.
*/
def.func._init =
	function(
		twigDup
	)
{
	const ranks = this._ranks;

	let twig = twigDup ? this._twig : tim.copy( this._twig );

	const twigPath = this.path && this.path.append( 'twig' );

	for( let r = 0, rZ = ranks.length; r < rZ; r++ )
	{
		const key = ranks[ r ];

		twig[ key ] =
			twig[ key ].create(
				'path', twigPath && twigPath.appendNC( key )
			);
	}

	if( FREEZE ) Object.freeze( twig );

	this._twig = twig;
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
