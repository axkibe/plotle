/*
| The zoom disc.
*/
'use strict';


tim.define( module, ( def, disc_zoom ) => {


def.extend = './disc';


const action_none = tim.require( '../action/none' );

const action_zoomButton = tim.require( '../action/zoomButton' );


/*
| Adjusts widgets.
*/
def.adjust.get =
	function(
		name,
		widget
	)
{
	const path = widget.path || this.path.append( 'twig' ).append( name );

	const hover = widget.concernsHover( this.hover, path );

	return(
		widget.create(
			'path', path,
			'hover', hover,
			'down', disc_zoom._isActiveButton( this.action, name ),
			'transform', this.controlTransform
		)
	);
};


/*
| Returns true if the button called 'wname'
| should be highlighted for current 'action'
*/
def.static._isActiveButton =
	function(
		action,  // the action
		wname    // the widget name
	)
{
	return false;
};


/*
| Move during a dragging operation.
*/
def.proto.dragMove =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	const action = this.action;

	if( action.timtype !== action_zoomButton ) return;

	return false;
};

/*
| A button has been dragStarted.
*/
def.proto.dragStartButton =
	function(
		path
	)
{
/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== 'zoom' ) throw new Error( );
/**/}

	const buttonName = path.get( 4 );

	switch( buttonName )
	{
		case 'zoomIn' :

			root.alter( 'action', action_zoomButton.createZoom( 1 ) );

			root.changeSpaceTransformCenter( 1 );

			return;

		case 'zoomOut' :

			root.alter( 'action', action_zoomButton.createZoom( -1 ) );

			root.changeSpaceTransformCenter( -1 );

			return;
	}
};


/*
| Stop of a dragging operation.
*/
def.proto.dragStop =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	const action = this.action;

	if( action.timtype !== action_zoomButton ) return;

	root.alter( 'action', action_none.singleton );

	return false;
};


/*
| A button of the main disc has been pushed.
*/
def.proto.pushButton =
	function(
		path
		// shift,
		// ctrl
	)
{
/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== 'zoom' ) throw new Error( );
/**/}

	const buttonName = path.get( 4 );

	// zoomIn and zoomOut are handled
	// via "dragging" operations so holding
	// makes multiple events

	switch( buttonName )
	{
		case 'zoomAll' : root.changeSpaceTransformAll( ); return;

		case 'zoomHome' : root.changeSpaceTransformHome( ); return;

		default : throw new Error( );
	}

};


/*
| Returns true if point is on the disc panel.
*/
def.proto.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	const tZone = this.tZone;

	// shortcut if p is not near the panel
	if( !tZone.within( p ) ) return;

	const pp = p.sub( tZone.pos );

	if( !this.tShape.within( pp ) ) return;

	// it's on the disc
	for( let widget of this )
	{
		const bubble = widget.pointingHover( pp, shift, ctrl );

		if( bubble ) return bubble;
	}
};

/*
| The pointing device just went down.
| Probes if the system ought to wait if it's
| a click or can initiate a drag right away.
*/
def.proto.probeClickDrag =
	function(
		p,
		shift,
		ctrl
	)
{
	const tZone = this.tZone;

	// shortcut if p is not near the panel
	if( !tZone.within( p ) ) return;

	const pp = p.sub( tZone.pos );

	// if p is not on the panel
	if( !this.tShape.within( pp ) ) return;

	if( this.get( 'zoomIn' ).within( pp )
	|| this.get( 'zoomOut' ).within( pp )
	) return 'drag';

	return 'atween';
};


} );
