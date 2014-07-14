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
	Resource.Create(
		'aliases',
			[
				'meshcraft.html',
				'index.html',
				''
			],
		'filePath',
			'media/meshcraft.html',
		'maxage',
			'short',
		'postProcessor',
			'indexHtml'
	),
	Resource.Create(
		'aliases',
			[ 'devel.html' ],
		'filePath',
			'media/devel.html',
		'devel',
			true,
		'postProcessor',
			'develHtml'
	),
	Resource.Create(
		'filePath',
			'media/favicon.ico',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'webfont/webfont.js',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'src/jion/proto.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/jools/jools.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/jools/sha1.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/jion/path.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/point.js',
		'hasJoobj',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/rect.js',
		'hasJoobj',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/shell/fontpool.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/shell/theme.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/const.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/compass.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/margin.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/font.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/fabric.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/measure.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/shape.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/round-rect.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/ellipse.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/line.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/view.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/design/anchor-point.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/design/anchor-rect.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/design/anchor-ellipse.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/widgets/widget.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/widgets/getstyle.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/widgets/button.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/widgets/input.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/widgets/checkbox.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/widgets/label.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/shell/style.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/shell/accent.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/net/channel.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/net/ajax.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/net/link.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/shell/peer.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/discs/icons.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/discs/disc.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/discs/createdisc.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/discs/maindisc.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/discs/jockey.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/shell/hover-reply.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/forms/form.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/forms/login.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/forms/signup.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/forms/space.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/forms/moveto.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/forms/user.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/forms/welcome.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/forms/no-access-to-space.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/forms/non-existing-space.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/forms/jockey.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/gruga/maindisc.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/gruga/createdisc.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/gruga/login.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/gruga/moveto.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/gruga/no-access-to-space.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/gruga/non-existing-space.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/gruga/signup.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/gruga/space.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/gruga/user.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/gruga/welcome.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/visual/para.js',
		'hasJoobj',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/visual/scrollbar.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/visual/doc.js',
		'hasJoobj',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/visual/item.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/visual/doc-item.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/visual/note.js',
		'hasJoobj',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/visual/label.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/visual/relation.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/visual/portal.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/visual/space.js',
		'hasJoobj',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/mm/sign.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/mm/change.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/mm/changeray.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/mm/meshmashine.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/shell/stubs.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/shell/system.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/mark/mark.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/mark/caret.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/mark/item.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/mark/range.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/mark/vacant.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/mark/widget.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/action/action.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/action/none.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/action/create-generic.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/action/create-relation.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/action/item-drag.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/action/item-resize.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/action/pan.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/action/scrolly.js',
		'hasJoobj',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/shell/shell.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/shell/fontloader.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/style.css',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/boldoblique-webfont.eot',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/boldoblique-webfont.svg',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/boldoblique-webfont.ttf',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/boldoblique-webfont.woff',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/bold-webfont.eot',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/bold-webfont.svg',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/bold-webfont.ttf',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/bold-webfont.woff',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/oblique-webfont.eot',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/oblique-webfont.svg',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/oblique-webfont.ttf',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/oblique-webfont.woff',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/webfont.eot',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/webfont.svg',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/webfont.ttf',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/webfont.woff',
		'maxage',
			'long'
	),

	// --- TestPad ---
	Resource.Create(
		'aliases',
			[ 'testpad.html' ],
		'filePath',
			'media/testpad.html',
		'devel',
			true,
		'postProcessor',
			'testPadHtml'
	),
	Resource.Create(
		'filePath',
			'src/testpad/iface-sym.js',
		'devel',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/testpad/action.js',
		'devel',
			true,
		'hasJoobj',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/testpad/testpad.js',
		'devel',
			true,
		'hasJoobj',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'aliases',
			[ 'torrent/PeridexisErrant%20LNP%20r53.torrent' ],
		'filePath',
			'torrent/PeridexisErrant%20LNP%20r53.torrent'
	),
];


} )( );
