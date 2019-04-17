/*
| The moveTo or 'go' form.
*/
'use strict';


tim.define( module, ( def, form_moveTo ) => {


/*
| Is a form.
*/
def.extend = './form';


if( TIM )
{
	def.attributes =
	{
		// current action
		action : { type : [ '< ../action/types' ] },

		// space has grid
		hasGrid : { type : 'undefined' },

		// space has snapping
		hasSnapping : { type : 'undefined' },

		// the widget hovered upon
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		// the users mark
		mark : { type : [ 'undefined', '< ../mark/visual-types'] },

		// the path of the form
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// the reference to the current space
		spaceRef : { type : 'undefined' },

		// currently logged in user
		user : { type : 'undefined' },

		// list of spaces belonging to user
		userSpaceList : { type : [ 'undefined', '../ref/spaceList' ] },

		// current view size
		viewSize : { type : '../gleam/size' }
	};

	def.twig = [ '< ../widget/types' ];
}


const form_form = tim.require( './form' );

const gleam_point = tim.require( '../gleam/point' );

const gleam_rect = tim.require( '../gleam/rect' );

const gleam_transform = tim.require( '../gleam/transform' );

const gruga_moveTo = tim.require( '../gruga/moveTo' );

const gruga_scrollbar = tim.require( '../gruga/scrollbar' );

const ref_space = tim.require( '../ref/space' );

const widget_button = tim.require( '../widget/button' );

const widget_scrollbox = tim.require( '../widget/scrollbox' );


/*
| Does care about userSpaceList.
*/
def.static.concernsUserSpaceList =
def.proto.concernsUserSpaceList =
	( userSpaceList ) => userSpaceList;


/*
| Adjusts widgets.
*/
def.adjust.get =
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

	return form_form.adjustGet.call( this, name, widget );
};


/*
| Offset of the vertical scrollbar, set so it's within the scrollbox.
*/
def.staticLazy.scrollbarYOffset =
	function( )
{
	return gleam_point.xy( Math.ceil( -gruga_scrollbar.strength / 2 ) - 1, 0 );
};


/*
| A button of the form has been pushed.
*/
def.proto.pushButton =
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
def.proto.showDisc = true;

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
| Distance to left side of screen.
*/
def.lazy._leftDistance = ( ) =>
	// == left distance to disc
	root.disc.get( 'main' ).size.width + 20;


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
| Transforms the headline.
*/
def.proto._transformHeadline =
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
| Transforms the scrollbox.
*/
def.proto._transformScrollbox =
	function(
		sb       // the scrollbox widget
	)
{
	const sbRanks = [ 'plotle:home', 'plotle:sandbox' ];

	const sbTwig =
	{
		'plotle:home'    : sb.get( 'plotle:home' ),
		'plotle:sandbox' : sb.get( 'plotle:sandbox' )
	};

	// cols in current row
	let cLen = this._cols;

	// buttons are in the scrollbox
	let button = sbTwig[ 'plotle:home' ];

	sbTwig[ 'plotle:home' ] =
		button.create(
			'zone',
				button.zone.create(
					'pos', gleam_point.xy( 160 * ( this._cols - 2 ) / 2, 0 )
				)
		);

	button = sbTwig[ 'plotle:sandbox' ];

	sbTwig[ 'plotle:sandbox' ] =
		button.create(
			'zone',
				button.zone.create(
					'pos', gleam_point.xy( 160 * ( this._cols ) / 2, 0 )
				)
		);

	let sbPath = this.path.append( 'twig' ).append( 'scrollbox' );

	const userSpaceList = this.userSpaceList;

	if( userSpaceList )
	{
		let c = 0; // current column

		let cOff = 0; // column offset (for last row)

		let r = 1; // current row

		const uslLen = userSpaceList.length;

		for( let rSpace of userSpaceList )
		{
			if( r >= this._rows )
			{
				cLen = uslLen % this._cols;

				if( cLen === 0 ) cLen = this._cols;

				cOff = ( this._cols - cLen ) / 2;
			}

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


} );
