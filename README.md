## ImagePlayer

Javascript image player.

An alternative to animated GIFs.

There are probably better ways of doing this ...

Existing GIF files can be exploded with ImageMagick, e.g.:

```bash
$ convert file.gif -coalesce file%03d.jpg
$ ls -1
file.gif
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
<script src="imageplayer.min.js"></script>
```

Create a new image player, specifying the ID of the HTML element (probably a `<div>`) in which the player can be inserted, and the images to use, e.g.:

```js
ip = new ImagePlayer({
  element: 'ipDiv',
  images: [
    'example/file000.jpg',
    'example/file001.jpg',
    'example/file002.jpg',
    'example/file003.jpg',
    'example/file004.jpg',
    'example/file005.jpg',
    'example/file006.jpg',
    'example/file007.jpg',
    'example/file008.jpg',
    'example/file009.jpg'
  ],
  autoplay: 0,
  interval: 150,
  icondir:  'images'
});
```

#### Options

Required options:

  * `element`: The ID of the HTML element in which the player will be inserted
  * `images`: An array of image files to used in the player

Optional options:

  * `width`: The width, in pixels, to set for the `<div>` containing the player.
  * `height`: The height, in pixels, to set for the `<div>` containing the player.
  * `align`: Alignment within the `<div>`. Options: `left`, `right`, `center`. Default: `center`.
  * `interval`: The interval in milliseconds between updating images. Default: `300`.
  * `autoplay`: Whether to start playing automatically. Set to `1` for true, `0` for false. Default: `1`.
  * `controls`: Whether controls should be displayed. Set to `1` for true, `0` for false. Default: `1`.
  * `bgcolor`: Background colour to use for full screen mode and controls. Default: `#383838`.
  * `closebgcolor`: Background colour for full screen close icon. Default: `rgba(56, 56, 56, 0.5)`.
  * `closecolor`: Foreground colour for full screen close icon. Default: `#ffffff`
  * `icondir`: Path to directory containing control icon images (`play.png`, etc.). Default: `images`.
  * `startindex`: Image index from which the player should start. Default `0`.

### Example

  * [https://cemacrr.github.io/imageplayer/](https://cemacrr.github.io/imageplayer/)
