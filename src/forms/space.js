/*
| The space form.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	forms;

forms = forms || { };


/*
| Imports
*/
var
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
		name :
			'Space',
		unit :
			'forms',
		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'path',
						defaultValue :
							null
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Mark',
						concerns :
							{
								unit :
									'forms',
								type :
									'form',
								func :
									'concernsMark',
								args :
									[
										'mark',
										'path'
									]
							},
						defaultValue :
							undefined
					},
				path :
					{
						comment :
							'the path of the form',
						type :
							'path',
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
			'forms.form',
		init :
			[
				'inherit',
				'twigDup'
			],
		twig :
			'form-widgets'
	};
}


var
	Space;

Space = forms.Space;


/*
| The space form.
*/
Space.prototype._init =
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

	forms.form.init.call(
		this,
		inherit
	);
};


/*
| A button of the form has been pushed.
*/
Space.prototype.pushButton =
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
/**/	if( path.get( 2 ) !== this.reflexName )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	buttonName = path.get( 4 );

	switch( buttonName )
	{
		case 'closeButton' :

			shell.setMode( 'Normal' );

			break;

		default :

			throw new Error( );
	}
};

} )( );
