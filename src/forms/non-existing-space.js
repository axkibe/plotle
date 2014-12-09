/*
| User has no access to a space he tried to port to.
|
| FIXME spaceUser and spaceTag are phony
|       yet are not looked at by jion
*/


/*
| Imports
*/
var
	forms_form,
	forms_nonExistingSpace,
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
			'forms_nonExistingSpace',
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
									[ 'mark', 'path' ]
							},
						defaultValue :
							null
					},
				nonSpaceRef :
					{
						comment :
							'the non-existing-space',
						type :
							'fabric_spaceRef',
						defaultValue :
							undefined
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
							undefined,
						assign :
							null
					},
				spaceTag :
					{
						comment :
							'tag of the current space',
						type :
							'String',
						defaultValue :
							undefined,
						assign :
							null
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
							'euclid_view',
						concerns :
							{
								member : 'sizeOnly'
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
| The space does not exist form.
*/
forms_nonExistingSpace.prototype._init =
	function(
		inherit,
		twigDup
	)
{
	if( !this.path )
	{
		return;
	}

	if( !twigDup )
	{
		this.twig = jools.copy( this.twig );
	}

	this.twig.headline =
		this.twig.headline.create(
			'text',
				this.nonSpaceRef
				? this.nonSpaceRef.fullname + ' does not exist.'
				: ''
		);

	forms_form.init.call( this, inherit );
};


/*
| A button of the form has been pushed.
*/
forms_nonExistingSpace.prototype.pushButton =
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
		case 'noButton' :

			root.setMode( 'Normal' );

			break;

		case 'yesButton' :

			root.moveToSpace( this.nonSpaceRef, true );

			root.setMode( 'Normal' );

			break;

		default :

			throw new Error( );
	}
};

} )( );
