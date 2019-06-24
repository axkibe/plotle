/*
| A trace into a widget on a form.
*/
'use strict';


tim.define( module, ( def, trace_widget ) => {


def.extend = './base';


if( TIM )
{
	def.attributes =
	{
		// key of the widget
		key : { type : 'string' },
	};


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
| FIXME remove.
*/
def.lazy.toPath =
	function( )
{
	return this.get( this.length - 1 ).toPath.append( 'twig' ).append( this.key );
};


/*
| This is ta widget trace.
*/
def.lazy.traceWidget = function( ) { return this; };


} );
