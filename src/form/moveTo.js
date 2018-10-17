/*
| The moveTo or 'go' form.
*/
'use strict';


tim.define( module, ( def, form_moveTo ) => {


const form_form = require( './form' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gleam_transform = require( '../gleam/transform' );

const gruga_moveTo = require( '../gruga/moveTo' );

const gruga_scrollbar = require( '../gruga/scrollbar' );

const ref_space = require( '../ref/space' );

const widget_button = require( '../widget/button' );

const widget_scrollbox = require( '../widget/scrollbox' );


if( TIM )
{
	def.attributes =
	{
		// current action
		action : { type : [ '< ../action/types', 'undefined' ] },

		// the widget hovered upon
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		// the users mark
		mark : { type : [ '< ../visual/mark/types', 'undefined' ] },

		// the path of the form
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// the reference to the current space
		spaceRef : { type : 'undefined' },

		// currently logged in user
		user : { type : [ 'undefined', '../user/creds' ] },

		// list of spaces belonging to user
		userSpaceList : { type : [ 'undefined', '../ref/spaceList' ] },

		// current view size
		viewSize : { type : '../gleam/size' }
	};

	def.twig = [ '< ../widget/types' ];
}


/*
| Doesn't care about spaceRef.
*/
def.static.concernsSpaceRef =
def.func.concernsSpaceRef =
	( ) => undefined;


/*
| Distance to left side of screen.
*/
def.lazy._leftDistance = ( ) =>
	root.disc.get( 'mainDisc' ).size.width
	+ 20; // == left distance to disc


/*
| Width available to the form.
*/
def.lazy._availableWidth =
	function( )
{
	return this.viewSize.width - this._leftDistance - gruga_scrollbar.strength;
};


/*
| Number of columns used.
*/
def.lazy._cols =
	function( )
{
	return Math.floor( ( this._availableWidth + 30 ) / 160 );
};


/*
| Doesn't care about spaceRef.
*/
def.static.concernsSpaceRef =
def.func.concernsSpaceRef =
	( ) => undefined;


/*
| Number of rows used.
*/
def.lazy._rows =
	function( )
{
	const userSpaceList = this.userSpaceList;

	if( !userSpaceList ) return 0;

	return Math.ceil( userSpaceList.length / this._cols );
};


/*
| Transforms the scrollbox.
*/
def.func._transformScrollbox =
	function(
		sb       // the scrollbox widget
	)
{
	const sbRanks = [ 'linkloom:home', 'linkloom:sandbox' ];

	const sbTwig =
	{
		'linkloom:home'    : sb.get( 'linkloom:home' ),
		'linkloom:sandbox' : sb.get( 'linkloom:sandbox' )
	};

	// cols in current row
	let cLen = this._cols;

	// buttons are in the scrollbox
	let button = sbTwig[ 'linkloom:home' ];

	sbTwig[ 'linkloom:home' ] =
		button.create(
			'zone',
				button.zone.create(
					'pos', gleam_point.xy( 160 * ( this._cols - 2 ) / 2, 0 )
				)
		);

	button = sbTwig[ 'linkloom:sandbox' ];

	sbTwig[ 'linkloom:sandbox' ] =
		button.create(
			'zone',
				button.zone.create(
					'pos', gleam_point.xy( 160 * ( this._cols ) / 2, 0 )
				)
		);

	let sbPath = this.path.append( 'twig' ).append( 'scrollbox' );

	if( this.userSpaceList )
	{
		let c = 0; // current column

		let cOff = 0; // column offset (for last row)

		let r = 1; // current row

		for( let a = 0, aZ = this.userSpaceList.length; a < aZ; a++ )
		{
			if( r >= this._rows )
			{
				cLen = aZ % this._cols;

				if( cLen === 0 ) cLen = this._cols;

				cOff = ( this._cols - cLen ) / 2;
			}

			const rSpace = this.userSpaceList.get( a );

			const fullname = rSpace.fullname;

			button = this._twig[ fullname ];

			if( !button )
			{
				button =
					widget_button.createFromLayout(
						gruga_moveTo.spaceButtonLayout,
						sbPath.append( 'twig' ).append( fullname ),
						gleam_transform.normal
					);
			}

			sbRanks.push( fullname );

			sbTwig[ fullname ] =
				button.create(
					'text', rSpace.username + '\n' + rSpace.tag,
					'zone',
						button.zone.create(
							'pos', gleam_point.xy( 160 * ( cOff + c ), 160 * r )
						)
				);

			if( ++c >= this._cols ) { c = 0; r++; }
		}
	}

	const cy = this.get( 'headline' ).pos.y + 50;

	const zone =
		gleam_rect.create(
			'pos', gleam_point.xy( this._leftDistance, cy ),
			'width', this._availableWidth + gruga_scrollbar.strength,
			'height', this.viewSize.height - cy
		);

	return(
		sb.create(
			'path', sbPath,
			'scrollbarYOffset', form_moveTo.scrollbarYOffset,
			'scrollPos', widget_scrollbox.prepareScrollPos( sb.scrollPos, sb.innerSize, zone ),
			'twig:init', sbTwig, sbRanks,
			'zone', zone
		)
	);
};


/*
| Transforms the headline.
*/
def.func._transformHeadline =
	function(
		headline   // the headline widget
	)
{
	// content height
	const ch = headline.font.size * 2 + 160 + this._rows * 160;

	// if below minimum content is no longer vertical centered and scrolling is needed.
	const y = Math.max( this.viewSize.height / 2 - ch / 2, 10 + headline.font.size );

	return(
		headline.create(
			'pos', gleam_point.xy( this._leftDistance + ( this._cols - 0.5 ) * 80 + 30, y )
		)
	);
};


/*
| Transforms widgets.
*/
def.transform.get =
	function(
		name,
		widget
	)
{
	switch( name )
	{
		case 'headline' : widget = this._transformHeadline( widget ); break;

		case 'scrollbox' : widget = this._transformScrollbox( widget ); break;
	}

	return form_form.transformGet.call( this, name, widget );
};


/*
| Offset of the vertical scrollbar, set so it's within the scrollbox.
*/
def.staticLazy.scrollbarYOffset =
	function( )
{
	return(
		gleam_point.xy(
			Math.ceil( -gruga_scrollbar.strength / 2 ) - 1,
			0
		)
	);
};


/*
| The attention center.
*/
def.lazy.attentionCenter = form_form.getAttentionCenter;


/*
| User clicked.
*/
def.func.click = form_form.click;


/*
| Cycles the focus.
*/
def.func.cycleFocus = form_form.cycleFocus;


/*
| The form's glint.
*/
def.lazy.glint = form_form.glint;


/*
| The focused widget.
*/
def.lazy.focusedWidget = form_form.getFocusedWidget;


/*
| Moving during an operation with the mouse button held down.
*/
def.func.dragMove = form_form.dragMove;


/*
| Starts an operation with the pointing device active.
|
| Mouse down or finger on screen.
*/
def.func.dragStart = form_form.dragStart;


/*
| Stops an operation with the mouse button held down.
*/
def.func.dragStop = form_form.dragStop;


/*
| User is inputing text.
*/
def.func.input = form_form.input;


/*
| Mouse wheel.
*/
def.func.mousewheel = form_form.mousewheel;


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
/**/	if( path.get( 2 ) !== 'moveTo' ) throw new Error( );
/**/}

	const buttonName = path.get( -1 );

	const parts = buttonName.split( ':' );

	root.moveToSpace(
		ref_space.create( 'username', parts[ 0 ], 'tag',  parts[ 1 ] ),
		false
	);
};


/*
| The disc is shown while a form is shown.
*/
def.func.showDisc = true;


/*
| User is pressing a special key.
*/
def.func.specialKey = form_form.specialKey;


} );

