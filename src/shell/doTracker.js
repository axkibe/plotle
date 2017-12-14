/*
| The dotracker manages the undo and redo stacks.
*/
'use strict';


// FIXME
var
	change_wrapList,
	shell_settings;


tim.define( module, 'shell_doTracker', ( def, shell_doTracker ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		_undo :
		{
			// the undo stack
			type : [ 'undefined', 'change_wrapList' ]
		},
		_redo :
		{
			// the redo stack
			type : [ 'undefined', 'change_wrapList' ]
		}
	};
}


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


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


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Reporting the doTracker something has been altered.
|
| It will track it on the undo stack.
*/
def.func.track =
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
def.func.update =
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

	for( let a = 0, aZ = undo.length; a < aZ; a++ )
	{
		let cw = undo.get( a );

		cw = changeWrapList.transform( cw );

		// the change vanished by transformation
		if( !cw )
		{
			undo = undo.remove( a-- );

			aZ--;

			continue;
		}

		undo = undo.set( a, cw );
	}

	for( let a = 0, aZ = redo.length; a < aZ; a++ )
	{
		let cw = redo.get( a );

		cw = changeWrapList.transform( cw );

		// the change vanished by transformation
		if( !cw )
		{
			redo = redo.remove( a-- );

			aZ--;

			continue;
		}

		redo = redo.set( a, cw );
	}

	return this.create( '_undo', undo, '_redo', redo );
};


/*
| Reverts actions from the undo stack.
*/
def.func.undo =
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
def.func.redo =
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
