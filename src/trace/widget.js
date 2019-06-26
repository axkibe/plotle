/*
| A trace into a widget on a form.
*/
'use strict';


tim.define( module, ( def, trace_widget ) => {


def.extend = './baseTwigKey';


if( TIM )
{
	// path of trace back.
	def.list =
	[
		'./root',
		'./disc',
		'./discs',
		'./form',
		'./forms',
		'./item',
		'./space',
		'./widget'
	];
}


const trace_offset = tim.require( './offset' );

const trace_scrollPos = tim.require( './scrollPos' );

const trace_text = tim.require( './text' );


/*
| Returns a trace with an offset appended.
*/
def.lazyFuncInt.appendOffset =
	function(
		at // offset
	)
{
	return trace_offset.create( 'list:init', this, 'list:append', this, 'at', at );
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
| Returns a trace with a doc part appended.
*/
def.lazy.appendText =
	function( )
{
	return trace_text.create( 'list:init', this, 'list:append', this );
};


/*
| Returns a trace with a sub-widget appended.
*/
def.lazyFuncStr.appendWidget =
	function(
		key // key of the sub widget
	)
{
	return trace_widget.create( 'list:init', this, 'list:append', this, 'key', key );
};


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep =
	function( )
{
	return 'widget(' + this.key + ')';
};


/*
| This is ta widget trace.
*/
def.lazy.traceWidget = function( ) { return this; };


} );
