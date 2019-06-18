/*
| The base of marks.
*/
'use strict';


tim.define( module, ( def, mark_caret ) => {


def.abstract = true;


/*
| The content the mark puts into the clipboard.
*/
def.proto.clipboard = '';


/*
| By default it's not part of a widget.
*/
def.proto.widgetTrace = undefined;


} );
