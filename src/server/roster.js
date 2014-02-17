/*
| The roster of all resources.
|
| Authors: Axel Kittenberger
*/

/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Imports
*/
var
	Resource =
		require( './resource' );


module.exports =
[
	Resource.create(
		'filepath',
			'media/favicon.ico',
		'maxage',
			'long',
		'opstr',
			'm'
	),
	Resource.create(
		'filepath',
			'testpad/testpad.js',
		'opstr',
			'f'
	),
	Resource.create(
		'filepath',
			'testpad/iface-sym.js',
		'opstr',
			'f'
	),
	Resource.create(
		'filepath',
			'webfont/webfont.js',
		'maxage',
			'long',
		'opstr',
			'm'
	),
	Resource.create(
		'filepath',
			'src/jools/jools.js',
		'inBundle',
			true,
		'opstr',
			'f'
	),
	Resource.create(
		'filepath',
			'src/jools/sha1.js',
		'inBundle',
			true,
		'opstr',
			'f'
	),
	Resource.create(
		'filepath',
			'src/euclid/point.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/rect.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/mm/meshverse.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/mm/path.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/mm/tree.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/mm/sign.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/mm/change.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/mm/changeray.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/mm/meshmashine.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/const.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/compass.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/margin.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/font.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/fabric.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/measure.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/shape.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/round-rect.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/ellipse.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/line.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/design/anchor-point.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/design/anchor-rect.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/design/anchor-ellipse.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/widgets/widget.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/widgets/getstyle.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/widgets/button.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/widgets/input.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/widgets/checkbox.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/widgets/label.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/fontpool.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/style.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/accent.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/traitset.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/theme.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/view.js', // TODO put to other euclids
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/iface.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/peer.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/stubs.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/discs/icons.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/discs/disc.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/discs/createdisc.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/discs/maindisc.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/discs/jockey.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/hover-reply.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/forms/form.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/forms/login.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/forms/signup.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/forms/space.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/forms/moveto.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/forms/user.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/forms/welcome.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/forms/no-access-to-space.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/forms/non-existing-space.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/forms/jockey.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/gruga/maindisc.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/gruga/createdisc.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/gruga/login.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/gruga/moveto.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/gruga/no-access-to-space.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/gruga/non-existing-space.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/gruga/signup.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/gruga/space.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/gruga/user.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/gruga/welcome.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/visual/para.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/visual/scrollbar.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/visual/doc.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/visual/item.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/visual/docitem.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/visual/note.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/visual/label.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/visual/relation.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/visual/portal.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/visual/space.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/system.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/mark/mark.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/mark/caret.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/mark/item.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/mark/range.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/mark/vacant.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/mark/widget.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/action/action.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/action/none.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/action/create-generic.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/action/create-relation.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/action/item-drag.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/action/item-resize.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/action/pan.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/action/scrolly.js',
		'opstr',
			'f',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/shell.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/fontloader.js',
		'opstr',
			'f',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'media/dejavu/dejavu.css',
		'maxage',
			'long',
		'opstr',
			'm'
	),
	Resource.create(
		'filepath',
			'media/dejavu/dejavusans-boldoblique-webfont.eot',
		'maxage',
			'long',
		'opstr',
			'm'
	),
	Resource.create(
		'filepath',
			'media/dejavu/dejavusans-boldoblique-webfont.svg',
		'maxage',
			'long',
		'opstr',
			'm'
	),
	Resource.create(
		'filepath',
			'media/dejavu/dejavusans-boldoblique-webfont.ttf',
		'maxage',
			'long',
		'opstr',
			'm'
	),
	Resource.create(
		'filepath',
			'media/dejavu/dejavusans-boldoblique-webfont.woff',
		'maxage',
			'long',
		'opstr',
			'm'
	),
	Resource.create(
		'filepath',
			'media/dejavu/dejavusans-bold-webfont.eot',
		'maxage',
			'long',
		'opstr',
			'm'
	),
	Resource.create(
		'filepath',
			'media/dejavu/dejavusans-bold-webfont.svg',
		'maxage',
			'long',
		'opstr',
			'm'
	),
	Resource.create(
		'filepath',
			'media/dejavu/dejavusans-bold-webfont.ttf',
		'maxage',
			'long',
		'opstr',
			'm'
	),
	Resource.create(
		'filepath',
			'media/dejavu/dejavusans-bold-webfont.woff',
		'maxage',
			'long',
		'opstr',
			'm'
	),
	Resource.create(
		'filepath',
			'media/dejavu/dejavusans-oblique-webfont.eot',
		'maxage',
			'long',
		'opstr',
			'm'
	),
	Resource.create(
		'filepath',
			'media/dejavu/dejavusans-oblique-webfont.svg',
		'maxage',
			'long',
		'opstr',
			'm'
	),
	Resource.create(
		'filepath',
			'media/dejavu/dejavusans-oblique-webfont.ttf',
		'maxage',
			'long',
		'opstr',
			'm'
	),
	Resource.create(
		'filepath',
			'media/dejavu/dejavusans-oblique-webfont.woff',
		'maxage',
			'long',
		'opstr',
			'm'
	),
	Resource.create(
		'filepath',
			'media/dejavu/dejavusans-webfont.eot',
		'maxage',
			'long',
		'opstr',
			'm'
	),
	Resource.create(
		'filepath',
			'media/dejavu/dejavusans-webfont.svg',
		'maxage',
			'long',
		'opstr',
			'm'
	),
	Resource.create(
		'filepath',
			'media/dejavu/dejavusans-webfont.ttf',
		'maxage',
			'long',
		'opstr',
			'm'
	),
	Resource.create(
		'filepath',
			'media/dejavu/dejavusans-webfont.woff',
		'maxage',
			'long',
		'opstr',
			'm'
	),
];


} )( );
