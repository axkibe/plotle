/*
| User has no access to a space s/he tried to port to.
*/


var
	forms_form,
	forms_noAccessToSpace,
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
			'forms_noAccessToSpace',
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
							null
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
			[ 'inherit' ],
		twig :
			'->form-widgets'
	};
}


/*
| The no access to space form.
*/
forms_noAccessToSpace.prototype._init =
	function(
		inherit
	)
{
	forms_form.init.call( this, inherit );
};


/*
| A button of the form has been pushed.
*/
forms_noAccessToSpace.prototype.pushButton =
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
		case 'okButton' :

			root.setMode( 'Normal' );

			break;

		default :

			throw new Error( );
	}
};


} )( );
