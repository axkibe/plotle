/*
| The space form.
*/


var
	forms_form,
	forms_space,
	jools,
	root;


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
			'forms_space',
		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'jion.path',
						defaultValue :
							null
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Object', // FUTURE 'marks.*',
						concerns :
							{
								type :
									'forms_form',
								func :
									'concernsMark',
								args :
									[
										'mark',
										'path'
									]
							},
						defaultValue :
							undefined,
						allowsNull :
							true
					},
				path :
					{
						comment :
							'the path of the form',
						type :
							'jion.path',
						defaultValue :
							undefined
					},
				spaceUser :
					{
						comment :
							'the user of the current space',
						type :
							'String',
						defaultValue :
							undefined
					},
				spaceTag :
					{
						comment :
							'tag of the current space',
						type :
							'String',
						defaultValue :
							undefined
					},
				username :
					{
						comment :
							'currently logged in user',
						type :
							'String',
						defaultValue :
							null,
						assign :
							null
					},
				view :
					{
						comment :
							'the current view',
						type :
							'euclid.view',
						concerns :
							{
								member :
									'sizeOnly'
							},
						defaultValue :
							undefined
					}
			},
		subclass :
			'forms_form',
		init :
			[
				'inherit',
				'twigDup'
			],
		twig :
			'->form-widgets'
	};
}


/*
| The space form.
*/
forms_space.prototype._init =
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

		this.twig.headline =
			this.twig.headline.create(
				'text',
					this.spaceUser + ':' + this.spaceTag
			);
	}

	forms_form.init.call( this, inherit );
};


/*
| A button of the form has been pushed.
*/
forms_space.prototype.pushButton =
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

			root.setMode( 'Normal' );

			break;

		default :

			throw new Error( );
	}
};

} )( );
