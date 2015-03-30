/*
| User has no access to a space s/he tried to port to.
|
| FIXME it doesn't anymore show the headline what wasnt possible.
*/


var
	form_form,
	form_noAccessToSpace,
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
		id : 'form_noAccessToSpace',
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

prototype = form_noAccessToSpace.prototype;


/*
| Initializer.
*/
prototype._init = form_form.init;


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

	switch( buttonName )
	{
		case 'okButton' :

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


} )( );
