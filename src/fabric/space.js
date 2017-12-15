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
		path :
		{
			comment : 'the path of the space',
			type : [ 'undefined', 'tim$path' ]
		},
		ref :
		{
			comment : 'reference to this space',
			type : [ 'undefined', 'ref_space' ]
		}
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
		this.path = tim.path.empty.append( 'space' );
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

