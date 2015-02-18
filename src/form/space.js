/*
| The space form.
*/


var
	form_form,
	form_space,
	jools;


/*
| Capsule
*/
(function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'form_space',
		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'jion_path',
						defaultValue :
							'null'
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'->mark',
						concerns :
							{
								type :
									'form_form',
								func :
									'concernsMark',
								args :
									[ 'mark', 'path' ]
							},
						defaultValue :
							'undefined',
						allowsNull :
							true
					},
				path :
					{
						comment :
							'the path of the form',
						type :
							'jion_path',
						defaultValue :
							'undefined'
					},
				spaceRef :
					{
						comment :
							'the reference to the current space',
						type :
							'fabric_spaceRef',
						defaultValue :
							'null'
					},
				username :
					{
						comment :
							'currently logged in user',
						type :
							'string',
						defaultValue :
							'null',
						assign :
							null
					},
				view :
					{
						comment :
							'the current view',
						type :
							'euclid_view',
						concerns :
							{
								member : 'sizeOnly'
							},
						defaultValue :
							'undefined'
					}
			},
		subclass :
			'form_form',
		init :
			[
				'inherit',
				'twigDup'
			],
		twig :
			'->formWidgets'
	};
}


/*
| The space form.
*/
form_space.prototype._init =
	function(
		inherit,
		twigDup
	)
{
	if( this.path )
	{
		if( !twigDup )
		{
			this.twig = jools.copy( this.twig );
		}

		if( this.spaceRef )
		{
			this.twig.headline =
				this.twig.headline.create(
					'text', this.spaceRef.fullname
				);
		}
	}

	form_form.init.call( this, inherit );
};


/*
| A button of the form has been pushed.
*/
form_space.prototype.pushButton =
	function(
		path
		// shift,
		// ctrl
	)
{
	var
		buttonName;

/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== this.reflectName )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	buttonName = path.get( 4 );

	switch( buttonName )
	{
		case 'closeButton' :

			root.create( 'mode', 'normal' );

			break;

		default :

			throw new Error( );
	}
};

} )( );
