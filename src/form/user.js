/*
| The user form.
*/


var
	form_form,
	form_user,
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
		id : 'form_user',
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
				defaultValue : 'undefined'
			},
			view :
			{
				comment : 'the current view',
				type : 'euclid_view',
				prepare : 'view ? view.sizeOnly : view',
				defaultValue : 'undefined'
			}
		},
		init : [ 'inherit', 'twigDup' ],
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

prototype = form_user.prototype;


/*
| Initializer.
*/
prototype._init =
	function(
		inherit,
		twigDup
	)
{
	var
		isVisitor,
		twig;

	if( !this.path ) return;

	isVisitor = this.user ? this.user.isVisitor : true;

	twig =
		twigDup ?
		this._twig
		: jion.copy( this._twig );

	twig.headline =
		twig.headline.create(
			'text', 'hello ' + ( this.user ? this.user.name : '' )
		);

	twig.visitor1 = twig.visitor1.create( 'visible', isVisitor );

	twig.visitor2 = twig.visitor2.create( 'visible', isVisitor );

	twig.visitor3 = twig.visitor3.create( 'visible', isVisitor );

	twig.visitor4 = twig.visitor4.create( 'visible', isVisitor );

	twig.greeting1 = twig.greeting1.create( 'visible', !isVisitor );

	twig.greeting2 = twig.greeting2.create( 'visible', !isVisitor );

	twig.greeting3 = twig.greeting3.create( 'visible', !isVisitor );

	if( FREEZE )
	{
		Object.freeze( twig );
	}

	this.twig = twig; // FIXME
	this._twig = twig;

	form_form.init.call( this, inherit );
};


/*
| The attention center.
*/
jion.lazyValue( prototype, 'attentionCenter', form_form.getAttentionCenter );


/*
| User clicked.
*/
prototype.click = form_form.click;


/*
| Cycles the focus.
*/
prototype.cycleFocus = form_form.cycleFocus;


/*
| The focused widget.
*/
jion.lazyValue( prototype, 'focusedWidget', form_form.getFocusedWidget );


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
| User is pressing a special key.
*/
prototype.specialKey = form_form.specialKey;


})( );

