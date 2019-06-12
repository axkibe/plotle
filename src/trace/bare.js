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
		const tp = this.get( a );

		switch( tp.timtype )
		{
			case trace_disc   : t = t.appendDisc( tp.key ); break;
			case trace_doc    : t = t.appendDoc; break;
			case trace_field  : t = t.appendField( tp.key ); break;
			case trace_form   : t = t.appendForm( tp.key ); break;
			case trace_item   : t = t.appendItem( tp.key ); break;
			case trace_offset : t = t.appendOffset( tp.key ); break;
			case trace_para   : t = t.appendPara( tp.key ); break;
			case trace_widget : t = t.appendWidget( tp.key ); break;
			default : throw new Error( );
		}
	}

	// FIXME make a generic append
	switch( this.timtype )
	{
		case trace_disc   : t = t.appendDisc( this.key ); break;
		case trace_doc    : t = t.appendDoc; break;
		case trace_field  : t = t.appendField( this.key ); break;
		case trace_form   : t = t.appendForm( this.key ); break;
		case trace_item   : t = t.appendItem( this.key ); break;
		case trace_offset : t = t.appendOffset( this.key ); break;
		case trace_para   : t = t.appendPara( this.key ); break;
		case trace_widget : t = t.appendWidget( this.key ); break;
		default : throw new Error( );
	}

	return t;
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

	for( let tp of this )
	{
		switch( tp.timtype )
		{
			case trace_disc   : t = t.appendDisc( tp.key ); break;
			case trace_discs  : t = t.appendDiscs; break;
			case trace_doc    : t = t.appendDoc; break;
			case trace_field  : t = t.appendField( tp.key ); break;
			case trace_form   : t = t.appendForm( tp.key ); break;
			case trace_forms  : t = t.appendForms; break;
			case trace_item   : t = t.appendItem( tp.key ); break;
			case trace_offset : t = t.appendOffset( tp.key ); break;
			case trace_para   : t = t.appendPara( tp.key ); break;
			case trace_space  : t = t.appendSpace; break;
			case trace_widget : t = t.appendWidget( tp.key ); break;
			default : throw new Error( );
		}
	}

	return t;
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
