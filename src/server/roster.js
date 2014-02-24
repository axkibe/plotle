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
		'aliases',
			[
				'meshcraft.html',
				'index.html',
				''
			],
		'filepath',
			'media/meshcraft.html',
		'maxage',
			'short',
		'postProcessor',
			'indexHtml'
	),
	Resource.create(
		'aliases',
			[ 'devel.html' ],
		'filepath',
			'media/devel.html',
		'devel',
			true,
		'postProcessor',
			'develHtml'
	),
	Resource.create(
		'filepath',
			'media/favicon.ico',
		'maxage',
			'long'
	),
	Resource.create(
		'filepath',
			'webfont/webfont.js',
		'maxage',
			'long'
	),
	Resource.create(
		'filepath',
			'src/jools/jools.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.create(
		'filepath',
			'src/jools/sha1.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/point.js',
		'hasJoobj',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/rect.js',
		'hasJoobj',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.create(
		'filepath',
			'src/mm/meshverse.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.create(
		'filepath',
			'src/mm/path.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.create(
		'filepath',
			'src/mm/tree.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.create(
		'filepath',
			'src/mm/sign.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.create(
		'filepath',
			'src/mm/change.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.create(
		'filepath',
			'src/mm/changeray.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/mm/meshmashine.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/fontpool.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/theme.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/const.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/compass.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/margin.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/font.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/fabric.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/measure.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/shape.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/round-rect.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/ellipse.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/line.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/euclid/view.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/design/anchor-point.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/design/anchor-rect.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/design/anchor-ellipse.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/widgets/widget.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/widgets/getstyle.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/widgets/button.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/widgets/input.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/widgets/checkbox.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/widgets/label.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/style.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/accent.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/traitset.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/iface.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/peer.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/stubs.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/discs/icons.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/discs/disc.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/discs/createdisc.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/discs/maindisc.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/discs/jockey.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/hover-reply.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/forms/form.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/forms/login.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/forms/signup.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/forms/space.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/forms/moveto.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/forms/user.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/forms/welcome.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/forms/no-access-to-space.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/forms/non-existing-space.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/forms/jockey.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/gruga/maindisc.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/gruga/createdisc.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/gruga/login.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/gruga/moveto.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/gruga/no-access-to-space.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/gruga/non-existing-space.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/gruga/signup.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/gruga/space.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/gruga/user.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/gruga/welcome.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/visual/para.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/visual/scrollbar.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/visual/doc.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/visual/item.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/visual/docitem.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/visual/note.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/visual/label.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/visual/relation.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/visual/portal.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/visual/space.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/system.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/mark/mark.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/mark/caret.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/mark/item.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/mark/range.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/mark/vacant.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/mark/widget.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/action/action.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/action/none.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/action/create-generic.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/action/create-relation.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/action/item-drag.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/action/item-resize.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/action/pan.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/action/scrolly.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/shell.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'src/shell/fontloader.js',
		'inBundle',
			true
	),
	Resource.create(
		'filepath',
			'media/dejavusans/style.css',
		'maxage',
			'long'
	),
	Resource.create(
		'filepath',
			'media/dejavusans/boldoblique-webfont.eot',
		'maxage',
			'long'
	),
	Resource.create(
		'filepath',
			'media/dejavusans/boldoblique-webfont.svg',
		'maxage',
			'long'
	),
	Resource.create(
		'filepath',
			'media/dejavusans/boldoblique-webfont.ttf',
		'maxage',
			'long'
	),
	Resource.create(
		'filepath',
			'media/dejavusans/boldoblique-webfont.woff',
		'maxage',
			'long'
	),
	Resource.create(
		'filepath',
			'media/dejavusans/bold-webfont.eot',
		'maxage',
			'long'
	),
	Resource.create(
		'filepath',
			'media/dejavusans/bold-webfont.svg',
		'maxage',
			'long'
	),
	Resource.create(
		'filepath',
			'media/dejavusans/bold-webfont.ttf',
		'maxage',
			'long'
	),
	Resource.create(
		'filepath',
			'media/dejavusans/bold-webfont.woff',
		'maxage',
			'long'
	),
	Resource.create(
		'filepath',
			'media/dejavusans/oblique-webfont.eot',
		'maxage',
			'long'
	),
	Resource.create(
		'filepath',
			'media/dejavusans/oblique-webfont.svg',
		'maxage',
			'long'
	),
	Resource.create(
		'filepath',
			'media/dejavusans/oblique-webfont.ttf',
		'maxage',
			'long'
	),
	Resource.create(
		'filepath',
			'media/dejavusans/oblique-webfont.woff',
		'maxage',
			'long'
	),
	Resource.create(
		'filepath',
			'media/dejavusans/webfont.eot',
		'maxage',
			'long'
	),
	Resource.create(
		'filepath',
			'media/dejavusans/webfont.svg',
		'maxage',
			'long'
	),
	Resource.create(
		'filepath',
			'media/dejavusans/webfont.ttf',
		'maxage',
			'long'
	),
	Resource.create(
		'filepath',
			'media/dejavusans/webfont.woff',
		'maxage',
			'long'
	),

	// --- TestPad ---
	Resource.create(
		'aliases',
			[ 'testpad.html' ],
		'filepath',
			'media/testpad.html',
		'devel',
			true,
		'postProcessor',
			'testPadHtml'
	),
	Resource.create(
		'filepath',
			'src/testpad/iface-sym.js',
		'devel',
			true,
		'inTestPad',
			true
	),
	Resource.create(
		'filepath',
			'src/testpad/action.js',
		'devel',
			true,
		'hasJoobj',
			true,
		'inTestPad',
			true
	),
	Resource.create(
		'filepath',
			'src/testpad/testpad.js',
		'devel',
			true,
		'hasJoobj',
			true,
		'inTestPad',
			true
	),
];


} )( );
