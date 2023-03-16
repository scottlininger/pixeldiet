export default class GenericSite {

  constructor(settings = {}) {    
    this.seed(Math.random());
    
    this.audiosBySrc = {};
    this.window = settings.window || window;
    this.document = settings.document || this.window.document;
  }

  /**
   * A seed number for our random functions. Once you set a seed, subsequent
   * calls to random() will produce the same results in the same order.
   * @param {number|string} newSeed The new seed, which can be any number or
   *     string.
   * @return {number} The resulting numeric seed.
   * @private
   */
  seed (newSeed) {
    this.originalSeed = newSeed;
    if (typeof newSeed === 'string') {
      this.randomSeed = 10;
      for (var i = 0; i < newSeed.length; i++) {
        for (var j = 0; j <= i; j++) {
          this.randomSeed += (newSeed.charCodeAt(j) + 1);
        }
      }
    } else {
      this.randomSeed = newSeed;
    }
    return this.randomSeed;
  }

  /**
   * Gets a random float, using a seed from this.seed(). Useful because it
   * produces deterministic, repeatable random values based on the original
   * seed.
   * @return {number} A value between 0.0 and 1.0, not inclusive.
   * @global
   * @private
   */
  randomFloat () {
    var x = Math.sin(this.randomSeed++) * 10000;
    var result = x - Math.floor(x);
    return result;
  }


  /**
   * Rolls a random integer between two values. If only one is passed, choose
   * between 1 and that number.
   *
   * Alternatively, you can pass in a list of 3 or more values, and it will
   * choose between all of them. Or, you can pass in an array and it will
   * choose one thing from within the array.
   *
   * @param {number} a The first number.
   * @param {number} b The second number.
   * @return {number|object} The randomly generated number or randomly chosen
   *     object from the passed-in array.
   * @example 
   * // Get a random number between 0 and 100.
   * var randomNum = random(0, 100);
   * 
   * // Get a random element from an array.
   * var randomColor = random(['red', 'orange', 'yellow', 'green']);
   * 
   * // Get a random value from a list of 3 or more.
   * var randomStamp = random('apple', 'banana', 'burger');
   * @global
   */
  random (a, b) {

    // We start with the assumption that we do not have a list of
    // items to choose.
    var listOfItems = false;

    if (Array.isArray(a)) {
      listOfItems = a;
    } else if (arguments.length === 1 && typeof a !== 'number') {
      // If we only passed one thing in, that's the thing!
      return a;
    }

    // If we have 3 or more arguments, then choose from among them.
    if (arguments.length > 2) {
      listOfItems = arguments;
    }

    if (listOfItems) {
      // It's always possible one might accidentally pass in an empty array,
      // in which case, return null.
      if (listOfItems.length === 0) {
        return null;
      }
      return listOfItems[Math.floor(this.randomFloat() * listOfItems.length)];
    }

    // If we got this far, then it's just a numeric random we're running.
    var min = 1;
    var max = a;

    if (typeof b === 'number') {
      min = Math.min(a, b);
      max = Math.max(a, b);
    } else if (a < 0) {
      min = Math.min(a, -1);
      max = Math.max(a, -1);
    }
    var range = max - min + 1;
    var r = Math.floor(range * this.randomFloat());
    return min + r;
  }


  /**
   * Randomly shuffles an array in place.
   * https://stackoverflow.com/a/2450976/1293256
   * @param  {Array} array The array to shuffle
   * @return {Array} Reference to the array.
   */
  shuffle (array) {

    var currentIndex = array.length;
    var temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(this.randomFloat() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  /**
   * Plays a sound.
   * @param {string} src The relative or absolute url of the song to play. Note that
   *    if only the name of a sound is passed, like 'heart', then the system will attempt
   *    to load it from './mp3/heart.mp3'.
   * @param {volume} volume A number between 0 and 1. Defaults to 1. 
   * @return {Array} Reference to the array.
   */
  mp3 (src, volume = 1, onComplete, playbackRate) {
    if (!src.includes('.')) {
      src = './mp3/' + src + '.mp3';
    }

    var audio = this.audiosBySrc[src];

    if (!audio) {
      var audio = new Audio(src);
      this.audiosBySrc[src] = audio;
      audio.autoplay = true;
      audio.loop = true;
      this.audiosBySrc[src] = audio;
      audio.addEventListener('canplaythrough', event => {
        console.log('canplaythrough', audio);
        if (audio.paused) {
          audio.play();
        }
        audio.volume = 0;
        if (audio.src === this.currentAudioSrc) {
          this.fadeIn(src);
        }
      });
    }
    audio.onended = function() {
      if (onComplete) {
        onComplete(audio);
      }
    };
    audio.playbackRate = playbackRate || 1;
    //audio.volume = volume;
    audio.currentTime = 0;
    if (audio.paused) {
      console.log('playing', audio);
      audio.play();
    }
    audio.maxVolume = volume;
    
    if (this.currentAudioSrc !== src) {
      this.fadeIn(src);
    }
    if (this.currentAudioSrc) {
      console.log('fading out', this.currentAudioSrc);
      this.fadeOut(this.currentAudioSrc);
    }
    
    
    this.audiosBySrc[src] = audio;
    /*
    for (var key in this.audiosBySrc) {
      if (key !== src) {
        this.fadeOut(src);
      } else {
        this.fadeIn(src);
      }
    }
    */
    
    this.currentAudioSrc = src;
    //this.setMp3Volume(src, volume);
    return audio;
  }
  
  
  /**
   * Sets an Mp3 file's volume if playing. Value from 0 to 1.
   * @param {string} name The room to go to.
   */
  fadeOut (src) {
    var audio = this.audiosBySrc[src];
        console.log('fading out', src, audio.volume);

    if (audio) {
      if (audio.volume >= .1) {
        audio.volume = audio.volume - .1;
        setTimeout(function() {
          game.fadeOut(src);
        }, 500);
      } else {
        audio.volume = 0;
      }
    }
  }

  /**
   * Fades in an Mp3 audio's volume to 1.
   * @param {Audio} audio The audio.
   */
  fadeIn (src) {
    var audio = this.audiosBySrc[src];
        console.log('fading in', src, audio.volume);

    if (audio.volume < audio.maxVolume - .1) {
      audio.volume = audio.volume + .1;
      setTimeout(function() {
        game.fadeIn(src);
      }, 500);
    } else {
      audio.volume = audio.maxVolume;
    }
  }

  /**
   * Pauses execution for the given number of milliseconds.
   * @param {number} milliseconds The number of milliseconds to sleep for.
   * @global
   */
  sleep (milliseconds) {
    return new Promise((resolve, reject) => {
      var end = new Date();
      end.setTime(end.getTime() + milliseconds);

      function checkSleepDone() {
        if (Date.now() >= end) {
          resolve(true);
          return;
        }
        setTimeout(checkSleepDone, milliseconds);
      }
      checkSleepDone();
    });
  }
}
