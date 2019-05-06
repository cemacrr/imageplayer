/* ImagePlayer: */
var ImagePlayer = function(args) {

  /* get arguments: */
  var element      = (typeof args.element === 'undefined') ? null : args.element;
  var images       = (typeof args.images === 'undefined') ? [] : args.images;
  var align        = (typeof args.align === 'undefined') ? 'center' : args.align;
  var width        = (typeof args.width === 'undefined') ? '' : args.width;
  var height       = (typeof args.height === 'undefined') ? '' : args.height;
  var interval     = (typeof args.interval === 'undefined') ? 300 : args.interval;
  var autoplay     = (typeof args.autoplay === 'undefined') ? 1 : args.autoplay;
  var controls     = (typeof args.control === 'undefined') ? 1 : args.controls;
  var bgcolor      = (typeof args.bgcolor === 'undefined') ? '#383838' : args.bgcolor;
  var closebgcolor = (typeof args.closebgcolor === 'undefined') ? 'rgba(56, 56, 56, 0.5)' : args.closebgcolor;
  var closecolor   = (typeof args.closecolor === 'undefined') ? '#ffffff' : args.closecolor;
  var icondir      = (typeof args.icondir === 'undefined') ? 'images' : args.icondir;

  /* get reference to self: */
  var _self = this;

  /* html div element to use: */
  this.element           = document.getElementById(element);
  /* style of div element: */
  this._position         = this.element.style.position || null;
  this._width            = this.element.style.width || width;
  this._height           = this.element.style.height || height;
  this._maxwidth         = this.element.style.maxWidth || null;
  this._maxheight        = this.element.style.maxHeight || null;
  this._zIndex           = this.element.style.zIndex || null;
  this._top              = this.element.style.top || null;
  this._left             = this.element.style.left || null;
  this._backgroundcolor  = this.element.style.backgroundColor || null;
  this._border           = this.element.style.border || null;
  this._margin           = this.element.style.margin || null;
  this._padding          = this.element.style.padding || null;
  this._paddingtop       = this.element.style.paddingTop || null;
  this._paddingbottom    = this.element.style.paddingBottom || null;
  this._paddingleft      = this.element.style.paddingLeft || null;
  this._paddingright     = this.element.style.paddingRight || null;
  this._fullscreen       = false;
  /* alignment: */
  this._align            = align;
  /* background color for full screen / controls : */
  this.bgcolor           = bgcolor;
  this.closebgcolor      = closebgcolor;
  this.closecolor        = closecolor;
  /* full screen close element: */
  this._fsclose          = null;
  /* img element: */
  this._img              = null;
  /* img style: */
  this._imgwidth         = null;
  this._imgheight        = null;
  this._imgobjectfit     = null;
  this._imgpaddingtop    = null;
  this._imgpaddingbottom = null;
  /* array of images to play: */
  this.images            = images;
  /* number of images: */
  this.length            = this.images.length;
  /* images which have been fetched: */
  this._fetched          = [];
  /* current image index: */
  this.index             = null;
  /* previous image index: */
  this.prev              = null;
  /* next image index: */
  this.next              = null;
  /* interval between images: */
  this.interval          = interval;
  /* used to store js interval details: */
  this._interval         = null;
  /* auto play on or off: */
  this.autoplay          = autoplay;
  /* controls on / off: */
  this.controls          = controls;
  /* div for controls: */
  this._controls         = document.createElement('div');
  this._controlsheight   = 35;
  /* padding and height for controls: */
  this._controlpadding   = 5;
  this._controlheight    = this._controlsheight - (2 * this._controlpadding);
  /* control elements: */
  this._controlsplay     = null;
  this._controlsfull     = null;
  this._controlsfirst    = null;
  this._controlslast     = null;
  this._controlsprev     = null;
  this._controlsnext     = null;
  /* directory containing icons for controls: */
  this.icondir           = icondir;
  /* icon file names: */
  this._iconplay         = this.icondir + '/' + 'play.png';
  this._iconpause        = this.icondir + '/' + 'pause.png';
  this._iconfull         = this.icondir + '/' + 'full.png';
  this._iconfirst        = this.icondir + '/' + 'first.png';
  this._iconlast         = this.icondir + '/' + 'last.png';
  this._iconprev         = this.icondir + '/' + 'prev.png';
  this._iconnext         = this.icondir + '/' + 'next.png';
  /* state defaults to stopped: */
  this.state             = 'stopped';

  /* functon to set indexes: */
  this._setIndexes = function(obj, i) {
    /* set current index to specified value: */
    obj.index = i;
    /* if index is 0 ... : */
    if (i == 0) {
      /* previous is last image: */
      obj.prev = obj.length - 1;
      /* next is 1 modulus length: */
      obj.next = 1 % (obj.length)
    } else {
      /* else, previous is index - 1: */
      obj.prev = i - 1;
      /* next is i + 1 modulus number of images: */
      obj.next  = (i + 1) % (obj.length)
    }
  }
  this.setIndexes = function(i) {
    _self._setIndexes(_self, i);
  }

  /* function to (pre) fetch images: */
  this._fetchImages = function(obj, imgs) {
    /* pre-fetch new next and previous image: */
    for (var i = 0; i < imgs.length; i++) {
      /* if not previously fetched: */
      if (obj._fetched.indexOf(i) == -1) {
        /* use XMLHttpRequest to grab images: */
        var _xhr = new XMLHttpRequest();
        _xhr.open('GET', obj.images[i], true);
        _xhr.send(null);
        /* add to list of fetched images: */
        obj._fetched.push(i)
      }
    }
  }
  this.fetchImages = function(imgs) {
    _self._fetchImages(_self, imgs);
  }

  /* function to set / display image: */
  this._setImage = function(obj) {
    /* set the image: */
    obj._img.src = obj.images[obj.index];
  }
  this.setImage = function() {
    _self._setImage(_self);
  }

  /* go to previous image function: */
  this._prevImage = function(obj) {
    /* set indexes: */
    obj.setIndexes(obj.prev);
    /* set image: */
    obj.setImage();
    /* pre-fetch new previous image: */
    obj.fetchImages([obj.prev]);
  }
  this.prevImage = function() {
    _self._prevImage(_self);
  }

  /* go to next image function: */
  this._nextImage = function(obj) {
    /* set indexes: */
    obj.setIndexes(obj.next);
    /* set image: */
    obj.setImage();
    /* pre-fetch new next image: */
    obj.fetchImages([obj.next]);
  }
  this.nextImage = function() {
    _self._nextImage(_self);
  }

  /* go to first image function: */
  this._firstImage = function(obj) {
    /* set indexes: */
    obj.setIndexes(0);
    /* set image: */
    obj.setImage();
  }
  this.firstImage = function() {
    _self._firstImage(_self);
  }

  /* go to last image function: */
  this._lastImage = function(obj) {
    /* set indexes: */
    obj.setIndexes(obj.length - 1);
    /* set image: */
    obj.setImage();
  }
  this.lastImage = function() {
    _self._lastImage(_self);
  }

  /* 'play' using setInterval(): */
  this._play = function(obj) {
    /* if not already playing: */
    if (obj.state != 'playing') {
      /* setInterval()!: */
      obj._interval = setInterval(obj.nextImage, obj.interval);
      /* if controls are requested: */
      if (obj.controls == 1) {
        /* update icon: */
        obj._controlsplay.src = obj._iconpause;
        /* switch listeners: */
        obj._controlsplay.removeEventListener('click', obj.play);
        obj._controlsplay.addEventListener('click', obj.stop);
        /* hide forward / backward controls: */
        obj._controlsfirst.style.visibility = 'hidden';
        obj._controlsprev.style.visibility  = 'hidden';
        obj._controlsnext.style.visibility  = 'hidden';
        obj._controlslast.style.visibility  = 'hidden';
      }
      /* update state: */
      obj.state = 'playing';
    }
  }
  this.play = function() {
    _self._play(_self);
  }

  /* stop by clearing interval: */
  this._stop = function(obj) {
    /* if not already stopped: */
    if (obj.state != 'stopped') {
      /* clearInterval()!: */
      clearInterval(obj._interval);
      /* if controls are requested: */
      if (obj.controls == 1) {
        /* update icon: */
        obj._controlsplay.src = obj._iconplay;
        /* switch listeners: */
        obj._controlsplay.removeEventListener('click', obj.stop);
        obj._controlsplay.addEventListener('click', obj.play);
        /* show forward / backward controls: */
        obj._controlsfirst.style.visibility = 'visible';
        obj._controlsprev.style.visibility  = 'visible';
        obj._controlsnext.style.visibility  = 'visible';
        obj._controlslast.style.visibility  = 'visible';
      }
      /* update state: */
      obj.state = 'stopped';
    }
  }
  this.stop = function() {
    _self._stop(_self);
  }

  /* toggle full screen close: */
  this._toggleFullScreenClose = function(obj) {
    /* if no close element: */
    if (obj._fsclose == null) {
      /* add close element: */
      obj._fsclose = document.createElement('span');
      obj.element.appendChild(obj._fsclose);
      obj._fsclose.innerHTML             = '&times;';
      obj._fsclose.style.position        = 'fixed';
      obj._fsclose.style.top             = '15px';
      obj._fsclose.style.right           = '15px';
      obj._fsclose.style.color           = obj.closecolor;
      obj._fsclose.style.backgroundColor = obj.closebgcolor;
      obj._fsclose.style.fontSize        = 'xx-large';
      obj._fsclose.style.fontWeight      = 'bold';
      obj._fsclose.style.zIndex          = 999999;
      obj._fsclose.style.textDecoration  = 'none';
      obj._fsclose.style.cursor          = 'pointer';
      obj._fsclose.style.display         = 'none';
      /* add listener: */
      obj._fsclose.addEventListener('click', obj.toggleFullScreen);
      /* add mouseover listeners for hovering: */
      obj._fsclose.addEventListener('mouseover', function() {
                                                   obj._fsclose.style.color = '#cccccc';
                                                 });
      obj._fsclose.addEventListener('mouseout', function() {
                                                  obj._fsclose.style.color = obj.closecolor;
                                                });
    }
    /* if fullscreen: */
    if (obj._fullscreen) {
      obj._fsclose.style.display = 'block';
    } else {
      obj._fsclose.style.display = 'none';
    }
  }
  this.toggleFullScreenClose = function() {
    _self._toggleFullScreenClose(_self);
  }

  /* toggle full screen function: */
  this._toggleFullScreen = function(obj) {
    /* if fullscreen: */
    if (obj._fullscreen) {
      /* reset style: */
      obj.element.style.position        = obj._position;
      obj.element.style.width           = obj._width;
      obj.element.style.height          = obj._height;
      obj.element.style.waxWidth        = obj._maxwidth;
      obj.element.style.waxHeight       = obj._maxheight;
      obj.element.style.zIndex          = obj._zIndex;
      obj.element.style.top             = obj._top;
      obj.element.style.left            = obj._left;
      obj.element.style.backgroundColor = obj._backgroundcolor;
      obj.element.style.border          = obj._border;
      obj.element.style.margin          = obj._margin;
      obj.element.style.padding         = obj._padding;
      obj.element.style.paddingTop      = obj._paddingtop;
      obj.element.style.paddingBottom   = obj._paddingbottom;
      obj.element.style.paddingLeft     = obj._paddingleft;
      obj.element.style.paddingRight    = obj._paddingright;
      obj._img.style.maxHeight          = 'calc(100% - ' + obj._controlsheight + 'px)';
      obj._img.style.height             = obj._imgwidth;
      obj._img.style.width              = obj._imgheight;
      obj._img.style.objectFit          = obj._imgobjectfit;
      obj._img.style.paddingTop         = obj._imgpaddingtop;
      obj._img.style.paddingBottom      = obj._imgpaddingbottom;
      if (obj._align == 'left') {
        obj._img.style.margin      = '';
        obj._img.style.marginRight = 'auto';
        if (obj.controls == 1) {
          obj._controls.style.margin      = '';
          obj._controls.style.marginRight = 'auto';
        }
      } else if (obj._align == 'right') {
        obj._img.style.margin      = '';
        obj._img.style.marginLeft = 'auto';
        if (obj.controls == 1) {
          obj._controls.style.margin     = '';
          obj._controls.style.marginLeft = 'auto';
        }
      }
      obj._fullscreen                   = false;
      obj.toggleFullScreenClose();
    } else {
      /* go full screen: */
      obj.element.style.position        = 'fixed';
      obj.element.style.width           = '100%';
      obj.element.style.height          = '100%';
      obj.element.style.maxWidth        = '100%';
      obj.element.style.maxHeight       = '100%';
      obj.element.style.zIndex          = 99999;
      obj.element.style.top             = 0;
      obj.element.style.left            = 0;
      obj.element.style.backgroundColor = obj.bgcolor;
      obj.element.style.border          = '0px';
      obj.element.style.margin          = 'auto';
      obj.element.style.padding         = '0px';
      obj.element.style.paddingTop      = '0px';
      obj.element.style.paddingBottom   = '0px';
      obj.element.style.paddingLeft     = '0px';
      obj.element.style.paddingRight    = '0px';
      obj._img.style.paddingTop         = '10px';
      obj._img.style.paddingBottom      = '10px';
      obj._img.style.maxHeight          = 'calc(90% - ' + obj._controlsheight + 'px - ' + obj._img.style.paddingTop + ' - ' + obj._img.style.paddingBottom + ')';
      obj._img.style.height             = '90%';
      obj._img.style.width              = '90%';
      obj._img.style.objectFit          = 'contain';
      obj._img.style.margin             = 'auto';
      if (obj.controls == 1) {
        obj._controls.style.margin = 'auto';
      }
      obj._fullscreen                   = true;
      obj.toggleFullScreenClose();
    }
  }
  this.toggleFullScreen = function() {
    _self._toggleFullScreen(_self);
  }

  /* add control element (play, etc.): */
  this._addControl = function(obj, icon, func) {
    /* padding and height values: */
    var controlPadding = obj._controlpadding + 'px';
    var controlHeight  = obj._controlheight + 'px';
    /* create element: */
    var element = document.createElement('img');
    obj._controls.appendChild(element);
    element.src           = icon;
    element.style.cursor  = 'pointer';
    element.style.padding = controlPadding;
    element.style.height  = controlHeight;
    /* regex for hover images: */
    var reon      = new RegExp('.png$', 'g');
    var reout     = new RegExp('_hover.png$', 'g');
    /* add listeners: */
    element.addEventListener('mouseover', function() {
                                            element.src = element.src.toString().replace(reon, '_hover.png');
                                          })
    element.addEventListener('mouseout', function() {
                                           element.src = element.src.toString().replace(reout, '.png');
                                         })
    element.addEventListener('click', func);
    return element;
  }
  this.addControl = function(icon, func) {
    return _self._addControl(_self, icon, func);
  }

  /* set controls width: */
  this._setControlsWidth = function(obj) {
    /* set width to be equal to image width: */
    obj._controls.style.width = obj._img.width + 'px';
  }
  this.setControlsWidth = function() {
    _self._setControlsWidth(_self);
  }

  /* add controls: */
  this._addControls = function(obj) {
    /* update img style: */
    obj._img.style.maxHeight = 'calc(100% - ' + obj._controlsheight + 'px)';
    /* controls div: */
    var controlsDiv = obj._controls;
    obj.element.appendChild(controlsDiv);
    /* style: */
    controlsDiv.style.maxWidth        = '100%';
    controlsDiv.style.height          = obj._controlsheight + 'px';
    controlsDiv.style.backgroundColor = obj.bgcolor;
    controlsDiv.style.overflow        = 'hidden';
    if (obj._align == 'left') {
      controlsDiv.style.marginRight = 'auto';
    } else if (obj._align == 'right') {
      controlsDiv.style.marginLeft = 'auto';
    } else {
      controlsDiv.style.margin = 'auto';
    }
    /* play / pause button: */
    obj._controlsplay = obj.addControl(obj._iconplay, obj.play);
    /* full screen button: */
    obj._controlsfull = obj.addControl(obj._iconfull, obj.toggleFullScreen);
    /* first image button: */
    obj._controlsfirst = obj.addControl(obj._iconfirst, obj.firstImage);
    /* previous / back button: */
    obj._controlsprev = obj.addControl(obj._iconprev, obj.prevImage);
    /* next button: */
    obj._controlsnext = obj.addControl(obj._iconnext, obj.nextImage);
    /* last image button: */
    obj._controlslast = obj.addControl(obj._iconlast, obj.lastImage);
  }
  this.addControls = function(id) {
    _self._addControls(_self);
  }

  /* function to init the image player: */
  this._initPlayer = function(obj) {
    /* set div style: */
    obj.element.style.textAlign = 'center';
    /* add img element: */
    obj._img = document.createElement('img');
    obj.element.appendChild(obj._img);
    /* set style: */
    obj._img.style.maxWidth  = '100%';
    obj._img.style.maxHeight = '100%';
    obj._img.style.display   = 'block';
    if (obj._align == 'left') {
      obj._img.style.marginRight = 'auto';
    } else if (obj._align == 'right') {
      obj._img.style.marginLeft = 'auto';
    } else {
      obj._img.style.margin = 'auto';
    }
    /* set indexes: */
    obj.setIndexes(0);
    /* set image: */
    obj.setImage();
    /* on image load .... : */
    obj._img.onload = function() {
      /* strip 'px' from height and width values: */
      var re = new RegExp('px', 'g');
      obj._width  = obj._width.toString().replace(re, '');
      obj._height = obj._height.toString().replace(re, '');
      /* only if no height or width set: */
      if ((obj._width == '') &&
          (obj._height == '')) {
        /* get width and height from image: */
        obj._width  = obj._img.width;
        obj._height = obj._img.height;
      /* else ... if just width provided: */
      } else if (obj._height == '') {
        /* calculate appropriate height: */
        obj._height = Math.round((obj.width / this.width) * this.height);
      /* else ... if just height provided: */
      } else if (obj._width == '') {
        /* calculate appropriate width: */
        obj._width  = Math.round((obj._height / this.height) * this.width);
      }
      /* if controls are requested: */
      if (obj.controls == 1) {
        /* recalculate width: */
        obj._width  = Math.round(((obj._height - obj._controlsheight) / this.height) * this.width);
        /* add controls: */
        obj.addControls();
      }
      /* if auto play is set: */
      if (obj.autoplay == 1) {
        /* start playing: */
        obj.play();
      } else {
        /* pre-fetch previous and next images: */
        obj.fetchImages([obj.prev, obj.next]);
      }
      /* save img style: */
      obj._imgwidth     = obj._img.style.width;
      obj._imgheight    = obj._img.style.height;
      obj._imgobjectfit = obj._img.style.objectFit;
      /* set width and height: */
      obj._width               = obj._width + 'px';
      obj._height              = obj._height + 'px';
      obj.element.style.width  = obj._width;
      obj.element.style.height = obj._height;
      /* if controls are requested: */
      if (obj.controls == 1) {
        /* set controls width: */
        obj.setControlsWidth();
        /* add resize listener: */
        window.addEventListener('resize', obj.setControlsWidth);
      }
      /* clear onload: */
      obj._img.onload = null;
    }
  }
  this.initPlayer = function() {
    _self._initPlayer(_self);
  }

  /* if we have an html element and some images: */
  if ((_self.element != null) &&
      (_self.length > 0)) {
    /* init: */
    _self.initPlayer();
  }

}
