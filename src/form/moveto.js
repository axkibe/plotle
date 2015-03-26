/*
| The move to form.
|
| FIXME rename moveto
*/


var
	fabric_spaceRef,
	form_form,
	form_moveTo,
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
		id :
			'form_moveTo',
		attributes :
			{
				hover :
					{
						comment : 'the widget hovered upon',
						type : 'jion_path',
						defaultValue : 'null'
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
						assign : null
					},
				username :
					{
						comment : 'currently logged in user',
						type : 'string',
						defaultValue : 'null'
					},
				view :
					{
						comment : 'the current view',
						type : 'euclid_view',
						prepare : 'view ? view.sizeOnly : view',
						defaultValue : 'undefined'
					}
			},
		init :
			[ 'inherit', 'twigDup' ],
		twig :
			'->formWidgets'
	};
}


var
	prototype;

prototype = form_moveTo.prototype;


/*
| The moveto form.
*/
prototype._init =
	function(
		inherit,
		twigDup
	)
{
	var
		isGuest;

	if( this.path )
	{
		isGuest =
			this.username === null
			?  false
			: this.username.substr( 0, 7 ) === 'visitor';

		if( !twigDup )
		{
			this.twig = jools.copy( this.twig );
		}

		this.twig.userHomeButton =
			this.twig.userHomeButton.create(
				'visible', !isGuest,
				'text', this.username + '\n' + 'home'
			);
	}

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

	root.create( 'mode', 'loading' );

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
					'username', this.username,
					'tag', 'home'
				),
				false
			);

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

