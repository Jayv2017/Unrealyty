
/////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////BACKGROUND//////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////



(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    window.requestAnimationFrame = requestAnimationFrame;
})();

// Terrain stuff.
var background = document.getElementById("bgCanvas"),
    bgCtx = background.getContext("2d"),
    width = window.innerWidth,
    height = document.body.offsetHeight;

(height < 400) ? height = 400 : height;

background.width = width;
background.height = height;

function Terrain(options) {
    options = options || {};
    this.terrain = document.createElement("canvas");
    this.terCtx = this.terrain.getContext("2d");
    this.scrollDelay = options.scrollDelay || 90;
    this.lastScroll = new Date().getTime();

    this.terrain.width = width;
    this.terrain.height = height;
    this.fillStyle = options.fillStyle || "#330080";
    this.mHeight = options.mHeight || height;

    // generate
    this.points = [];

    var displacement = options.displacement || 140,
        power = Math.pow(2, Math.ceil(Math.log(width) / (Math.log(2))));

    // set the start height and end height for the terrain
    this.points[0] = this.mHeight;//(this.mHeight - (Math.random() * this.mHeight / 2)) - displacement;
    this.points[power] = this.points[0];

    // create the rest of the points
    for (var i = 1; i < power; i *= 2) {
        for (var j = (power / i) / 2; j < power; j += power / i) {
            this.points[j] = ((this.points[j - (power / i) / 2] + this.points[j + (power / i) / 2]) / 2) + Math.floor(Math.random() * -displacement + displacement);
        }
        displacement *= 0.6;
    }

    document.body.appendChild(this.terrain);
}

Terrain.prototype.update = function () {
    // draw the terrain
    this.terCtx.clearRect(0, 0, width, height);
    this.terCtx.fillStyle = this.fillStyle;
    
    if (new Date().getTime() > this.lastScroll + this.scrollDelay) {
        this.lastScroll = new Date().getTime();
        this.points.push(this.points.shift());
    }

    this.terCtx.beginPath();
    for (var i = 0; i <= width; i++) {
        if (i === 0) {
            this.terCtx.moveTo(0, this.points[0]);
        } else if (this.points[i] !== undefined) {
            this.terCtx.lineTo(i, this.points[i]);
        }
    }

    this.terCtx.lineTo(width, this.terrain.height);
    this.terCtx.lineTo(0, this.terrain.height);
    this.terCtx.lineTo(0, this.points[0]);
    this.terCtx.fill();
}


// Second canvas used for the stars
bgCtx.fillStyle = '#05004c';
bgCtx.fillRect(0, 0, width, height);

// stars
function Star(options) {
    this.size = Math.random() * 4;
    this.speed = Math.random() * .05;
    this.x = options.x;
    this.y = options.y;
}

Star.prototype.reset = function () {
    this.size = Math.random() * 3;
    this.speed = Math.random() * .05;
    this.x = width;
    this.y = Math.random() * height;
}

Star.prototype.update = function () {
    this.x -= this.speed;
    if (this.x < 0) {
        this.reset();
    } else {
        bgCtx.fillRect(this.x, this.y, this.size, this.size);
    }
}

function ShootingStar() {
    this.reset();
}

ShootingStar.prototype.reset = function () {
    this.x = Math.random() * width;
    this.y = 0;
    this.len = (Math.random() * 80) + 10;
    this.speed = (Math.random() * 10) + 6;
    this.size = (Math.random() * 1) +1.5;
    // this is used so the shooting stars arent constant
    this.waitTime = new Date().getTime() + (Math.random() * 3000) + 500;
    this.active = false;
}

ShootingStar.prototype.update = function () {
    if (this.active) {
        this.x -= this.speed;
        this.y += this.speed;
        if (this.x < 0 || this.y >= height) {
            this.reset();
        } else {
            bgCtx.lineWidth = this.size;
            bgCtx.beginPath();
            bgCtx.moveTo(this.x, this.y);
            bgCtx.lineTo(this.x + this.len, this.y - this.len);
            bgCtx.stroke();
        }
    } else {
        if (this.waitTime < new Date().getTime()) {
            this.active = true;
        }
    }
}

var entities = [];

// init the stars
for (var i = 0; i < height; i++) {
    entities.push(new Star({
        x: Math.random() * width,
        y: Math.random() * height
    }));
}



// Add 2 shooting stars that just cycle.
entities.push(new ShootingStar());
entities.push(new ShootingStar());
entities.push(new Terrain({mHeight : (height/2)-120}));
entities.push(new Terrain({displacement : 170, scrollDelay : 50, fillStyle : "#5500AE", mHeight : (height/2)-60}));
entities.push(new Terrain({displacement : 150, scrollDelay : 20, fillStyle : "#8E06E0", mHeight : height/2}));

//animate background
function animate() {
    bgCtx.fillStyle = 'black';
    bgCtx.fillRect(0, 0, width, height);
    bgCtx.fillStyle = '#00CAF6';
    bgCtx.strokeStyle = '#00caf6';

    var entLen = entities.length;

    while (entLen--) {
        entities[entLen].update();
    }
    requestAnimationFrame(animate);
}
animate();


/////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////NAVBAR//////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////


const menuBar = document.querySelector('.menu-bar');
const navBar = document.querySelector('.nav-bar');

menuBar.addEventListener('click', () => {
  navBar.classList.toggle('toggle');
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////HEADING AND SUBHEADING///////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

Letters = function() {
    this.lettersDOM = null;
    this.active = null;
    this.letters = [];
    this.alphabet = ["a", "b", "c", "d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","i","u","v","w","x","y","z","~","&","|","^","ç","@","]","[","{","}","ù","*","µ","¤","$","£","€","°",")","é","è","1","2","3","4","5","6","7","8","9","0"
    ];

    return this;
};

Letters.prototype.init = function( word ) {
    
    this.lettersDOM = document.querySelectorAll('.letter');
    this.active = true;
    var i;
    var nextChar;
    var lettersMax = this.lettersDOM.length;
    
    for ( i = 0; i < this.lettersDOM.length; i++ ) {

        if ( word.charAt( i ) != "" )
        nextChar = word.charAt( i );
        else 
        nextChar = false;
        this.letters.push( new Letter( this.lettersDOM[ i ],  nextChar ) );
    }
    
    if ( word.length > lettersMax ) {
        var wordContainer = document.getElementById("word");
        for ( i = lettersMax; i < word.length; i++ ) {
        var letterSpan = document.createElement('span');
        letterSpan.innerHTML = "";
        letterSpan.classList.add('letter');
        wordContainer.appendChild( letterSpan );
        this.letters.push( new Letter( letterSpan,  word.charAt( i ) ) );
        }
    }
    
    this.animate();
    
    return this;
    
};

    Letters.prototype.animate = function() {
    var i;
    var random;
    var char;
    
    if ( this.active ) {

        window.requestAnimationFrame( this.animate.bind(this) );
        var indexes = [];

        for ( i = 0; i < this.letters.length; i++ ) {
        var current = this.letters[ i ];  
        
        if ( !current.isDead ) {     
          random = Math.floor(Math.random() * (this.alphabet.length - 0));
            char = this.alphabet[ random ]; 
            current.render( char );
        } else {
            indexes.push( i );
        }
    } 
        for ( i = 0; i < indexes.length; i++ ) {
        this.letters.splice( indexes[ i ], 1 );
        }
        if ( this.letters.length == 0 ) {
        this.stop();
        }
    }
};

Letters.prototype.start = function( word ) {
    this.init( word );
};

Letters.prototype.stop = function() {
    this.active = false;
};

Letter = function( DOMElement, nextChar ) {
    
    var scope = this;
    
    this.DOMEl = DOMElement;
    this.char = DOMElement.innerHTML;
    this.next = nextChar;
    this.speed = Math.floor(Math.random() * (300 - 50) );
    this.total = 0;
    this.duration = 500;
    this.animating = true;
    this.isDead = false;
    
    this.timer = setInterval(function() { 
        if ( scope.animating === true ) {
        scope.total += scope.speed;
        } 
        scope.animating = !scope.animating;
    }, this.speed);
    this.animate();
    
    return this;
};

Letter.prototype.animate = function() {
    var i;
    var random;
    
    if ( !this.isDead ) {
        window.requestAnimationFrame( this.animate.bind(this) );
    }
    
    
    if ( this.total < this.duration ) {
        if ( this.animating ) {
        this.DOMEl.innerHTML = this.char;
        }
        
    } else {
        this.isDead = true;
        if ( !this.next ) {
        var parent = document.getElementById('word');
        parent.removeChild( this.DOMEl );
        return;
        }
        this.DOMEl.innerHTML = this.next;
    }
};

Letter.prototype.render = function( char ) {
    
    if ( !this.animating ) {
        this.char = char;
    }
    
};

var word = [ "REALITY?", "UNREALYTY" ];
var nextWord = 1;
var letters = new Letters();

setTimeout( function() {
    
    letters.start( word[ nextWord ] );
    
    setInterval(function() {
        nextWord++;
        if ( nextWord >= word.length )
        nextWord = 0;
    }, 10000);
    
}, 2000);
