## ImagePlayer

Javascript image player.

An alternative to animated GIFs.

Existing GIF files can be exploded with ImageMagick, e.g.:

```bash
$ convert 00.gif -coalesce file%03d.jpg
$ ls -1
00.gif
file000.jpg
file001.jpg
file002.jpg
file003.jpg
...
```

### Usage

Include the Javascript in the web page, e.g.:

```html
<script src="imageplayer.js"></script>
```

Minified version:

```html
<script src="js/imageplayer.min.js"></script>
```

Create a new image player, specifying the ID of the HTML element (probably a `<div>`) in which the player can be inserted, and the images to use, e.g.:

```js
ip = new ImagePlayer({
  element: 'ipDiv',
  images: [
    'images/00/file00.jpg',
    'images/00/file01.jpg',
    'images/00/file02.jpg',
    'images/00/file03.jpg'
  ],
  autoplay: 0,
  interval: 250,
  icondir:  'images/controls'
});

#### Options

Required options:

  * `element`: The ID of the HTML element in which the player will be inserted
  * `images`: An array of image files to used in the player

Optional options:

  * `width`: The width, in pixels, to set for the `<div>` containing the player.
  * `height`: The height, in pixels, to set for the `<div>` containing the player.
  * `interval`: The interval in milliseconds between updating images. Default: `300`.
  * `autoplay`: Whether to start playing automatically. Set to `1` for true, `0` for false. Default: `1`.
  * `controls`: Whether controls should be displayed. Set to `1` for true, `0` for false. Default: `1`.
  * `bgcolor`: Background colour to use for full screen mode and controls. Default: `#383838`.
  * `closebgcolor`: Background colour for full screen close icon. Default: `rgba(56, 56, 56, 0.5)`.
  * `closecolor`: Foreground colour for full screen close icon. Default: `#ffffff`
  * `icondir`: Path to directory containing control icon images (`play.png`, etc.). Default: `images`.

### Example


