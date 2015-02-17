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
	form_form,
	form_nonExistingSpace,
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
			'form_nonExistingSpace',
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
							'null'
					},
				nonSpaceRef :
					{
						comment :
							'the non-existing-space',
						type :
							'fabric_spaceRef',
						defaultValue :
							'undefined'
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
							'undefined',
						assign :
							null
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
| The space does not exist form.
*/
form_nonExistingSpace.prototype._init =
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

	form_form.init.call( this, inherit );
};


/*
| A button of the form has been pushed.
*/
form_nonExistingSpace.prototype.pushButton =
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

			root.create( 'mode', 'Normal' );

			break;

		case 'yesButton' :

			root.moveToSpace( this.nonSpaceRef, true );

			root.create( 'mode', 'Normal' );

			break;

		default :

			throw new Error( );
	}
};

} )( );
