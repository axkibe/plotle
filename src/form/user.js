/*
| The user form.
*/


var
	form_form,
	form_user,
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
		id : 'form_user',
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
		twig : '->formWidgets'
	};
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
		isVisitor;

	if( !this.path )
	{
		return;
	}

	isVisitor = this.user ? this.user.isVisitor : true;

	if( !twigDup )
	{
		this.twig = jools.copy( this.twig );
	}

	this.twig.headline =
		this.twig.headline.create(
			'text', 'hello ' + ( this.user ? this.user.name : '' )
		);

	this.twig.visitor1 =
		this.twig.visitor1.create( 'visible', isVisitor );

	this.twig.visitor2 =
		this.twig.visitor2.create( 'visible', isVisitor );

	this.twig.visitor3 =
		this.twig.visitor3.create( 'visible', isVisitor );

	this.twig.visitor4 =
		this.twig.visitor4.create( 'visible', isVisitor );

	this.twig.greeting1 =
		this.twig.greeting1.create( 'visible', !isVisitor );

	this.twig.greeting2 =
		this.twig.greeting2.create( 'visible', !isVisitor );

	this.twig.greeting3 =
		this.twig.greeting3.create( 'visible', !isVisitor );

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
jools.lazyValue(
	prototype,
	'focusedWidget',
	form_form.getFocusedWidget
);


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

