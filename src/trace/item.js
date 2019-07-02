/*
| A trace into an item on a space.
*/
'use strict';


tim.define( module, ( def, trace_item ) => {


def.extend = './baseTwigKey';


if( TIM )
{
	// path of trace back.
	def.list = [ './root', './space' ];

	def.json = 'trace_item';
}


const trace_doc = tim.require( './doc' );

const trace_field = tim.require( './field' );

const trace_pos = tim.require( './pos' );

const trace_scrollPos = tim.require( './scrollPos' );

const trace_widget = tim.require( './widget' );

const trace_zone = tim.require( './zone' );


/*
| Returns a trace with a doc part appended.
*/
def.lazy.appendDoc =
	function( )
{
	return trace_doc.create( 'list:init', this, 'list:append', this );
};


/*
| Returns a trace with a field part appended.
*/
def.lazyFuncStr.appendField =
	function(
		key
	)
{
	return trace_field.create( 'list:init', this, 'list:append', this, 'key', key );
};


/*
| Returns a trace with a scrollPos appended.
*/
def.lazy.appendScrollPos =
	function( )
{
	return trace_scrollPos.create( 'list:init', this, 'list:append', this );
};


/*
| Returns a trace with a scrollPos appended.
*/
def.lazy.appendPos =
	function( )
{
	return trace_pos.create( 'list:init', this, 'list:append', this );
};


/*
| Returns a trace with a widget part appended.
*/
def.lazyFuncStr.appendWidget =
	function(
		key
	)
{
	return trace_widget.create( 'list:init', this, 'list:append', this, 'key', key );
};


/*
| Returns a trace with a scrollPos appended.
*/
def.lazy.appendZone =
	function( )
{
	return trace_zone.create( 'list:init', this, 'list:append', this );
};


/*
| JSON converter.
*/
def.lazy.asJSON =
	function( )
{
	return(
		{
			type : 'trace_item',
			trace : this.last.asJSON.trace.concat( [ '(o)item', this.key ] )
		}
	);
};


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep =
	function( )
{
	return 'item(' + this.key + ')';
};


/*
| This is the item trace.
*/
def.lazy.traceItem = function( ) { return this; };


} );
