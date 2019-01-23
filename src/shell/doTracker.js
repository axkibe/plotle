/*
| The dotracker manages the undo and redo stacks.
*/
'use strict';


tim.define( module, ( def, shell_doTracker ) => {


const change_wrapList = require( '../change/wrapList' );

const shell_settings = require( '../shell/settings' );


if( TIM )
{
	def.attributes =
	{
		// the undo stack
		_undo : { type : [ 'undefined', '../change/wrapList' ] },

		// the redo stack
		_redo : { type : [ 'undefined', '../change/wrapList' ] }
	};
}


/*
| Flushes the stacks.
*/
def.static.flush =
	function( )
{
	root.create(
		'doTracker',
			shell_doTracker.create(
				'_undo', change_wrapList.create( ),
				'_redo', change_wrapList.create( )
			)
	);
};


/*
| Reporting the doTracker something has been altered.
|
| It will track it on the undo stack.
*/
def.proto.track =
	function(
		changeWrap
	)
{
	let undo = this._undo;

	undo = undo.append( changeWrap );

	if( undo.length > shell_settings.maxUndo )
	{
		undo = undo.remove( 0 );
	}

	root.create(
		'doTracker',
			this.create(
				'_undo', undo,
				'_redo', change_wrapList.create( )
			)
	);
};


/*
| Received server updates.
|
| These contain updates from this sessions own changes
| now enriched with sequence ids as well as genuine updates
| from others.
*/
def.proto.update =
	function(
		changeWrapList
	)
{
/**/if( CHECK )
/**/{
/**/	if( root.doTracker !== this ) throw new Error( );
/**/}

	if( changeWrapList.length === 0 )
	{
		// nothing to do

		return this;
	}

	let undo = this._undo;

	let redo = this._redo;

	// Adapts the doTracker stacks

	for( let a = 0, al = undo.length; a < al; a++ )
	{
		let cw = undo.get( a );

		cw = changeWrapList.transform( cw );

		// the change vanished by transformation
		if( !cw )
		{
			undo = undo.remove( a-- );

			al--;

			continue;
		}

		undo = undo.set( a, cw );
	}

	for( let a = 0, al = redo.length; a < al; a++ )
	{
		let cw = redo.get( a );

		cw = changeWrapList.transform( cw );

		// the change vanished by transformation
		if( !cw )
		{
			redo = redo.remove( a-- );

			al--;

			continue;
		}

		redo = redo.set( a, cw );
	}

	return this.create( '_undo', undo, '_redo', redo );
};


/*
| Reverts actions from the undo stack.
*/
def.proto.undo =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( root.doTracker !== this ) throw new Error( );
/**/}

	let undo = this._undo;

	if( undo.length === 0 ) return;

	let changeWrap = undo.get( undo.length - 1 );

	undo = undo.remove( undo.length - 1 );

	changeWrap = changeWrap.createReverse( );

	root.create(
		'doTracker',
			this.create(
				'_undo', undo,
				'_redo', this._redo.append( changeWrap )
			)
	);

	root.link.alter( changeWrap );
};


/*
| Reverts undos from the redo stack.
*/
def.proto.redo =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( root.doTracker !== this ) throw new Error( );
/**/}

	let redo = this._redo;

	if( redo.length === 0 ) return;

	let changeWrap = redo.get( redo.length - 1 );

	changeWrap = changeWrap.createReverse( );

	redo = redo.remove( redo.length - 1 );

	root.create(
		'doTracker',
			this.create(
				'_redo', redo,
				'_undo', this._undo.append( changeWrap )
			)
	);

	root.link.alter( changeWrap );
};


} );
