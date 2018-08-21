/*
| The signup form.
*/
'use strict';


tim.define( module, ( def ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.hasAbstract = true;

	def.attributes =
	{
		// current action
		action : { type : [ '< ../action/types', 'undefined' ] },

		// the widget hovered upon
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		mark :
		{
			// the users mark
			type : [ '< ../visual/mark/types', 'undefined' ],
			prepare : 'self.concernsMark( mark, path )'
		},

		// the path of the form
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// the reference to the current space
		spaceRef : { type : [ 'undefined', '../ref/space' ], assign : '' },

		// currently logged in user
		user : { type : [ 'undefined', '../user/creds' ], assign : '' },

		// list of spaces belonging to user
		userSpaceList : { type : [ 'undefined', '../ref/spaceList' ], assign : '' },

		// current view size
		viewSize : { type : '../gleam/size' },
	};

	def.twig = [ '< ../widget/types' ];
}


const form_form = require( './form' );

const ref_space = require( '../ref/space' );

const reply_error = require( '../reply/error' );

const show_form= require( '../show/form' );

const user_creds = require( '../user/creds' );

const user_passhash = require( '../user/passhash' );

const visual_mark_caret = require( '../visual/mark/caret' );


def.func._transform = form_form.transform;


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


def.static.concernsMark = form_form.concernsMark;


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
	// FUTURE make this in one call, somehow

	root.setPath( this.get( 'userInput' ).path.append( 'value' ), '' );

	root.setPath( this.get( 'emailInput' ).path.append( 'value' ), '' );

	root.setPath( this.get( 'passwordInput' ).path.append( 'value' ), '' );

	root.setPath( this.get( 'password2Input' ).path.append( 'value' ), '' );

	root.setPath(
		this.get( 'newsletterCheckBox' ).path.append( 'checked' ), true
	);

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
| A register operation completed.
*/
def.func.onRegister =
	function(
		request,
		reply
	)
{
	if( reply.timtype === reply_error )
	{
		const message = reply.message;

		root.setPath(
			this.get( 'errorLabel' ).path.append( 'text' ),
			message
		);

		const userInput = this.get( 'userInput' );

		if( message.search( /Username/ ) >= 0 )
		{
			root.create(
				'mark',
					visual_mark_caret.create(
						'path', userInput.path,
						'at', userInput.value.length
					)
			);
		}

		return;
	}

	this.clear( );

	root.moveToSpace( ref_space.linkloomHome, false );

	root.create( 'show', show_form.welcome, 'userCreds', request.userCreds );
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
/**/	if( path.get( 2 ) !== 'signUp' ) throw new Error( );
/**/}

	const buttonName = path.get( 4 );

	switch( buttonName )
	{
		case 'signupButton' : this.signup( ); break;

		case 'closeButton' : root.showHome( ); break;

		default : throw new Error( );
	}
};


/*
| The disc is shown while a form is shown.
*/
def.func.showDisc = true;


/*
| Sets the error message.
*/
def.func.setErrorMessage =
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
| Signs a new user up
*/
def.func.signup =
	function( )
{
	const username = this.get( 'userInput' ).value;

	const email = this.get( 'emailInput' ).value;

	const pass = this.get( 'passwordInput' ).value;

	const pass2 = this.get( 'password2Input' ).value;

	const newsletter = this.get( 'newsletterCheckBox' ).checked;

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

	if( pass !== pass2 )
	{
		this.setErrorMessage( 'Passwords do not match' );

		root.create(
			'mark',
				visual_mark_caret.create(
					'path', this.get( 'password2Input' ).path,
					'at', pass2.length
				)
		);

		return;
	}

	root.link.register(
		user_creds.create(
			'name', username,
			'passhash', user_passhash.calc( pass )
		),
		email,
		newsletter
	);
};


/*
| User is pressing a special key.
*/
def.func.specialKey = form_form.specialKey;


} );

