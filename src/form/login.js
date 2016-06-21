/*
| The login form.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'form_login',
		hasAbstract : true,
		attributes :
		{
			hover :
			{
				comment : 'the widget hovered upon',
				type : [ 'undefined', 'jion$path' ]
			},
			mark :
			{
				comment : 'the users mark',
				prepare : 'form_form.concernsMark( mark, path )',
				type :
					require( '../typemaps/visualMark' )
					.concat( [ 'undefined' ] )
			},
			path :
			{
				comment : 'the path of the form',
				type : [ 'undefined', 'jion$path' ]
			},
			spaceRef :
			{
				comment : 'the reference to the current space',
				type : [ 'undefined', 'fabric_spaceRef' ],
				assign : ''
			},
			user :
			{
				comment : 'currently logged in user',
				type : [ 'undefined', 'user_creds' ],
				assign : ''
			},
			view :
			{
				comment : 'the current view',
				type : [ 'undefined', 'euclid_view' ],
				prepare : 'view ? view.sizeOnly : view'
			}
		},
		init : [ 'twigDup' ],
		twig : require( '../typemaps/formWidgets' )
	};
}


var
	fabric_spaceRef,
	form_form,
	form_login,
	jion,
	user_creds,
	user_passhash,
	visual_mark_caret;


/*
| Capsule
*/
(function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;


prototype = form_login.prototype;


/*
| Initializer.
*/
prototype._init = form_form.init;


/*
| The attention center.
*/
jion.lazyValue(
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
	// FUTURE combine calls
	root.setPath( this.get( 'userInput' ).path.append( 'value' ), '' );

	root.setPath( this.get( 'passwordInput' ).path.append( 'value' ), '' );

	root.setPath( this.get( 'errorLabel' ).path.append( 'text' ), '' );

	root.create( 'mark', undefined );
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
jion.lazyValue( prototype, 'glint', form_form.glint );


/*
| The focused widget.
*/
jion.lazyValue(
	prototype,
	'focusedWidget',
	form_form.getFocusedWidget
);


/*
| User is inputing text.
*/
prototype.input = form_form.input;


/*
| Logins the user
*/
prototype.login =
	function( )
{
	var
		username,
		pass;

	username = this.get( 'userInput' ).value;

	pass = this.get( 'passwordInput' ).value;

	if( username.length < 4 )
	{
		this.setErrorMessage( 'Username too short, min. 4 characters' );

		root.create(
			'mark',
				visual_mark_caret.create(
					'path', this.get( 'userInput' ).path,
					'at', username.length
				)
		);

		return;
	}

	if( username.substr( 0, 5 ) === 'visit' )
	{
		this.setErrorMessage( 'Username must not start with "visit"' );

		root.create(
			'mark',
				visual_mark_caret.create(
					'path', this.get( 'userInput' ).path,
					'at', 0
				)
		);

		return;
	}

	if( pass.length < 5 )
	{
		this.setErrorMessage( 'Password too short, min. 5 characters' );

		root.create(
			'mark',
				visual_mark_caret.create(
					'path', this.get( 'passwordInput' ).path,
					'at', pass.length
				)
		);

		return;
	}

	root.link.auth(
		user_creds.create(
			'name', username,
			'passhash', user_passhash( pass )
		)
	);
};


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
| An auth ( login ) operation completed.
*/
prototype.onAuth =
	function(
		request,
		reply
	)
{
	var
		message,
		passwordInput,
		userInput;

	if( reply.reflect !== 'reply_auth' )
	{
		message = reply.message;

		this.setErrorMessage( message );

		if( message.search( /Username/ ) >= 0 )
		{
			userInput = this.get( 'userInput' );

			root.create(
				'mark',
					visual_mark_caret.create(
						'path', userInput.path,
						'at', userInput.value.length
					)
			);
		}
		else
		{
			passwordInput = this.get( 'passwordInput' );

			root.create(
				'mark',
					visual_mark_caret.create(
						'path', passwordInput.path,
						'at', passwordInput.value.length
					)
			);
		}

		return;
	}

	root.create( 'action', undefined, 'user', reply.user );

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
		case 'loginButton' :

			this.login( );

			break;

		case 'closeButton' :

			root.showHome( );

			break;

		default :

			throw new Error( );
	}
};


/*
| Sets the error message.
*/
prototype.setErrorMessage =
	function(
		message
	)
{
	root.setPath(
		this.get( 'errorLabel' ).path.append( 'text' ),
		message
	);
};


/*
| The disc is shown while a form is shown.
*/
prototype.showDisc = true;


/*
| User is pressing a special key.
*/
prototype.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	var
		caret;

	// a return in the password field is made
	// to be a login command right away

	if( key === 'enter' )
	{
		caret = this.mark.caret;

		if( caret && caret.path.get( 4 ) === 'passwordInput' )
		{
			this.login( );

			return;
		}
	}

	return form_form.specialKey.call( this, key, shift, ctrl );
};


} )( );
