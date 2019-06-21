/*
| A trace into a form.
*/
'use strict';


tim.define( module, ( def, trace_form ) => {


def.extend = './base';


if( TIM )
{
	def.attributes =
	{
		// key of the form
		key : { type : 'string' },
	};

	// path of trace back.
	def.list = [ './root', './forms' ];
}


const trace_attribute = tim.require( './attribute' );

const trace_widget = tim.require( './widget' );


/*
| Returns a trace with an attribute step appended.
*/
def.lazyFuncStr.appendAttribute =
	function(
		key // key of the attribute
	)
{
	return trace_attribute.create( 'list:init', this, 'list:append', this, 'key', key );
};


/*
| Returns a trace with a widget step appended.
*/
def.lazyFuncStr.appendWidget =
	function(
		key // key of the widget
	)
{
	return trace_widget.create( 'list:init', this, 'list:append', this, 'key', key );
};


/*
| FIXME remove
*/
def.lazy.toPath =
	function( )
{
	return this.get( this.length - 1 ).toPath.append( 'twig' ).append( this.key );
};


} );
