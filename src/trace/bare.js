/*
| A bare part of a trace.
*/
'use strict';


tim.define( module, ( def, trace_bare ) => {


def.abstract = true;


const trace_disc = tim.require( './disc' );

const trace_discs  = tim.require( './discs' );

const trace_doc = tim.require( './doc' );

const trace_field = tim.require( './field' );

const trace_form = tim.require( './form' );

const trace_forms = tim.require( './forms' );

const trace_item = tim.require( './item' );

const trace_offset = tim.require( './offset' );

const trace_para = tim.require( './para' );

const trace_root = tim.require( './root' );

const trace_space = tim.require( './space' );

const trace_widget = tim.require( './widget' );



/*
| Appends a generic step.
*/
def.proto.appendStep =
	function(
		step
	)
{
	switch( step.timtype )
	{
		case trace_disc   : return this.appendDisc( step.key );
		case trace_discs  : return this.appendDiscs;
		case trace_doc    : return this.appendDoc;
		case trace_field  : return this.appendField( step.key );
		case trace_form   : return this.appendForm( step.key );
		case trace_forms  : return this.appendForms;
		case trace_item   : return this.appendItem( step.key );
		case trace_offset : return this.appendOffset( step.key );
		case trace_para   : return this.appendPara( step.key );
		case trace_space  : return this.appendSpace;
		case trace_widget : return this.appendWidget( step.key );
		default : throw new Error( );
	}
};


/*
| Removes the root entry from the front of trace
*/
def.lazy.chopRoot =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( this.length === 0 ) throw new Error( );
/**/
/**/	if( this.first.timtype !== trace_root ) throw new Error( );
/**/}

	let t = this.get( 1 ).create( 'list:remove', 0 );

	for( let a = 2; a < this.length; a++ )
	{
		t = t.appendStep( this.get( a ) );
	}

	return t.appendStep( this );
};



/*
| Returns true if this trace has 'trace' as parent.
*/
def.proto.hasTrace =
	function(
		trace
	)
{
	if( this.equals( trace ) ) return true;

	for( let a = this.length - 1; a >= 0; a-- )
	{
		if( this.get( a ).equals( trace ) ) return true;
	}

	return false;
};


/*
| Adds a root entry infront of the trace.
*/
def.lazy.prependRoot =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( this.traceRoot ) throw new Error( );
/**/}

	let t = trace_root.singleton;

	for( let tp of this ) t = t.appendStep( tp );

	return t.appendStep( this );
};


/*
| Default doc tracer.
*/
def.lazy.traceDoc =
	function( )
{
	if( this.length === 0 ) return;

	return this.get( this.length - 1 ).traceDoc;
};


/*
| Default item tracer.
*/
def.lazy.traceItem =
	function( )
{
	if( this.length === 0 ) return;

	return this.get( this.length - 1 ).traceItem;
};


/*
| Default para tracer.
*/
def.lazy.tracePara =
	function( )
{
	if( this.length === 0 ) return;

	return this.get( this.length - 1 ).tracePara;
};


/*
| Default para tracer.
*/
def.lazy.traceRoot =
	function( )
{
	if( this.length === 0 ) return;

	const first = this.first;

	if( first.timtype === trace_root ) return first;
};


/*
| Default space tracer.
*/
def.lazy.traceSpace =
	function( )
{
	if( this.length === 0 ) return;

	return this.get( this.length - 1 ).traceSpace;
};


} );
