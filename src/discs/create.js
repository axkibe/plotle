/*
| The creation disc.
*/
'use strict';


tim.define( module, ( def, discs_create ) => {


def.extend = './base';

const action_createGeneric = tim.require( '../action/createGeneric' );
const action_createRelation = tim.require( '../action/createRelation' );
const action_createStroke = tim.require( '../action/createStroke' );


/*
| Adjusts widgets.
*/
def.adjust.get =
	function(
		name,
		widget
	)
{
	const trace = widget.trace || this.trace.appendWidget( name );

	const hover = widget.concernsHover( this.hover, trace );

	return(
		widget.create(
			'down', this._isActiveButton( name ),
			'devicePixelRatio', this.devicePixelRatio,
			'hover', hover,
			'trace', trace,
			'transform', this.controlTransform
		)
	);
};


/*
| Mapping of the the itemType name to the button name.
*/
def.staticLazy.itemTypeToButtonName = ( ) =>
( {
	'arrow'  : 'createArrow',
	'label'  : 'createLabel',
	'line'   : 'createLine',
	'note'   : 'createNote',
	'portal' : 'createPortal',
} );


/*
| Returns true if the button called 'wname'
| should be highlighted for current 'action'
*/
def.proto._isActiveButton =
	function(
		wname    // the widget name
	)
{
	const action = this.action;

	if( !action ) return false;

	switch( action.timtype )
	{
		case action_createGeneric :
		case action_createStroke :

			return wname === discs_create.itemTypeToButtonName[ action.itemType ] || false;

		case action_createRelation : return wname === 'createRelation';

		default : return false;
	}
};


/*
| A button of the disc has been pushed.
*/
def.proto.pushButton =
	function(
		trace,
		shift,
		ctrl
	)
{
/**/if( CHECK )
/**/{
/**/	if( trace.traceDisc.key !== 'create' ) throw new Error( );
/**/}

	const buttonName = trace.traceWidget.key;

	let action;

	switch( buttonName )
	{
		case 'createArrow' : action = action_createStroke.createArrow; break;

		case 'createLabel' : action = action_createGeneric.createLabel; break;

		case 'createLine' : action = action_createStroke.createLine; break;

		case 'createNote' : action = action_createGeneric.createNote; break;

		case 'createPortal' : action = action_createGeneric.createPortal; break;

		case 'createRelation' :

			action = action_createRelation.create( 'relationState', 'start' ); break;

		default : throw new Error( );
	}

	root.alter( 'action', action );
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
| Checks if the user clicked something on the panel.
*/
def.proto.click =
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

	// this is on the disc
	for( let widget of this )
	{
		const bubble = widget.click( pp, shift, ctrl );

		if( bubble ) return bubble;
	}

	return false;
};


/*
| Stop of a dragging operation.
*/
def.proto.dragStop =
	function(
		p,
		shift,
		ctrl
	)
{
	return;
};


} );
