/*
| The move to form.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'form_moveTo',
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
				type :
					require( '../typemaps/visualMark' )
					.concat( [ 'undefined' ] ),
				prepare : 'form_form.concernsMark( mark, path )'
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
				type : [ 'undefined', 'user_creds' ]
			},
			viewSize :
			{
				comment : 'current view size',
				type : 'euclid_size'
			}
		},
		init : [ 'twigDup' ],
		twig : require( '../typemaps/formWidgets' )
	};
}


var
	action_form,
	fabric_spaceRef,
	form_form,
	form_moveTo,
	jion;


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

prototype = form_moveTo.prototype;


/*
| The moveto form.
*/
prototype._init =
	function(
		twigDup
	)
{
	var
		twig;

	if( !this.path ) return;

	twig = twigDup ? this._twig : jion.copy( this._twig );

	twig.userHomeButton =
		twig.userHomeButton.create(
			'visible', this.user ? !this.user.isVisitor : false,
			'text', this.user ? this.user.name + '\n' + 'home' : ''
		);

	this._twig = twig;

	form_form.init.call( this, twigDup );
};


/*
| The attention center.
*/
jion.lazyValue(
	prototype,
	'attentionCenter',
	form_form.getAttentionCenter
);


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
| The form's glint.
*/
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

	root.create( 'action', action_form.loading );

	switch( buttonName )
	{
		case 'ideoloomHomeButton' :

			root.moveToSpace( fabric_spaceRef.ideoloomHome, false );

			break;

		case 'ideoloomSandboxButton' :

			root.moveToSpace( fabric_spaceRef.ideoloomSandbox, false );

			break;

		case 'userHomeButton' :

			root.moveToSpace(
				fabric_spaceRef.create(
					'username', this.user.name,
					'tag', 'home'
				),
				false
			);

			break;

		default : throw new Error( );
	}
};


/*
| The disc is shown while a form is shown.
*/
prototype.showDisc = true;


/*
| User is pressing a special key.
*/
prototype.specialKey = form_form.specialKey;


})( );

