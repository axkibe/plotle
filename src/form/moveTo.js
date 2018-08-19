/*
| The moveTo or 'go' form.
*/
'use strict';


tim.define( module, ( def, form_moveTo ) => {


const form_form = require( './form' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gleam_transform = require( '../gleam/transform' );

const gruga_mainDisc = require( '../gruga/mainDisc' );

const gruga_moveTo = require( '../gruga/moveTo' );

const gruga_scrollbar = require( '../gruga/scrollbar' );

const ref_space = require( '../ref/space' );


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

		// the users mark
		mark :
		{
			type : [ '< ../visual/mark/types', 'undefined' ],
			prepare : 'self.concernsMark( mark, path )'
		},

		// the path of the form
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// the reference to the current space
		spaceRef : { type : [ 'undefined', '../ref/space' ], assign : '' },

		// currently logged in user
		user : { type : [ 'undefined', '../user/creds' ] },

		// list of spaces belonging to user
		userSpaceList : { type : [ 'undefined', '../ref/spaceList' ] },

		// current view size
		viewSize : { type : '../gleam/size' }
	};

	def.init = [ 'twigDup' ];

	def.twig = [ '< ../widget/types' ];
}


/*
| Initializer.
*/
def.func._init =
	function(
		twigDup
	)
{
	if( !this.path ) return;

	const sb = this._twig.scrollbox;

	const sbRanks = [ 'linkloom:home', 'linkloom:sandbox' ];

	const sbTwig = {
		'linkloom:home'    : sb.get( 'linkloom:home' ),
		'linkloom:sandbox' : sb.get( 'linkloom:sandbox' )
	};

	const userSpaceList = this.userSpaceList;

	const twig = twigDup ? this._twig : tim.copy( this._twig );

	// disc width
	const dw =
		root
		? root.disc.get( 'mainDisc' ).size.width
		: gruga_mainDisc.layout.size.width;

	const discDistance = 20;

	// available width
	const avw = this.viewSize.width - dw - discDistance - gruga_scrollbar.strength;

	const x0 = dw + discDistance;

	const vh = this.viewSize.height;

	const cols = Math.floor( ( avw + 30 ) / 160 );

	// cols in current row
	let cLen = cols;

	const rows =
		userSpaceList
		? Math.ceil( userSpaceList.length / cols )
		: 0;

	// content height
	const ch = twig.headline.font.size * 2 + 160 + rows * 160;

	let cy = vh / 2 - ch / 2;

	const y0 = 10 + twig.headline.font.size;

	// no longer vertical centered and need to start scrolling
	if( cy < y0 ) cy = y0;

	twig.headline =
		twig.headline.create(
			'pos', gleam_point.xy( x0 + ( cols - 0.5 ) * 80 + 30, cy )
		);

	cy += 50;

	// buttons are in the scrollbox
	let button = sbTwig[ 'linkloom:home' ];

	sbTwig[ 'linkloom:home' ] =
		button.create(
			'zone',
				button.zone.create(
					'pos', gleam_point.xy( 160 * ( cols - 2 ) / 2, 0 )
				)
		);

	button = sbTwig[ 'linkloom:sandbox' ];

	sbTwig[ 'linkloom:sandbox' ] =
		button.create(
			'zone',
				button.zone.create(
					'pos', gleam_point.xy( 160 * ( cols ) / 2, 0 )
				)
		);

	if( userSpaceList )
	{
		let c = 0; // current column

		let cOff = 0; // column offset (for last row)

		let r = 1; // current row

		for( let a = 0, aZ = userSpaceList.length; a < aZ; a++ )
		{
			if( r >= rows )
			{
				cLen = aZ % cols;

				if( cLen === 0 ) cLen = cols;

				cOff = ( cols - cLen ) / 2;
			}

			const rSpace = userSpaceList.get( a );

			const fullname = rSpace.fullname;

			button = this._twig[ fullname ];

			if( !button ) button = gruga_moveTo.spaceButtonTemplate;

			sbRanks.push( fullname );

			sbTwig[ fullname ] =
				button.create(
					'zone',
						button.zone.create(
							'pos', gleam_point.xy( 160 * ( cOff + c ), 160 * r )
						),
					'text', rSpace.username + '\n' + rSpace.tag,
					'transform', gleam_transform.normal
				);

			if( ++c >= cols )
			{
				c = 0;

				r++;
			}
		}
	}

	twig.scrollbox =
		sb.create(
			'scrollbarYOffset', form_moveTo.scrollbarYOffset,
			'zone',
				gleam_rect.create(
					'pos', gleam_point.xy( x0, cy ),
					'width', avw + gruga_scrollbar.strength,
					'height', vh - cy
				),
			'twig:init', sbTwig, sbRanks
		);

	this._twig = twig;

	form_form.init.call( this, true /* twigDup always set to true */ );
};


def.func._transform = form_form.transform;


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


def.static.concernsMark = form_form.concernsMark;


/*::::::::::::::::::::.
:: Static lazy values
':::::::::::::::::::::*/


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


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


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


/*:::::::::::.
:: Functions
'::::::::::::*/


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
		ref_space.create(
			'username', parts[ 0 ],
			'tag',  parts[ 1 ]
		),
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

