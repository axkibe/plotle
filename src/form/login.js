/*
| The login form.
*/
'use strict';


// FIXME
var
	form_form,
	ref_space,
	reply_auth,
	user_creds,
	user_passhash,
	visual_mark_caret;


tim.define( module, 'form_login', ( def, form_login ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.id = 'form_login',

	def.hasAbstract = true;

	def.attributes =
	{
		action :
		{
			// current action
			type :
				require( '../action/typemap' )
				.concat( [ 'undefined' ] )
		},
		hover :
		{
			// the widget hovered upon
			type : [ 'undefined', 'tim$path' ]
		},
		mark :
		{
			// the users mark
			prepare : 'form_form.concernsMark( mark, path )',
			type :
				require( '../visual/mark/typemap' )
				.concat( [ 'undefined' ] )
		},
		path :
		{
			// the path of the form
			type : [ 'undefined', 'tim$path' ]
		},
		spaceRef :
		{
			// the reference to the current space
			type : [ 'undefined', 'ref_space' ],
			assign : ''
		},
		user :
		{
			// currently logged in user
			type : [ 'undefined', 'user_creds' ],
			assign : ''
		},
		userSpaceList :
		{
			// list of spaces belonging to user
			type : [ 'undefined', 'ref_spaceList' ],
			assign : ''
		},
		viewSize :
		{
			// current view size
			type : 'gleam_size'
		}
	};

	def.init = [ 'twigDup' ];

	def.twig = require( '../form/typemap-widget' );
}


if( NODE )
{
	form_form = require( './form' );
}


/*
| Initializer.
*/
def.func._init = form_form.init;


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| The attention center.
*/
def.lazy.attentionCenter = form_form.getAttentionCenter;


/*
| The form's glint.
*/
def.lazy.glint = form_form.glint;


/*
| The focused widget.
*/
def.lazy.focusedWidget = form_form.getFocusedWidget;


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Clears all fields.
*/
def.func.clear =
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
def.func.click = form_form.click;


/*
| Cycles the focus.
*/
def.func.cycleFocus = form_form.cycleFocus;


/*
| Moving during an operation with the mouse button held down.
*/
def.func.dragMove =
	function(
		p,
		shift,
		ctrl
	)
{
	return;
};


/*
| Starts an operation with the pointing device active.
|
| Mouse down or finger on screen.
*/
def.func.dragStart =
	function(
		p,
		shift,
		ctrl
	)
{
	return false;
};


/*
| Stops an operation with the mouse button held down.
*/
def.func.dragStop =
	function(
		p,
		shift,
		ctrl
	)
{
	return true;
};


/*
| User is inputing text.
*/
def.func.input = form_form.input;


/*
| Logins the user
*/
def.func.login =
	function( )
{
	const username = this.get( 'userInput' ).value;

	const pass = this.get( 'passwordInput' ).value;

	if( username.length < 4 )
	{
		this._setErrorMessage( 'Username too short, min. 4 characters' );

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
		this._setErrorMessage( 'Username must not start with "visit"' );

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
		this._setErrorMessage( 'Password too short, min. 5 characters' );

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
			'passhash', user_passhash.calc( pass )
		)
	);
};


/*
| Mouse wheel.
*/
def.func.mousewheel =
	function(
		p,
		dir,
		shift,
		ctrl
	)
{
	return true;
};


/*
| An auth ( login ) operation completed.
*/
def.func.onAuth =
	function(
		reply
	)
{
	if( reply.timtype !== reply_auth )
	{
		const message = reply.message;

		this._setErrorMessage( message );

		if( message.search( /Username/ ) >= 0 )
		{
			const userInput = this.get( 'userInput' );

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
			const passwordInput = this.get( 'passwordInput' );

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

	root.create( 'action', undefined, 'userCreds', reply.userCreds );

	this.clear( );

	root.moveToSpace( ref_space.ideoloomHome, false );
};


/*
| If point is on the form returns its hovering state.
*/
def.func.pointingHover = form_form.pointingHover;


/*
| A button of the form has been pushed.
*/
def.func.pushButton =
	function(
		path,
		shift,
		ctrl
	)
{
/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== 'login' ) throw new Error( );
/**/}

	const buttonName = path.get( 4 );

	switch( buttonName )
	{
		case 'loginButton' : this.login( ); break;

		case 'closeButton' : root.showHome( ); break;

		default : throw new Error( );
	}
};


/*
| Sets the error message.
*/
def.func._setErrorMessage =
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
def.func.showDisc = true;


/*
| User is pressing a special key.
*/
def.func.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	// a return in the password field is made
	// to be a login command right away

	if( key === 'enter' )
	{
		const caret = this.mark.caret;

		if( caret && caret.path.get( 4 ) === 'passwordInput' )
		{
			this.login( );

			return;
		}
	}

	return form_form.specialKey.call( this, key, shift, ctrl );
};


} );
