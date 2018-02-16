/*
| A space.
*/
'use strict';


tim.define( module, 'fabric_space', ( def, fabric_space ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// the path of the space
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// reference to this space
		ref : { type : [ 'undefined', 'ref_space' ] },
	};

	def.twig =
	[
		'fabric_note',
		'fabric_label',
		'fabric_relation',
		'fabric_portal'
	];

	def.json = true;

	def.init = [ 'inherit', 'twigDup' ];
}


const tim_path = tim.import( 'tim.js', 'path' );


/*
| Initializer.
*/
def.func._init =
	function(
		inherit,
		twigDup
	)
{
	if( !this.path )
	{
		this.path = tim_path.empty.append( 'space' );
	}

	const twig = twigDup ? this._twig : tim.copy( this._twig );

	for( let k in twig )
	{
		let path = twig[ k ].path;

		if( !path ) path = this.path.append( 'twig' ).appendNC( k );

		twig[ k ] = twig[ k ].create( 'path', path );
	}

	if( FREEZE ) Object.freeze( twig );

	this._twig = twig;
};


} );

