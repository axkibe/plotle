/*
| The signup form.
*/


/*
| Imports
*/
var
	fabric_spaceRef,
	form_form,
	form_signUp,
	jools,
	mark_caret,
	user_creds;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'form_signUp',
		attributes :
			{
				hover :
				{
					comment : 'the widget hovered upon',
					type : 'jion_path',
					defaultValue : 'undefined'
				},
				mark :
				{
					comment : 'the users mark',
					type : '->mark',
					prepare : 'form_form.concernsMark( mark, path )',
					defaultValue : 'undefined'
				},
				path :
				{
					comment : 'the path of the form',
					type : 'jion_path',
					defaultValue : 'undefined'
				},
				spaceRef :
				{
					comment : 'the reference to the current space',
					type : 'fabric_spaceRef',
					defaultValue : 'null',
					assign : ''
				},
				user :
				{
					comment : 'currently logged in user',
					type : 'user_creds',
					defaultValue : 'undefined',
					assign : ''
				},
				view :
				{
					comment : 'the current view',
					type : 'euclid_view',
					prepare : 'view ? view.sizeOnly : view',
					defaultValue : 'undefined'
				}
			},
		init : [ 'inherit' ],
		twig : '->formWidgets'
	};
}


var
	prototype;

prototype = form_signUp.prototype;


/*
| The signup form.
*/
prototype._init =
	function(
		inherit
	)
{
	form_form.init.call( this, inherit );
};


/*
| The attention center.
*/
jools.lazyValue(
	prototype,
	'attentionCenter',
	form_form.getAttentionCenter
);


/*
| Clears all fields.
*/
prototype.clear =
	function( )
{
	var
		twig;

	twig = this.twig;

	// FIXME make this in one call, somehow

	root.setPath( twig.userInput.path.append( 'value' ), '' );

	root.setPath( twig.emailInput.path.append( 'value' ), '' );

	root.setPath( twig.passwordInput.path.append( 'value' ), '' );

	root.setPath( twig.password2Input.path.append( 'value' ), '' );

	root.setPath( twig.newsletterCheckBox.path.append( 'checked' ), true );

	root.setPath( this.path.append( 'twig' ).append( 'errorLabel' ).append( 'text' ), '' );

	root.create( 'mark', null );
};


/*
| User clicked.
*/
prototype.click = form_form.click;


/*
| Cycles the focus.
*/
prototype.cycleFocus = form_form.cycleFocus;


/*
| Moving during an operation with the mouse button held down.
*/
prototype.dragMove =
	function(
		// p
		// shift,
		// ctrl
	)
{
	return true;
};


/*
| Starts an operation with the pointing device active.
|
| Mouse down or finger on screen.
*/
prototype.dragStart =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return false;
};


/*
| Stops an operation with the mouse button held down.
*/
prototype.dragStop =
	function(
		//p,
		//shift,
		//ctrl
	)
{
	return true;
};


/*
| Draws a form.
*/
prototype.draw = form_form.draw;


/*
| The focused widget.
*/
jools.lazyValue(
	prototype,
	'focusedWidget',
	form_form.getFocusedWidget
);


/*
| User is inputing text.
*/
prototype.input = form_form.input;


/*
| Mouse wheel.
*/
prototype.mousewheel =
	function(
		// p,
		// dir,
		// shift,
		// ctrl
	)
{
	return true;
};


/*
| A register operation completed.
*/
prototype.onRegister =
	function(
		ok,
		user,
		message
	)
{
	var
		twig;

	twig = this.twig;

	if( !ok )
	{
		root.setPath(
			this.path
			.append( 'twig' )
			.append( 'errorLabel' )
			.append( 'text' ),
			message
		);

		if( message.search( /Username/ ) >= 0 )
		{
			root.create(
				'mark',
					mark_caret.create(
						'path', twig.userInput.path,
						'at', twig.userInput.value.length
					)
			);
		}

		return;
	}

	root.create(
		'mode', 'welcome',
		'user', user
	);

	this.clear( );

	root.moveToSpace( fabric_spaceRef.ideoloomHome, false );
};


/*
| If point is on the form returns its hovering state.
*/
prototype.pointingHover = form_form.pointingHover;


/*
| A button of the form has been pushed.
*/
prototype.pushButton =
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
		case 'signupButton' :

			this.signup( );

			break;

		case 'closeButton' :

			root.showHome( );

			break;

		default :

			throw new Error( );
	}
};


/*
| The disc is shown while a form is shown.
*/
prototype.showDisc = true;


/*
| Signs a new user up
*/
prototype.signup =
	function( )
{
	var
		twig,
		username,
		email,
		pass,
		pass2,
		newsletter;

	twig = this.twig;

	username = twig.userInput.value;

	email = twig.emailInput.value;

	pass = twig.passwordInput.value;

	pass2 = twig.password2Input.value;

	newsletter = twig.newsletterCheckBox.checked;


	if( username.length < 4 )
	{
		root.setPath(
			this.path
			.append( 'twig' )
			.append( 'errorLabel' )
			.append( 'text' ),
			'Username too short, min. 4 characters'
		);

		root.create(
			'mark',
				mark_caret.create(
					'path', twig.userInput.path,
					'at', username.length
				)
		);

		return;
	}

	if( username.substr( 0, 5 ) === 'visit' )
	{
		root.setPath(
			this.path
			.append( 'twig' )
			.append( 'errorLabel' )
			.append( 'text' ),
			'Username must not start with "visit"'
		);

		root.create(
			'mark',
				mark_caret.create(
					'path', twig.userInput.path,
					'at', 0
				)
		);

		return;
	}

	if( pass.length < 5 )
	{
		root.setPath(
			this.path
			.append( 'twig' )
			.append( 'errorLabel' )
			.append( 'text' ),
			'Password too short, min. 5 characters'
		);

		root.create(
			'mark',
				mark_caret.create(
					'path', twig.passwordInput.path,
					'at', pass.length
				)
		);

		return;
	}

	if( pass !== pass2 )
	{
		root.setPath(
			this.path
			.append( 'twig' )
			.append( 'errorLabel' )
			.append( 'text' ),
			'Passwords do not match'
		);

		root.create(
			'mark',
				mark_caret.create(
					'path', twig.password2Input.path,
					'at', pass2.length
				)
		);

		return;
	}

	root.link.register(
		user_creds.create(
			'name', username,
			'passhash', jools.passhash( pass )
		),
		email,
		newsletter
	);
};


/*
| User is pressing a special key.
*/
prototype.specialKey = form_form.specialKey;


} )( );
