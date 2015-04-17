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
	jion;


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
		id : 'form_nonExistingSpace',
		attributes :
		{
			hover :
			{
				comment : 'the widget hovered upon',
				type : 'jion$path',
				defaultValue : 'undefined'
			},
			mark :
			{
				comment : 'the users mark',
				type : require( '../typemaps/mark' ),
				prepare : 'form_form.concernsMark( mark, path )',
				defaultValue : 'undefined'
			},
			nonSpaceRef :
			{
				comment : 'the non-existing-space',
				type : 'fabric_spaceRef',
				defaultValue : 'undefined'
			},
			path :
			{
				comment : 'the path of the form',
				type : 'jion$path',
				defaultValue : 'undefined'
			},
			spaceRef :
			{
				comment : 'the reference to the current space',
				type : 'fabric_spaceRef',
				defaultValue : 'undefined',
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
		init : [ 'twigDup' ],
		twig : require( '../typemaps/formWidgets' )
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = form_nonExistingSpace.prototype;


/*
| The space does not exist form.
*/
prototype._init =
	function(
		twigDup
	)
{
	if( !this.path )
	{
		return;
	}

	if( !twigDup )
	{
		this.twig = jion.copy( this.twig );
	}

	this.twig.headline =
		this.twig.headline.create(
			'text',
				this.nonSpaceRef
				? this.nonSpaceRef.fullname + ' does not exist.'
				: ''
		);

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
| Draws a form.
*/
prototype.draw = form_form.draw;


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

	switch( buttonName )
	{
		case 'noButton' :

			root.showHome( );

			break;

		case 'yesButton' :

			root.moveToSpace( this.nonSpaceRef, true );

			root.create( 'mode', 'loading' );

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
| User is pressing a special key.
*/
prototype.specialKey = form_form.specialKey;


} )( );
