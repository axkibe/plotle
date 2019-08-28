/*
| The base of all traces.
*/
'use strict';


tim.define( module, ( def, trace_base ) => {


def.abstract = true;

def.json = 'trace';


const trace_checked = tim.require( './checked' );
const trace_disc = tim.require( './disc' );
const trace_discs  = tim.require( './discs' );
const trace_doc = tim.require( './doc' );
const trace_field = tim.require( './field' );
const trace_fontsize = tim.require( './fontsize' );
const trace_form = tim.require( './form' );
const trace_forms = tim.require( './forms' );
const trace_from = tim.require( './from' );
const trace_hasGrid = tim.require( './hasGrid' );
const trace_hasGuides = tim.require( './hasGuides' );
const trace_hasSnapping = tim.require( './hasSnapping' );
const trace_item = tim.require( './item' );
const trace_jp1 = tim.require( './jp1' );
const trace_jp2 = tim.require( './jp2' );
const trace_nonSpaceRef = tim.require( './nonSpaceRef' );
const trace_offset = tim.require( './offset' );
const trace_para = tim.require( './para' );
const trace_pos = tim.require( './pos' );
const trace_root = tim.require( './root' );
const trace_scrollPos = tim.require( './scrollPos' );
const trace_space = tim.require( './space' );
const trace_text = tim.require( './text' );
const trace_to = tim.require( './to' );
const trace_widget = tim.require( './widget' );
const trace_zone = tim.require( './zone' );


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
		case trace_checked     : return this.appendChecked;
		case trace_disc        : return this.appendDisc( step.key );
		case trace_discs       : return this.appendDiscs;
		case trace_doc         : return this.appendDoc;
		case trace_field       : return this.appendField( step.key );
		case trace_fontsize    : return this.appendFontsize;
		case trace_form        : return this.appendForm( step.key );
		case trace_forms       : return this.appendForms;
		case trace_from        : return this.appendFrom;
		case trace_item        : return this.appendItem( step.key );
		case trace_jp1         : return this.appendJP1;
		case trace_jp2         : return this.appendJP2;
		case trace_nonSpaceRef : return this.appendNonSpaceRef;
		case trace_offset      : return this.appendOffset( step.at );
		case trace_para        : return this.appendPara( step.key );
		case trace_pos         : return this.appendPos;
		case trace_scrollPos   : return this.appendScrollPos;
		case trace_space       : return this.appendSpace;
		case trace_text        : return this.appendText;
		case trace_to          : return this.appendTo;
		case trace_widget      : return this.appendWidget( step.key );
		case trace_zone        : return this.appendZone;
		default : throw new Error( );
	}
};


/*
| Turns the trace into a string (for debugging).
*/
def.lazy.asString =
	function( )
{
	let t = 'trace: ';

	let first = true;

	for( let p of this )
	{
		if( !first ) t += '->'; else first = false;

		t += p.asStringStep;
	}

	if( !first ) t += '->';

	return t + this.asStringStep;
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
| Custom JSON creator.
*/
def.static.createFromJSON =
	function(
		json  // the json object
	)
{
	if( json.type !== 'trace' ) throw new Error( );

	const trace = json.trace;

	if( !Array.isArray( trace ) ) throw new Error( );

	return trace_base.createFromJSONTrace( trace, 0, trace_space.fakeRoot );
};


/*
| Used by recursive fromJSON creation.
*/
def.static.createFromJSONTrace =
	function(
		trace, // the json trace to create from
		pos,   // the current position in the trace
		root   // uses this as root if the trace ends here
	)
{
	if( pos >= trace.length ) return root;

	const type = trace[ pos ];

	const timtype = trace_base._jsonMap[ type ];

	if( !timtype ) throw new Error( type );

	return timtype.createFromJSONStep( trace, pos );
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
| Default form tracer.
*/
def.lazy.traceForm =
	function( )
{
	if( this.length === 0 ) return;

	return this.get( this.length - 1 ).traceForm;
};


/*
| Default forms tracer.
*/
def.lazy.traceForms =
	function( )
{
	if( this.length === 0 ) return;

	return this.get( this.length - 1 ).traceForms;
};


/*
| Default disc tracer.
*/
def.lazy.traceDisc =
	function( )
{
	if( this.length === 0 ) return;

	return this.get( this.length - 1 ).traceDisc;
};


/*
| Default discs tracer.
*/
def.lazy.traceDiscs =
	function( )
{
	if( this.length === 0 ) return;

	return this.get( this.length - 1 ).traceDiscs;
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


/*
| Default space tracer.
*/
def.lazy.traceText =
	function( )
{
	if( this.length === 0 ) return;

	return this.get( this.length - 1 ).traceText;
};


/*
| Default widget tracer.
*/
def.lazy.traceWidget =
	function( )
{
	if( this.length === 0 ) return;

	return this.get( this.length - 1 ).traceWidget;
};


/*
| Maps trace step types.
*/
def.staticLazy._jsonMap = ( ) =>
( {
	'(o)doc'         : trace_doc,
	'(o)field'       : trace_field,
	'(o)fontsize'    : trace_fontsize,
	'(o)from'        : trace_from,
	'(o)hasGrid'     : trace_hasGrid,
	'(o)hasGuides'   : trace_hasGuides,
	'(o)hasSnapping' : trace_hasSnapping,
	'(o)item'        : trace_item,
	'(o)jp1'         : trace_jp1,
	'(o)jp2'         : trace_jp2,
	'(o)offset'      : trace_offset,
	'(o)para'        : trace_para,
	'(o)pos'         : trace_pos,
	'(o)space'       : trace_space,
	'(o)text'        : trace_text,
	'(o)to'          : trace_to,
	'(o)zone'        : trace_zone,
} );


} );
