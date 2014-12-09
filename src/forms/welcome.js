/*
| The welcome form.
|
| Shown only after successfully signing up.
*/


var
	forms_form,
	forms_welcome,
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
			'forms_welcome',
		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'jion_path',
						defaultValue :
							null
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Object', // FUTURE 'marks_.*',
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
				path :
					{
						comment :
							'the path of the form',
						type :
							'jion_path',
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
			[ 'inherit', 'twigDup' ],
		twig :
			'->form-widgets'
	};
}


var
	welcome;

welcome = forms_welcome;


/*
| The welcome form.
*/
welcome.prototype._init =
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
			'text', 'welcome ' + ( this.username || '' ) + '!'
		);

	forms_form.init.call( this, inherit );
};


/*
| A button of the form has been pushed.
*/
welcome.prototype.pushButton =
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
