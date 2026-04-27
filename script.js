customElements.define("tag-loading-text", class extends HTMLElement{});
customElements.define("tag-loading-bar", class extends HTMLElement{});
customElements.define("tag-canvas-particule", class extends HTMLElement{});
customElements.define("tag-name", class extends HTMLElement{});
customElements.define("tag-letter", class extends HTMLElement{});
customElements.define("tag-back", class extends HTMLElement{});
customElements.define("tag-overlay-header", class extends HTMLElement{});
customElements.define("tag-overtitle-header", class extends HTMLElement{});
customElements.define("tag-title-header", class extends HTMLElement{});
customElements.define("tag-subtitle-header", class extends HTMLElement{});
customElements.define("tag-scroll-down-header", class extends HTMLElement{});
customElements.define("tag-overlay-gallery", class extends HTMLElement{});
customElements.define("tag-overmaintitle-gallery", class extends HTMLElement{});
customElements.define("tag-maintitle-gallery", class extends HTMLElement{});
customElements.define("tag-button-gallery", class extends HTMLElement{});
customElements.define("tag-media-gallery", class extends HTMLElement{});
customElements.define("tag-overlay-footer", class extends HTMLElement{});
customElements.define("tag-line-footer", class extends HTMLElement{});
customElements.define("tag-contact-footer", class extends HTMLElement{});
customElements.define("tag-input-contact-footer", class extends HTMLElement{});
customElements.define("tag-submit-contact-footer", class extends HTMLElement{});
customElements.define("tag-response-contact", class extends HTMLElement{});

let _stateLoading = 1;
let _tagLoadingText = null;
let _tagLoadingBar = null;
let _tagCanvasParticule = null;
let _webGL = null;
let _orientationScreen = 1;
let _rxAccelerometer = 0;
let _ryAccelerometer = 0;
let _rzAccelerometer = 0;
let _tagName = null;
let _tagLetter = [];
let _widthLetter = [];
let _countTagLetter = 0;
let _tagBack = null;
let _tagOverlayHeader = null;
let _tagOvertitleHeader = null;
let _tagTitleHeader = null;
let _tagSubtitleHeader = null;
let _tagScrollDownHeader = null;
let _tagOverlayGallery = null;
let _tagOvermaintitleGallery = null;
let _tagMaintitleGallery = null;
let _tagButtonGallery = [];
let _countTagButton = 0;
let _tagMediaGallery = [];
let _tagImg = [];
let _countTagMediaImg = 0;
let _eventScroll = 0;
let _tagOverlayFooter = null;
let _tagLineFooter = null;
let _tagContactFooter = null;
let _tagInputContactFooter = null;
let _tagSubmitContactFooter = null;
let _tagResponseContact = null;
let _foundTagBack = true;
let _foundTagOverlayHeader = true;
let _translateSmooth = 0;
let _stateBackAnimation = 0;
let _stateButtonAnimation = 0;
let _indexButton = 0;
let _stateResponseAnimation = 0;
let _stateResponseServer = 0;
let _stateMediaAnimation = 0;
let _indexMedia = 0;
let _inhibitClick = false;

function fitText(tag, fontSize, letterSpacing, lineHeight)
{
    const PARENT = tag.parentElement;
    const RATIO_LETTER_SPACING = letterSpacing / fontSize;
    const RATIO_LINE_HEIGHT = lineHeight / fontSize;
    
    tag.style.visibility = "hidden";
    tag.style.fontSize = fontSize + "px";
    tag.style.letterSpacing = letterSpacing + "px";
    tag.style.lineHeight = lineHeight + "px";
    
    while (tag.scrollWidth > PARENT.clientWidth)
    {
        fontSize--;
        
        letterSpacing = fontSize * RATIO_LETTER_SPACING;
        lineHeight = fontSize * RATIO_LINE_HEIGHT;
        
        tag.style.fontSize = fontSize + "px";
        tag.style.letterSpacing = letterSpacing + "px";
        tag.style.lineHeight = lineHeight + "px";
    }
    
    tag.style.visibility = "visible";
}

function randomBinary(a, b)
{
    return Math.random() < 0.5 ? a : b;
}

function randomInteger(min, max)
{
    return min + Math.floor(Math.random() * ((max - min) + 1));
}

function randomFloat(min, max)
{
    return min + (Math.random() * (max - min));
}

function clamp(value, min, max)
{
    let valueClamp = value;
    
    if (valueClamp < min)
    {
        valueClamp = min;
    }
    else if (valueClamp > max)
    {
        valueClamp = max;
    }
    
    return valueClamp;
}

function clampPositiveSymmetricalMinMax(value, minMax)
{
    let valueClamp = value / minMax;
    
    if (value < 0)
    {
        valueClamp *= -1;
    }
    
    if (value > minMax)
    {
        valueClamp = 1;
    }
    
    return valueClamp;
}

function tag()
{
    const TAG_LETTER_IN_DOCUMENT = document.querySelectorAll("body tag-letter");
    const TAG_BUTTON_IN_DOCUMENT = document.querySelectorAll("body tag-button-gallery");
    const TAG_MEDIA_IN_DOCUMENT = document.querySelectorAll("body tag-media-gallery");
    const TAG_IMG_IN_DOCUMENT = document.querySelectorAll("body img");
    
    _tagLoadingText = document.getElementById("tag-loading-text");
    _tagLoadingBar = document.getElementById("tag-loading-bar");
    
    _tagCanvasParticule = document.getElementById("tag-canvas-particule");
    
    _tagName = document.getElementById("tag-name");
    
    TAG_LETTER_IN_DOCUMENT.forEach((tag, index) =>
    {
        const RECTANGLE_LETTER = tag.getBoundingClientRect();
        
        _tagLetter[index] = tag;
        _widthLetter[index] = RECTANGLE_LETTER.width;
        
        _countTagLetter++;
    });
    
    _tagBack = document.getElementById("tag-back");
    
    if (_tagBack === null)
    {
        _foundTagBack = false;
    }
    
    _tagOverlayHeader = document.getElementById("tag-overlay-header");
    
    if (_tagOverlayHeader === null)
    {
        _foundTagOverlayHeader = false;
    }
    else
    {
        _tagOvertitleHeader = document.getElementById("tag-overtitle-header");
        _tagTitleHeader = document.getElementById("tag-title-header");
        _tagSubtitleHeader = document.getElementById("tag-subtitle-header");
        _tagScrollDownHeader = document.getElementById("tag-scroll-down-header");
    }
    
    _tagOverlayGallery = document.getElementById("tag-overlay-gallery");
    
    if (_foundTagBack === true)
    {
        _tagOvermaintitleGallery = document.getElementById("tag-overmaintitle-gallery");
        _tagMaintitleGallery = document.getElementById("tag-maintitle-gallery");
    }
    
    TAG_BUTTON_IN_DOCUMENT.forEach((tag, index) =>
    {
        _tagButtonGallery[index] = tag;
        
        if (_tagButtonGallery[index].getAttribute("href") === null)
        {
            _tagButtonGallery[index].style.cursor = "auto";
            _tagButtonGallery[index].style.pointerEvents = "none";
        }
        
        _countTagButton++;
    });
    
    TAG_MEDIA_IN_DOCUMENT.forEach((tag, index) =>
    {
        _tagMediaGallery[index] = tag;
        
        if (_tagMediaGallery[index].getAttribute("href") === null)
        {
            _tagMediaGallery[index].style.cursor = "auto";
            _tagMediaGallery[index].style.pointerEvents = "none";
        }
        
        _countTagMediaImg++;
    });
    
    TAG_IMG_IN_DOCUMENT.forEach((tag, index) =>
    {
        _tagImg[index] = tag;
    });
    
    _tagOverlayFooter = document.getElementById("tag-overlay-footer");
    _tagLineFooter = document.getElementById("tag-line-footer");
    _tagContactFooter = document.getElementById("tag-contact-footer");
    _tagInputContactFooter = document.getElementById("tag-input-contact-footer");
    _tagSubmitContactFooter = document.getElementById("tag-submit-contact-footer");
    
    _tagResponseContact = document.getElementById("tag-response-contact");
}

function event()
{
    let clientY = 0;
    let clientYPrevious = 0;
    let deltaY = 0;
    
    //_tagCanvasParticule.addEventListener("touchstart", event =>
    document.body.addEventListener("touchstart", event =>
    {
        const LENGTH_TOUCH = event.touches.length;
        
        if (LENGTH_TOUCH === 1)
        {
            clientY = event.touches[0].clientY;
            clientYPrevious = clientY;
        }
        else if (LENGTH_TOUCH === 2)
        {
            clientY = (event.touches[0].clientY + event.touches[1].clientY) * 0.5;
            clientYPrevious = clientY;
        }
        else
        {
            event.preventDefault();
        }
    },
    {
        passive: false
    });
    
    //_tagCanvasParticule.addEventListener("touchmove", event =>
    document.body.addEventListener("touchmove", event =>
    {
        const LENGTH_TOUCH = event.touches.length;
        
        if (LENGTH_TOUCH === 1)
        {
            clientY = event.touches[0].clientY;
            
            deltaY = clientY - clientYPrevious;
            clientYPrevious = clientY;
        }
        else if (LENGTH_TOUCH === 2)
        {
            clientY = (event.touches[0].clientY + event.touches[1].clientY) * 0.5;
            
            deltaY = clientY - clientYPrevious;
            clientYPrevious = clientY;
        }
        
        if (deltaY !== 0)
        {
            _eventScroll += deltaY * 1.5;
            event.preventDefault();
        }
    },
    {
        passive: false
    });
    
    //_tagCanvasParticule.addEventListener("wheel", event =>
    document.body.addEventListener("wheel", event =>
    {
        if (event.deltaY < 0)
        {
            _eventScroll += 50;
        }
        else if (event.deltaY > 0)
        {
            _eventScroll -= 50;
        }
    });
}

function imu()
{
    let alphaAccelerometer = 0;
    let betaAccelerometer = 0;
    let gammaAccelerometer = 0;
    const SMOOTH_R = 0.001;
    const TRAVEL_RXY = 1250;
    const TRAVEL_RZ = 500;
    
    function imuRead(event)
    {
        const SMOOTH_TIME_R = 1 - Math.exp(-event.interval * SMOOTH_R);
        
        alphaAccelerometer += (event.rotationRate.alpha - alphaAccelerometer) * SMOOTH_TIME_R;
        betaAccelerometer += (event.rotationRate.beta - betaAccelerometer) * SMOOTH_TIME_R;
        gammaAccelerometer += (event.rotationRate.gamma - gammaAccelerometer) * SMOOTH_TIME_R;
    }
    
    if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function")
    {
        DeviceMotionEvent.requestPermission().then(response =>
        {
            if (response === "granted")
            {
                window.addEventListener("devicemotion", imuRead);
            }
        });
    }
    else
    {
        window.addEventListener("devicemotion", imuRead);
    }
    
    function updateAccelerometer()
    {
        if (_orientationScreen === 1)
        {
            _rxAccelerometer = Math.tanh(betaAccelerometer * SMOOTH_R) * TRAVEL_RXY;
            _ryAccelerometer = -Math.tanh(alphaAccelerometer * SMOOTH_R) * TRAVEL_RXY;
        }
        else if (_orientationScreen === 2)
        {
            _rxAccelerometer = -Math.tanh(betaAccelerometer * SMOOTH_R) * TRAVEL_RXY;
            _ryAccelerometer = Math.tanh(alphaAccelerometer * SMOOTH_R) * TRAVEL_RXY;
        }
        else if (_orientationScreen === 3)
        {
            _rxAccelerometer = Math.tanh(alphaAccelerometer * SMOOTH_R) * TRAVEL_RXY;
            _ryAccelerometer = Math.tanh(betaAccelerometer * SMOOTH_R) * TRAVEL_RXY;
        }
        else if (_orientationScreen === 4)
        {
            _rxAccelerometer = -Math.tanh(alphaAccelerometer * SMOOTH_R) * TRAVEL_RXY;
            _ryAccelerometer = -Math.tanh(betaAccelerometer * SMOOTH_R) * TRAVEL_RXY;
        }
        
        _rzAccelerometer = ((-Math.tanh(gammaAccelerometer * SMOOTH_R) * TRAVEL_RZ) * Math.PI) / 180;
        
        requestAnimationFrame(updateAccelerometer);
    }
    
    requestAnimationFrame(updateAccelerometer);
}

function particuleAnimation()
{
    let program = null;
    let vsSource = null;
    let fsSource = null;
    let bufferPosition = null;
    let bufferDiameterGradient = null;
    let bufferColorAlpha = null;
    let timePreviousRelative = 0;
    let timePreviousAbsolute = 0;
    let indexParticule = 0;
    let index2 = 0;
    let index4 = 0;
    let indexParticuleX = 0;
    let indexParticuleY = 0;
    let indexRed = 0;
    let indexGreen = 0;
    let indexBlue = 0;
    let indexAlpha = 0;
    let mass = null;
    let proximity = null;
    let velocity = null;
    let position = null;
    let positionRender = null;
    let diameterGradient = null;
    let diameterStart = null;
    let gradientStart = null;
    let colorAlpha = null;
    let alphaStart = null;
    let xAttractor = 0;
    let yAttractor = 0;
    let xAttractorRandom = 0;
    let yAttractorRandom = 0;
    let directionAttractorRandom = false;
    let shapeAttractor1 = null;
    //let numberAttractor = 1;
    //let stateAttractor = 1;
    //let timeState = 0;
    //let newRandomizeAttractor = 0;
    let directionSpinShape = randomBinary(-1, 1);
    let angleSpinShapeStartShape = Math.PI * randomFloat(-1, 1);
    let radiusSpinShape = 0;
    let angleSpinShape = 0;
    let weightSpinShape = 0;
    let xTouch = 0;
    let yTouch = 0;
    let xSmoothTouch = 0;
    let ySmoothTouch = 0;
    let xSmoothJitterTouch = 0;
    let ySmoothJitterTouch = 0;
    let activeTouch = false;
    //let activeTouchB = false;
    let timeTouch1 = 0;
    let timeTouch2 = 0;
    let timeAttractorRandom1 = 0;
    let timeAttractorRandom2 = 0;
    let xJitterTouch = 0;
    let yJitterTouch = 0;
    let widthRingTouch = 1;
    let heightRingTouch = 1;
    let widthSmoothRingTouch = 1;
    let heightSmoothRingTouch = 1;
    let xSmoothTouchPrevious = 0;
    let ySmoothTouchPrevious = 0;
    let smoothVelocityTouch = 0;
    let vxSmooth = 0;
    let vySmooth = 0;
    let magnitudeSmooth = 0;
    let magnitudeSmoothScale = 0;
    let forceMassTime = 0;
    let vx = 0;
    let vy = 0;
    let px = 0;
    let py = 0;
    let dx = 0;
    let dy = 0;
    let magnitude = 0;
    let magnitudeScale = 0;
    let force = 0;
    let smoothTouch = 0;
    let smoothJitterTouch = 0;
    let smoothRingTouch = 0;
    let damping = 0;
    let xBlur = 0;
    let yBlur = 0;
    let xParallax = 0;
    let yParallax = 0;
    let cosParallax = 0;
    let sinParallax = 0;
    let hTeleport = 0;
    let vTeleport = 0;
    let fadeIn = 0;
    const LOGO = document.createElement("canvas");
    let ctxLogo = null;
    let measureLogo = null;
    let widthLogo = 0;
    let heightLogo = 0;
    let dataLogo = null;
    let xLogo = 0;
    let yLogo = 0;
    let xPixelLogo = [];
    let yPixelLogo = [];
    let countPixel = 0;
    let randomLogo = 0;
    const SAFE_SQRT = 0.000001;
    const TEXT_LOGO = "S";
    const FONT_LOGO = "fontA";
    const SIZE_LOGO = 700;
    const WEIGHT_LOGO = 200;
    const COUNT_PARTICLE = 10000;
    const COUNT_PARTICLE_SHAPE = 7500;
    const SIZE_X_SPIN_SHAPE = 1000;
    const SIZE_Y_SPIN_SHAPE = 500;
    const COUNT_SPIN_SHAPE = 4;
    const BULB1_SPIN_SHAPE = 1;
    const BULB2_SPIN_SHAPE = 200;
    const FORCE_ATTRACTOR = 100;
    const FORCE_ATTRACTOR_RANDOM = 50;
    const FORCE_TOUCH = 2;
    const RADIUS_TOUCH = 15;
    const SMOOTH_TOUCH = 0.0001;
    const SMOOTH_JITTER_TOUCH = 0.001;
    const SMOOTH_RING_TOUCH = 0.0001;
    const SMOOTH_VELOCITY_TOUCH = 0.1;
    const CLAMP_MAGNITUDE = 250;
    const CLAMP_FORCE = 500;
    const DAMPING = 0.4;
    const VELOCITY_MIN = 10;
    const WIDTH_BLUR = 500;
    const HEIGHT_BLUR = 400;
    const Y_OFFSET_BLUR = 300;
    const DIAMETER_BLUR = 7;
    //////////////////////////////////////////////////////////////////////////
    let clientX = 0;
    let clientY = 0;
    let clientXPrevious = 0;
    let clientYPrevious = 0;
    let deltaX = 0;
    let deltaY = 0;
    //////////////////////////////////////////////////////////////////////////
    //firstPointerMove********************************************************************
    let firstPointerMove = false;
    //firstPointerMove********************************************************************
    
    //_tagCanvasParticule.addEventListener("touchstart", event =>
    document.body.addEventListener("touchstart", event =>
    {
        const H_WINDOW = window.innerWidth;
        const V_WINDOW = window.innerHeight;
        const LENGTH_TOUCH = event.touches.length;
        //const RECTANGLE = _tagCanvasParticule.getBoundingClientRect();
        
        if (LENGTH_TOUCH === 1)
        {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
            
            clientXPrevious = clientX;
            clientYPrevious = clientY;
            //xTouch = (((event.touches[0].clientX - RECTANGLE.left) / RECTANGLE.width) - 0.5) * H_WINDOW;
            //yTouch = -(((event.touches[0].clientY - RECTANGLE.top) / RECTANGLE.height) - 0.5) * V_WINDOW;
            xTouch = ((clientX / H_WINDOW) - 0.5) * H_WINDOW;
            yTouch = -((clientY / V_WINDOW) - 0.5) * V_WINDOW;
        }
        else if (LENGTH_TOUCH === 2)
        {
            clientX = (event.touches[0].clientX + event.touches[1].clientX) * 0.5;
            clientY = (event.touches[0].clientY + event.touches[1].clientY) * 0.5;
            
            clientXPrevious = clientX;
            clientYPrevious = clientY;
            //xTouch = (((((event.touches[0].clientX + event.touches[1].clientX) * 0.5) - RECTANGLE.left) / RECTANGLE.width) - 0.5) * H_WINDOW;
            //yTouch = -(((((event.touches[0].clientY + event.touches[1].clientY) * 0.5) - RECTANGLE.top) / RECTANGLE.height) - 0.5) * V_WINDOW;
            xTouch = ((clientX / H_WINDOW) - 0.5) * H_WINDOW;
            yTouch = -((clientY / V_WINDOW) - 0.5) * V_WINDOW;
        }
        else
        {
            event.preventDefault();
        }
        
        xSmoothTouch = xTouch;
        ySmoothTouch = yTouch;
        xSmoothTouchPrevious = xTouch;
        ySmoothTouchPrevious = yTouch;
        
        activeTouch = false;
        
        //activeTouch = true;
        //activeTouchB = true;
    },
    {
        passive: false
    });
    
    //_tagCanvasParticule.addEventListener("touchmove", event =>
    document.body.addEventListener("touchmove", event =>
    {
        const H_WINDOW = window.innerWidth;
        const V_WINDOW = window.innerHeight;
        const LENGTH_TOUCH = event.touches.length;
        //const RECTANGLE = _tagCanvasParticule.getBoundingClientRect();
        
        if (LENGTH_TOUCH === 1)
        {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
            
            deltaX = clientX - clientXPrevious;
            deltaY = clientY - clientYPrevious;
            clientXPrevious = clientX;
            clientYPrevious = clientY;
            //xTouch = (((event.touches[0].clientX - RECTANGLE.left) / RECTANGLE.width) - 0.5) * H_WINDOW;
            //yTouch = -(((event.touches[0].clientY - RECTANGLE.top) / RECTANGLE.height) - 0.5) * V_WINDOW;
            xTouch = ((clientX / H_WINDOW) - 0.5) * H_WINDOW;
            yTouch = -((clientY / V_WINDOW) - 0.5) * V_WINDOW;
        }
        else if (LENGTH_TOUCH === 2)
        {
            clientX = (event.touches[0].clientX + event.touches[1].clientX) * 0.5;
            clientY = (event.touches[0].clientY + event.touches[1].clientY) * 0.5;
            
            deltaX = clientX - clientXPrevious;
            deltaY = clientY - clientYPrevious;
            clientXPrevious = clientX;
            clientYPrevious = clientY;
            //xTouch = (((((event.touches[0].clientX + event.touches[1].clientX) * 0.5) - RECTANGLE.left) / RECTANGLE.width) - 0.5) * H_WINDOW;
            //yTouch = -(((((event.touches[0].clientY + event.touches[1].clientY) * 0.5) - RECTANGLE.top) / RECTANGLE.height) - 0.5) * V_WINDOW;
            xTouch = ((clientX / H_WINDOW) - 0.5) * H_WINDOW;
            yTouch = -((clientY / V_WINDOW) - 0.5) * V_WINDOW;
        }
        
        //activeTouch = true;
        //activeTouchB = true;
        
        if (deltaX !== 0 || deltaY !== 0)
        {
            activeTouch = true;
            event.preventDefault();
        }
    },
    {
        passive: false
    });
    
    //_tagCanvasParticule.addEventListener("touchend", () =>
    document.body.addEventListener("touchend", () =>
    {
        activeTouch = false;
        //activeTouchB = false;
    });
    
    //_tagCanvasParticule.addEventListener("touchcancel", () =>
    document.body.addEventListener("touchcancel", () =>
    {
        activeTouch = false;
        //activeTouchB = false;
    });
    
    //_tagCanvasParticule.addEventListener("pointerenter", event =>
    document.body.addEventListener("pointerenter", event =>
    {
        const H_WINDOW = window.innerWidth;
        const V_WINDOW = window.innerHeight;
        //const RECTANGLE = _tagCanvasParticule.getBoundingClientRect();
        
        //xTouch = (((event.clientX - RECTANGLE.left) / RECTANGLE.width) - 0.5) * H_WINDOW;
        //yTouch = -(((event.clientY - RECTANGLE.top) / RECTANGLE.height) - 0.5) * V_WINDOW;
        xTouch = ((event.clientX / H_WINDOW) - 0.5) * H_WINDOW;
        yTouch = -((event.clientY / V_WINDOW) - 0.5) * V_WINDOW;
        
        xSmoothTouch = xTouch;
        ySmoothTouch = yTouch;
        xSmoothTouchPrevious = xTouch;
        ySmoothTouchPrevious = yTouch;
        
        firstPointerMove = false;
        activeTouch = false;
        
        /*if (event.buttons & 1 === 1)
        {
            activeTouchB = true;
        }*/
    });
    
    //_tagCanvasParticule.addEventListener("pointerdown", event =>
    /*document.addEventListener("pointerdown", event =>
    {
        const H_WINDOW = window.innerWidth;
        const V_WINDOW = window.innerHeight;
        //const RECTANGLE = _tagCanvasParticule.getBoundingClientRect();
        
        //xTouch = (((event.clientX - RECTANGLE.left) / RECTANGLE.width) - 0.5) * H_WINDOW;
        //yTouch = -(((event.clientY - RECTANGLE.top) / RECTANGLE.height) - 0.5) * V_WINDOW;
        xTouch = ((event.clientX / H_WINDOW) - 0.5) * H_WINDOW;
        yTouch = -((event.clientY / V_WINDOW) - 0.5) * V_WINDOW;
        
        xSmoothTouch = xTouch;
        ySmoothTouch = yTouch;
        xSmoothTouchPrevious = xTouch;
        ySmoothTouchPrevious = yTouch;
        
        //activeTouch = true;
        //activeTouchB = true;
    });*/
    
    //_tagCanvasParticule.addEventListener("pointermove", event =>
    document.body.addEventListener("pointermove", event =>
    {
        const H_WINDOW = window.innerWidth;
        const V_WINDOW = window.innerHeight;
        //const RECTANGLE = _tagCanvasParticule.getBoundingClientRect();
        
        //xTouch = (((event.clientX - RECTANGLE.left) / RECTANGLE.width) - 0.5) * H_WINDOW;
        //yTouch = -(((event.clientY - RECTANGLE.top) / RECTANGLE.height) - 0.5) * V_WINDOW;
        xTouch = ((event.clientX / H_WINDOW) - 0.5) * H_WINDOW;
        yTouch = -((event.clientY / V_WINDOW) - 0.5) * V_WINDOW;
        //console.log("xTouch = " + xTouch);
        
        if (firstPointerMove === false)
        {
            xSmoothTouch = xTouch;
            ySmoothTouch = yTouch;
            xSmoothTouchPrevious = xTouch;
            ySmoothTouchPrevious = yTouch;
            
            firstPointerMove = true;
        }
        else
        {
            activeTouch = true;
        }
        
        //activeTouch = true;
        
        /*if (event.buttons & 1 === 1)
        {
            activeTouchB = true;
        }*/
    });
    
    //_tagCanvasParticule.addEventListener("pointerup", () =>
    /*document.addEventListener("pointerup", () =>
    {
        //activeTouchB = false;
    });*/
    
    //_tagCanvasParticule.addEventListener("pointerleave", () =>
    document.body.addEventListener("pointerleave", () =>
    {
        firstPointerMove = false;
        activeTouch = false;
        //activeTouchB = false;
    });
    
    //_tagCanvasParticule.addEventListener("pointercancel", () =>
    document.body.addEventListener("pointercancel", () =>
    {
        firstPointerMove = false;
        activeTouch = false;
        //activeTouchB = false;
    });
    
    function setupWebGL()
    {
        _webGL = _tagCanvasParticule.getContext("webgl");
        _webGL.clearColor(0.05, 0.05, 0.05, 1);
        _webGL.enable(_webGL.BLEND);
        _webGL.blendFunc(_webGL.SRC_ALPHA, _webGL.ONE_MINUS_SRC_ALPHA);
        
        vsSource = `
        precision mediump float;
        
        attribute vec2 positionBuffer;
        attribute vec2 diameterGradientBuffer;
        attribute vec4 colorAlphaBuffer;
        
        varying float gradientCommon;
        varying vec3 colorCommon;
        varying float alphaCommon;
        
        void main()
        {
            gl_Position = vec4(positionBuffer, 0.0, 1.0);
            gl_PointSize = diameterGradientBuffer.x;
            gradientCommon = diameterGradientBuffer.y;
            colorCommon = colorAlphaBuffer.rgb;
            alphaCommon = colorAlphaBuffer.a;
        }`;
        
        fsSource = `
        precision mediump float;
        
        varying float gradientCommon;
        varying vec3 colorCommon;
        varying float alphaCommon;
        
        void main()
        {
            if (alphaCommon > 0.001)
            {
                vec2 point = gl_PointCoord - 0.5;
                float length = length(point);
                float alphaGradient = alphaCommon * smoothstep(0.5, gradientCommon, length);
                gl_FragColor = vec4(colorCommon, alphaGradient);
            }
        }`;
    }
    
    function startProgram(vsSource, fsSource)
    {
        const PROGRAM =
        _webGL.createProgram();
        _webGL.attachShader(PROGRAM, loadShader(_webGL.VERTEX_SHADER, vsSource));
        _webGL.attachShader(PROGRAM, loadShader(_webGL.FRAGMENT_SHADER, fsSource));
        _webGL.linkProgram(PROGRAM);
        _webGL.useProgram(PROGRAM);
        
        if (_webGL.getProgramParameter(PROGRAM, _webGL.LINK_STATUS) === false)
        {
            alert("webGL ERROR");
        }
        
        return PROGRAM;
    }
    
    function loadShader(type, source)
    {
        const SHADER = _webGL.createShader(type);
        
        _webGL.shaderSource(SHADER, source);
        _webGL.compileShader(SHADER);
        
        if (_webGL.getShaderParameter(SHADER, _webGL.COMPILE_STATUS) === false)
        {
            alert("webGL ERROR");
            _webGL.deleteShader(SHADER);
        }
        
        return SHADER;
    }
    
    function startBufferPosition()
    {
        const LOCATION = _webGL.getAttribLocation(program, "positionBuffer");
        
        bufferPosition = _webGL.createBuffer();
        _webGL.bindBuffer(_webGL.ARRAY_BUFFER, bufferPosition);
        _webGL.bufferData(_webGL.ARRAY_BUFFER, position, _webGL.DYNAMIC_DRAW);
        
        _webGL.enableVertexAttribArray(LOCATION);
        _webGL.vertexAttribPointer(LOCATION, 2, _webGL.FLOAT, false, 0, 0);
    }
    
    function startBufferDiameterGradient()
    {
        const LOCATION = _webGL.getAttribLocation(program, "diameterGradientBuffer");
        
        bufferDiameterGradient = _webGL.createBuffer();
        _webGL.bindBuffer(_webGL.ARRAY_BUFFER, bufferDiameterGradient);
        _webGL.bufferData(_webGL.ARRAY_BUFFER, diameterGradient, _webGL.DYNAMIC_DRAW);
        
        _webGL.enableVertexAttribArray(LOCATION);
        _webGL.vertexAttribPointer(LOCATION, 2, _webGL.FLOAT, false, 0, 0);
    }
    
    function startBufferColorAlpha()
    {
        const LOCATION = _webGL.getAttribLocation(program, "colorAlphaBuffer");
        
        bufferColorAlpha = _webGL.createBuffer();
        _webGL.bindBuffer(_webGL.ARRAY_BUFFER, bufferColorAlpha);
        _webGL.bufferData(_webGL.ARRAY_BUFFER, colorAlpha, _webGL.DYNAMIC_DRAW);
        
        _webGL.enableVertexAttribArray(LOCATION);
        _webGL.vertexAttribPointer(LOCATION, 4, _webGL.FLOAT, false, 0, 0);
    }
    
    //INDEX
    index2 = COUNT_PARTICLE * 2;
    index4 = COUNT_PARTICLE * 4;
    
    diameterGradient = new Float32Array(index2);
    diameterStart = new Float32Array(COUNT_PARTICLE);
    gradientStart = new Float32Array(COUNT_PARTICLE);
    colorAlpha = new Float32Array(index4);
    alphaStart = new Float32Array(COUNT_PARTICLE);
    mass = new Float32Array(COUNT_PARTICLE);
    proximity = new Float32Array(COUNT_PARTICLE);
    velocity = new Float32Array(index2);
    position = new Float32Array(index2);
    positionRender = new Float32Array(index2);
    shapeAttractor1 = new Float32Array(index2);
    
    //CANVAS TEXTE
    ctxLogo = LOGO.getContext("2d");
    ctxLogo.font = WEIGHT_LOGO + " " + SIZE_LOGO + "px " + FONT_LOGO;
    
    measureLogo = ctxLogo.measureText(TEXT_LOGO);
    
    widthLogo = Math.ceil(measureLogo.width);
    heightLogo = Math.ceil(measureLogo.actualBoundingBoxAscent + measureLogo.actualBoundingBoxDescent);
    
    LOGO.width = widthLogo;
    LOGO.height = heightLogo;
    
    ctxLogo.font = WEIGHT_LOGO + " " + SIZE_LOGO + "px " + FONT_LOGO;
    ctxLogo.fillText(TEXT_LOGO, 0, measureLogo.actualBoundingBoxAscent);
    
    dataLogo = ctxLogo.getImageData(0, 0, widthLogo, heightLogo).data;
    
    for (yLogo = 0; yLogo < heightLogo; yLogo++)
    {
        for (xLogo = 0; xLogo < widthLogo; xLogo++)
        {
            if (dataLogo[((yLogo * widthLogo + xLogo) * 4) + 3] > 0)
            {
                xPixelLogo.push(xLogo);
                yPixelLogo.push(yLogo);
            }
        }
    }
    
    countPixel = xPixelLogo.length;
    //CANVAS TEXTE
    
    for (indexParticule = 0; indexParticule < COUNT_PARTICLE; indexParticule++)
    {
        //INDEX
        index2 = indexParticule * 2;
        index4 = indexParticule * 4;
        
        indexParticuleX = index2;
        indexParticuleY = index2 + 1;
        indexDiameter = index2;
        indexGradient = index2 + 1;
        indexRed = index4;
        indexGreen = index4 + 1;
        indexBlue = index4 + 2;
        indexAlpha = index4 + 3;
        
        //CANVAS TEXTE
        randomLogo = randomInteger(0, countPixel);
        //CANVAS TEXTE
        
        if (indexParticule < COUNT_PARTICLE_SHAPE)
        {
            //PARTICULE 1A
            if (randomInteger(1, 100) === 1)
            {
                diameterStart[indexParticule] = randomFloat(2, 3);
                gradientStart[indexParticule] = 0.49;
                alphaStart[indexParticule] = 0.1;
                mass[indexParticule] = randomFloat(1, 1.1);
                proximity[indexParticule] = 2;
                
                shapeAttractor1[indexParticuleX] = xPixelLogo[randomLogo] - (widthLogo * 0.5);
                shapeAttractor1[indexParticuleY] = (heightLogo * 0.5) - yPixelLogo[randomLogo];
            }
            //PARTICULE 2A
            else if (randomInteger(1, 5) === 1)
            {
                diameterStart[indexParticule] = randomFloat(5, 6);
                gradientStart[indexParticule] = 0.49;
                alphaStart[indexParticule] = 0.04;
                mass[indexParticule] = randomFloat(1, 1.1);
                proximity[indexParticule] = randomFloat(1.7, 2);
                
                shapeAttractor1[indexParticuleX] = xPixelLogo[randomLogo] - (widthLogo * 0.5);
                shapeAttractor1[indexParticuleY] = (heightLogo * 0.5) - yPixelLogo[randomLogo];
            }
            //PARTICULE 3A
            else if (randomInteger(1, 10) !== 1)
            {
                diameterStart[indexParticule] = randomFloat(15, 20);
                gradientStart[indexParticule] = 0;
                alphaStart[indexParticule] = 0.008;
                mass[indexParticule] = randomFloat(1.1, 2);
                proximity[indexParticule] = randomFloat(1, 2);
                
                shapeAttractor1[indexParticuleX] = (xPixelLogo[randomLogo] - (widthLogo * 0.5)) * 0.95;
                shapeAttractor1[indexParticuleY] = (heightLogo * 0.5) - yPixelLogo[randomLogo];
            }
            //PARTICULE 4A
            else
            {
                diameterStart[indexParticule] = randomFloat(30, 50);
                gradientStart[indexParticule] = 0;
                alphaStart[indexParticule] = 0.008;
                mass[indexParticule] = randomFloat(2, 3);
                proximity[indexParticule] = randomFloat(1, 2);
                
                shapeAttractor1[indexParticuleX] = (xPixelLogo[randomLogo] - (widthLogo * 0.5)) * 0.95;
                shapeAttractor1[indexParticuleY] = (heightLogo * 0.5) - yPixelLogo[randomLogo];
            }
        }
        else
        {
            //PARTICULE 1B
            if (randomInteger(1, 10) === 1)
            {
                diameterStart[indexParticule] = randomFloat(2, 3);
                gradientStart[indexParticule] = 0;
                alphaStart[indexParticule] = 0.1;
                mass[indexParticule] = randomFloat(1, 1.1);
                proximity[indexParticule] = randomFloat(1, 1.1);
            }
            //PARTICULE 2B
            else if (randomInteger(1, 5) === 1)
            {
                diameterStart[indexParticule] = randomFloat(5, 6);
                gradientStart[indexParticule] = 0;
                alphaStart[indexParticule] = 0.04;
                mass[indexParticule] = randomFloat(1, 1.1);
                proximity[indexParticule] = randomFloat(1, 1.25);
            }
            //PARTICULE 3B
            else if (randomInteger(1, 10) !== 1)
            {
                diameterStart[indexParticule] = randomFloat(15, 20);
                gradientStart[indexParticule] = 0;
                alphaStart[indexParticule] = 0.006;
                mass[indexParticule] = randomFloat(1.1, 2);
                proximity[indexParticule] = randomFloat(1, 1.5);
            }
            //PARTICULE 4B
            else
            {
                diameterStart[indexParticule] = randomFloat(30, 50);
                gradientStart[indexParticule] = 0;
                alphaStart[indexParticule] = 0.006;
                mass[indexParticule] = randomFloat(2, 3);
                proximity[indexParticule] = randomFloat(1, 2);
            }
            
            radiusSpinShape = (indexParticule - COUNT_PARTICLE_SHAPE) / (COUNT_PARTICLE - COUNT_PARTICLE_SHAPE);
            angleSpinShape = angleSpinShapeStartShape + directionSpinShape * radiusSpinShape * COUNT_SPIN_SHAPE * Math.PI * 2;
            weightSpinShape = (1 / Math.exp(radiusSpinShape * BULB1_SPIN_SHAPE)) * BULB2_SPIN_SHAPE;
            
            shapeAttractor1[indexParticuleX] = (Math.cos(angleSpinShape) * radiusSpinShape * SIZE_X_SPIN_SHAPE) + randomFloat(-weightSpinShape, weightSpinShape);
            shapeAttractor1[indexParticuleY] = (Math.sin(angleSpinShape) * radiusSpinShape * SIZE_Y_SPIN_SHAPE) + randomFloat(-weightSpinShape, weightSpinShape);
        }
        
        colorAlpha[indexRed] = 1;
        colorAlpha[indexGreen] = 1;
        colorAlpha[indexBlue] = 1;
    }
    
    for (indexParticule = 0; indexParticule < COUNT_PARTICLE; indexParticule++)
    {
        //INDEX
        index2 = indexParticule * 2;
        index4 = indexParticule * 4;
        
        indexParticuleX = index2;
        indexParticuleY = index2 + 1;
        indexDiameter = index2;
        indexGradient = index2 + 1;
        indexRed = index4;
        indexGreen = index4 + 1;
        indexBlue = index4 + 2;
        indexAlpha = index4 + 3;
        
        velocity[indexParticuleX] = VELOCITY_MIN * randomBinary(-1, 1);
        velocity[indexParticuleY] = VELOCITY_MIN * randomBinary(-1, 1);
        
        xAttractor = shapeAttractor1[indexParticuleX];
        yAttractor = shapeAttractor1[indexParticuleY];
        
        position[indexParticuleX] = xAttractor + randomFloat(-5, 5);
        position[indexParticuleY] = yAttractor + randomFloat(-5, 5);
    }
    
    /*function state()
    {
        if (stateAttractor === 1)
        {
            timeState = performance.now() + 500;
            numberAttractor = 1;
            newRandomizeAttractor = 1;
            
            stateAttractor = 1;
        }
    }*/
    
    function touch1()
    {
        xJitterTouch = randomFloat(-30, 30);
        widthRingTouch = randomFloat(0.5, 2);
        
        timeTouch1 = performance.now() + randomInteger(50, 250);
    }
    
    function touch2()
    {
        yJitterTouch = randomFloat(-30, 30);
        heightRingTouch = randomFloat(0.5, 2);
        
        timeTouch2 = performance.now() + randomInteger(50, 250);
    }
    
    function attractorRandom1()
    {
        const H_SCALE = window.innerWidth * 0.5;
        const V_SCALE = window.innerHeight * 0.5;
        
        xAttractorRandom = randomFloat(-H_SCALE, H_SCALE);
        yAttractorRandom = randomFloat(-V_SCALE, V_SCALE);
        
        timeAttractorRandom1 = performance.now() + randomInteger(100, 2000);
    }
    
    function attractorRandom2()
    {
        if (randomInteger(1, 3) === 1)
        {
            directionAttractorRandom = false;
        }
        else
        {
            directionAttractorRandom = true;
        }
        
        timeAttractorRandom2 = performance.now() + randomInteger(100, 2000);
    }
    
    timePreviousRelative = performance.now();
    timePreviousAbsolute = performance.now();
    
    function updateAnimation(time)
    {
        const H_SCALE = window.innerWidth * 0.5;
        const V_SCALE = window.innerHeight * 0.5;
        const DPR = window.devicePixelRatio || 1;
        const TIME_DELTA = Math.min((time - timePreviousRelative) * 0.001, 0.04);
        
        timePreviousRelative = time;
        
        //STATE
        /*if (performance.now() > timeState)
        {
            state();
        }*/
        
        //TOUCH
        if (performance.now() > timeTouch1)
        {
            touch1();
        }
        
        if (performance.now() > timeTouch2)
        {
            touch2();
        }
        
        //ATTRACTOR
        if (performance.now() > timeAttractorRandom1)
        {
            attractorRandom1();
        }
        
        if (performance.now() > timeAttractorRandom2)
        {
            attractorRandom2();
        }
        
        smoothTouch = 1 - Math.pow(SMOOTH_TOUCH, TIME_DELTA);
        xSmoothTouch += (xTouch - xSmoothTouch) * smoothTouch;
        ySmoothTouch += (yTouch - ySmoothTouch) * smoothTouch;
        
        smoothJitterTouch = 1 - Math.pow(SMOOTH_JITTER_TOUCH, TIME_DELTA);
        xSmoothJitterTouch += (xJitterTouch - xSmoothJitterTouch) * smoothJitterTouch;
        ySmoothJitterTouch += (yJitterTouch - ySmoothJitterTouch) * smoothJitterTouch;
        
        smoothRingTouch = 1 - Math.pow(SMOOTH_RING_TOUCH, TIME_DELTA);
        widthSmoothRingTouch += (widthRingTouch - widthSmoothRingTouch) * smoothRingTouch;
        heightSmoothRingTouch += (heightRingTouch - heightSmoothRingTouch) * smoothRingTouch;
        
        vx = (xSmoothTouch - xSmoothTouchPrevious);
        vy = (ySmoothTouch - ySmoothTouchPrevious);
        
        xSmoothTouchPrevious = xSmoothTouch;
        ySmoothTouchPrevious = ySmoothTouch;
        
        smoothVelocityTouch = 1 - Math.pow(SMOOTH_VELOCITY_TOUCH, TIME_DELTA);
        vxSmooth += (vx - vxSmooth) * smoothVelocityTouch;
        vySmooth += (vy - vySmooth) * smoothVelocityTouch;
        
        magnitude = SAFE_SQRT + Math.sqrt((vx * vx) + (vy * vy));
        
        magnitudeSmooth += (magnitude - magnitudeSmooth) * smoothVelocityTouch;
        
        cosParallax = Math.cos(_rzAccelerometer);
        sinParallax = Math.sin(_rzAccelerometer);
        
        /*if (newRandomizeAttractor === 1)
        {
            angleSpinShapeStartShape -= 0.05 * directionSpinShape;
            newRandomizeAttractor = 2;
        }*/
        
        //ANIMATION
        for (indexParticule = 0; indexParticule < COUNT_PARTICLE; indexParticule++)
        {
            //INDEX
            indexParticuleX = indexParticule * 2;
            indexParticuleY = (indexParticule * 2) + 1;
            indexDiameter = indexParticule * 2;
            indexGradient = (indexParticule * 2) + 1;
            indexRed = indexParticule * 4;
            indexGreen = (indexParticule * 4) + 1;
            indexBlue = (indexParticule * 4) + 2;
            indexAlpha = (indexParticule * 4) + 3;
            
            //POSITION
            px = position[indexParticuleX];
            py = position[indexParticuleY];
            
            //ATTRACTOR
            /*if (newRandomizeAttractor === 2)
            {
                if (numberAttractor === 1)
                {
                    //radiusSpinShape = indexParticule / COUNT_PARTICLE;
                    //angleSpinShape = angleSpinShapeStartShape + directionSpinShape * radiusSpinShape * COUNT_SPIN_SHAPE * Math.PI * 2;
                    //weightSpinShape = (1 / Math.exp(radiusSpinShape * BULB1_SPIN_SHAPE)) * BULB2_SPIN_SHAPE;
                    
                    //shapeAttractor1[indexParticuleX] = (Math.cos(angleSpinShape) * radiusSpinShape * SIZE_X_SPIN_SHAPE) + randomFloat(-weightSpinShape, weightSpinShape);
                    //shapeAttractor1[indexParticuleY] = (Math.sin(angleSpinShape) * radiusSpinShape * SIZE_Y_SPIN_SHAPE) + randomFloat(-weightSpinShape, weightSpinShape);
                }
                else if (numberAttractor === 2)
                {
                    //shapeAttractor1[indexParticuleX] = randomFloat(-0.25, 0.25) + (randomFloat(0, 0.01) * randomBinary(-1, 1));
                    //shapeAttractor1[indexParticuleY] = randomFloat(-0.25, 0.25) + (randomFloat(0, 0.01) * randomBinary(-1, 1));
                }
                else if (numberAttractor === 3)
                {
                }
            }*/
            
            if (indexParticule < COUNT_PARTICLE_SHAPE)
            {
                /*if (numberAttractor === 1)
                {*/
                    xAttractor = shapeAttractor1[indexParticuleX];
                    yAttractor = shapeAttractor1[indexParticuleY];
                /*}
                else if (numberAttractor === 2)
                {
                    xAttractor = shapeAttractor2[indexParticuleX];
                    yAttractor = shapeAttractor2[indexParticuleY];
                }
                else if (numberAttractor === 3)
                {
                    xAttractor = shapeAttractor3[indexParticuleX];
                    yAttractor = shapeAttractor3[indexParticuleY];
                }*/
                
                dx = (xAttractor - px);
                dy = (yAttractor - py);
                
                magnitude = SAFE_SQRT + Math.sqrt((dx * dx) + (dy * dy));
                
                dx /= magnitude;
                dy /= magnitude;
                
                forceMassTime = (FORCE_ATTRACTOR / mass[indexParticule]) * TIME_DELTA;
                
                velocity[indexParticuleX] += dx * forceMassTime;
                velocity[indexParticuleY] += dy * forceMassTime;
            }
            else
            {
                xAttractor = xAttractorRandom;
                yAttractor = yAttractorRandom;
                
                dx = xAttractor - px;
                dy = yAttractor - py;
                
                magnitude = SAFE_SQRT + Math.sqrt((dx * dx) + (dy * dy));
                
                if (directionAttractorRandom === false)
                {
                    magnitudeScale = magnitude * 0.004;
                }
                else
                {
                    magnitudeScale = magnitude * 0.006;
                }
                
                if (magnitudeScale < 1.5)
                {
                    dx /= magnitude;
                    dy /= magnitude;
                    
                    force = FORCE_ATTRACTOR_RANDOM * (1.5 - magnitudeScale);
                    
                    forceMassTime = (force / mass[indexParticule]) * TIME_DELTA;
                    
                    if (directionAttractorRandom === false)
                    {
                        velocity[indexParticuleX] += dx * forceMassTime;
                        velocity[indexParticuleY] += dy * forceMassTime;
                    }
                    else
                    {
                        velocity[indexParticuleX] -= dx * forceMassTime;
                        velocity[indexParticuleY] -= dy * forceMassTime;
                    }
                }
            }
            
            //TOUCH
            if (activeTouch === true && magnitudeSmooth > 0.1)
            {
                //xAttractor = xSmoothTouch + xSmoothJitterTouch - _rxAccelerometer;
                xAttractor = xSmoothTouch + xSmoothJitterTouch - _rxAccelerometer * proximity[indexParticule];
                //yAttractor = ySmoothTouch + ySmoothJitterTouch - _ryAccelerometer;
                yAttractor = ySmoothTouch + ySmoothJitterTouch - _ryAccelerometer - (140 * (1 / (2 / proximity[indexParticule])) * (-_translateSmooth * 0.001));
                //yAttractor = ySmoothTouch + ySmoothJitterTouch - ((_ryAccelerometer * (1 + (-_translateSmooth * 0.001)))) - 140 * proximity[indexParticule];
                
                dx = (xAttractor - px) * widthSmoothRingTouch;
                dy = (yAttractor - py) * heightSmoothRingTouch;
                
                magnitude = SAFE_SQRT + Math.sqrt((dx * dx) + (dy * dy));
                
                magnitudeSmoothScale = magnitudeSmooth * RADIUS_TOUCH;
                
                if (magnitudeSmoothScale > CLAMP_MAGNITUDE)
                {
                    magnitudeSmoothScale = CLAMP_MAGNITUDE;
                }
                
                if (magnitude < magnitudeSmoothScale)
                {
                    dx /= magnitude;
                    dy /= magnitude;
                    
                    force = magnitudeSmooth * ((magnitudeSmoothScale * FORCE_TOUCH) - magnitude);
                    
                    if (force > CLAMP_FORCE)
                    {
                        force = CLAMP_FORCE;
                    }
                    
                    force *= ((dx * vxSmooth) + (dy * vySmooth)) * -1;
                    
                    forceMassTime = (force / mass[indexParticule]) * TIME_DELTA;
                    
                    velocity[indexParticuleX] -= dx * forceMassTime;
                    velocity[indexParticuleY] -= dy * forceMassTime;
                }
            }
            
            //DAMPING
            vx = velocity[indexParticuleX];
            vy = velocity[indexParticuleY];
            
            magnitude = SAFE_SQRT + Math.sqrt((vx * vx) + (vy * vy));
            
            if (magnitude > VELOCITY_MIN)
            {
                damping = magnitude * Math.pow(DAMPING, TIME_DELTA);
                
                if (damping < VELOCITY_MIN)
                {
                    damping = VELOCITY_MIN;
                }
                
                damping /= magnitude;
                
                velocity[indexParticuleX] *= damping;
                velocity[indexParticuleY] *= damping;
            }
            
            //UPDATE POSITION
            position[indexParticuleX] += velocity[indexParticuleX] * TIME_DELTA;
            position[indexParticuleY] += velocity[indexParticuleY] * TIME_DELTA;
            
            //TELEPORT POSITION
            hTeleport = H_SCALE * 10;
            vTeleport = V_SCALE * 10;
            
            if (position[indexParticuleX] < -hTeleport)
            {
                position[indexParticuleX] = hTeleport;
            }
            
            if (position[indexParticuleX] > hTeleport)
            {
                position[indexParticuleX] = -hTeleport;
            }
            
            if (position[indexParticuleY] < -vTeleport)
            {
                position[indexParticuleY] = vTeleport;
            }
            
            if (position[indexParticuleY] > vTeleport)
            {
                position[indexParticuleY] = -vTeleport;
            }
            
            //PARALLAX
            xParallax = position[indexParticuleX] + (_rxAccelerometer * proximity[indexParticule]);
            //yParallax = (position[indexParticuleY] + ((_ryAccelerometer + 70) * proximity[indexParticule])) - 140;
            yParallax = (position[indexParticuleY] + ((_ryAccelerometer + 70 * (1 + (-_translateSmooth * 0.001))) * proximity[indexParticule])) - 140;
            
            positionRender[indexParticuleX] = ((xParallax * cosParallax) - (yParallax * sinParallax)) / H_SCALE;
            positionRender[indexParticuleY] = ((xParallax * sinParallax) + (yParallax * cosParallax)) / V_SCALE;
            
            //DIAMETER GRADIENT COLOR ALPHA
            xBlur = clampPositiveSymmetricalMinMax(position[indexParticuleX], WIDTH_BLUR);
            yBlur = clampPositiveSymmetricalMinMax(position[indexParticuleY] + Y_OFFSET_BLUR, HEIGHT_BLUR);
            
            magnitude = Math.min(SAFE_SQRT + Math.sqrt((xBlur * xBlur) + (yBlur * yBlur)), 1);
            
            fadeIn = (time - timePreviousAbsolute) * 0.001;
            
            if (fadeIn > 1)
            {
                fadeIn = 1;
            }
            
            if (diameterStart[indexParticule] < 10)
            {
                diameterGradient[indexDiameter] = (diameterStart[indexParticule] + (diameterStart[indexParticule] * magnitude * DIAMETER_BLUR)) * DPR * fadeIn;
            }
            else
            {
                diameterGradient[indexDiameter] = (diameterStart[indexParticule] + (diameterStart[indexParticule] * magnitude)) * DPR * fadeIn;
            }
            
            diameterGradient[indexGradient] = gradientStart[indexParticule] - (gradientStart[indexParticule] * magnitude);
            
            colorAlpha[indexRed] = 1 - (0.25 * magnitude);
            colorAlpha[indexGreen] = 1 - (0.75 * (1 - magnitude));
            colorAlpha[indexAlpha] = (alphaStart[indexParticule] - (alphaStart[indexParticule] * 0.5 * magnitude)) * fadeIn;
        }
        
        /*if (newRandomizeAttractor === 2)
        {
            newRandomizeAttractor = 0;
        }*/
        
        //DRAW
        _webGL.bindBuffer(_webGL.ARRAY_BUFFER, bufferPosition);
        _webGL.bufferSubData(_webGL.ARRAY_BUFFER, 0, positionRender);
        
        _webGL.bindBuffer(_webGL.ARRAY_BUFFER, bufferDiameterGradient);
        _webGL.bufferSubData(_webGL.ARRAY_BUFFER, 0, diameterGradient);
        
        _webGL.bindBuffer(_webGL.ARRAY_BUFFER, bufferColorAlpha);
        _webGL.bufferSubData(_webGL.ARRAY_BUFFER, 0, colorAlpha);
        
        _webGL.clear(_webGL.COLOR_BUFFER_BIT | _webGL.DEPTH_BUFFER_BIT | _webGL.STENCIL_BUFFER_BIT);
        _webGL.drawArrays(_webGL.POINTS, 0, COUNT_PARTICLE);
        
        requestAnimationFrame(updateAnimation);
    }
    
    //state();
    touch1();
    touch2();
    attractorRandom1();
    attractorRandom2();
    
    setupWebGL();
    program = startProgram(vsSource, fsSource);
    startBufferPosition();
    startBufferDiameterGradient();
    startBufferColorAlpha();
    
    updateAnimation(timePreviousRelative);
}

function loadingAnimation()
{
    let timePreviousAbsolute = 0;
    let fadeIn = 0;
    let fadeInLinear = 0;
    let fadeInQuadratic = 0;
    
    timePreviousAbsolute = performance.now();
    
    function updateAnimation(time)
    {
        fadeIn = (time - timePreviousAbsolute) * 0.001;
        
        fadeInLinear = fadeIn;
        
        if (fadeInLinear > 1)
        {
            fadeInLinear = 1;
        }
        
        if (fadeIn < 1)
        {
            fadeInQuadratic = 1 - Math.pow(1 - fadeIn, 2);
            
            if (fadeInQuadratic > 1)
            {
                fadeInQuadratic = 1;
            }
        }
        else
        {
            fadeInQuadratic = 1;
        }
        
        _tagLoadingText.textContent = Math.round(fadeInLinear * 100) + "%";
        _tagLoadingText.style.opacity = fadeInLinear;
        
        _tagLoadingBar.style.opacity = fadeInLinear;
        _tagLoadingBar.style.left = (50 - (fadeInLinear * 45)) + "dvw";
        _tagLoadingBar.style.width = (fadeInLinear * 90) + "dvw";
        
        if (fadeIn < 1 || _stateLoading !== 2)
        {
            requestAnimationFrame(updateAnimation);
        }
        else
        {
            loading();
        }
    }
    
    updateAnimation(timePreviousAbsolute);
}

function windowResize()
{
    function updateSize()
    {
        const H_WINDOW = window.innerWidth;
        const V_WINDOW = window.innerHeight;
        const DPR = window.devicePixelRatio || 1;
        
        _tagCanvasParticule.width = Math.floor(H_WINDOW * DPR);
        _tagCanvasParticule.height = Math.floor(V_WINDOW * DPR);
        
        _webGL.viewport(0, 0, _tagCanvasParticule.width, _tagCanvasParticule.height);
        
        if (_foundTagOverlayHeader === true)
        {
            fitText(_tagTitleHeader, 100, 0, 110);
        }
    }
    
    updateSize();
    window.addEventListener("resize", updateSize);
}

function screenOrientation()
{
    function updateOrientation()
    {
        const ORIENTATION_SCREEN = screen.orientation.type || "portrait-primary";
        
        if (ORIENTATION_SCREEN === "portrait-primary")
        {
            _orientationScreen = 1;
        }
        else if (ORIENTATION_SCREEN === "portrait-secondary")
        {
            _orientationScreen = 2;
        }
        else if (ORIENTATION_SCREEN === "landscape-primary")
        {
            _orientationScreen = 3;
        }
        else if (ORIENTATION_SCREEN === "landscape-secondary")
        {
            _orientationScreen = 4;
        }
    }
    
    updateOrientation();
    screen.orientation.addEventListener("change", updateOrientation);
}

function interfaceAnimation()
{
    let timePreviousRelative = 0;
    let timePreviousAbsolute = 0;
    let fadeIn = 0;
    let fadeInLinear = 0;
    let fadeInQuadratic = 0;
    let index = 0;
    let bottomHeader = 0;
    let topGallery = 0;
    let topFooter = 0;
    let scrollMax = 0;
    let smoothAll = 0;
    const SMOOTH_ALL = 0.01;
    //let translateSmooth = 0;
    let opacitySmooth = 1;
    let scaleSmooth = 1;
    let opacity = 1;
    let scale = 1;
    let ratioMediaImg1 = 0;
    let ratioMediaImg2 = 0;
    let offsetImg = 0;
    let widthPerLetter = 0;
    let opacityLetter = 0;
    let widthLetter = 0;
    let opacityTranslateScale = 0;
    let opacityTranslateScaleSmooth = 0;
    //TAG RESPONSE
    let timePreviousRelative2 = 0;
    let timePreviousAbsolute2 = 0;
    let fadeIn2 = 0;
    let fadeInLinear2 = 0;
    let fadeInQuadratic2 = 0;
    let fadeInQuadratic3 = 0;
    let timeRetryDuringAnimation = 0;
    //TAG RESPONSE
    //HREF ANIMATION
    let timePreviousRelative4 = 0;
    let timePreviousAbsolute4 = 0;
    let fadeIn4 = 0;
    let fadeInLinear4 = 0;
    let fadeInQuadratic4 = 0;
    let fadeInQuadratic5 = 0;
    //HREF ANIMATION
    
    timePreviousRelative = performance.now();
    timePreviousAbsolute = performance.now();
    
    function updateAnimation(time)
    {
        const TIME_DELTA = Math.min((time - timePreviousRelative) * 0.001, 0.04);
        const V_WINDOW = window.innerHeight;
        //const RECTANGLE_HEADER = _tagOverlayHeader.getBoundingClientRect();
        const RECTANGLE_GALLERY = _tagOverlayGallery.getBoundingClientRect();
        const RECTANGLE_FOOTER = _tagOverlayFooter.getBoundingClientRect();
        
        timePreviousRelative = time;
        
        fadeIn = (time - timePreviousAbsolute) * 0.001;
        
        fadeInLinear = fadeIn;
        
        if (fadeInLinear > 1)
        {
            fadeInLinear = 1;
        }
        
        if (fadeIn < 1)
        {
            fadeInQuadratic = 1 - Math.pow(1 - fadeIn, 2);
            
            if (fadeInQuadratic > 1)
            {
                fadeInQuadratic = 1;
            }
        }
        else
        {
            fadeInQuadratic = 1;
        }
        
        ////////////////////////////////////////////////////////////////////////HREF ANIMATION
        const TIME_DELTA4 = Math.min((time - timePreviousRelative4) * 0.001, 0.04);
        
        timePreviousRelative4 = time;
        
        fadeIn4 = (time - timePreviousAbsolute4) * 0.001;
        
        fadeInLinear4 = fadeIn4;
        
        if (fadeInLinear4 > 1)
        {
            fadeInLinear4 = 1;
        }
        
        if (fadeIn4 < 1)
        {
            fadeInQuadratic4 = 1 - Math.pow(1 - fadeIn4, 2);
            fadeInQuadratic5 = Math.pow(fadeIn4, 2);
            
            if (fadeInQuadratic4 > 1)
            {
                fadeInQuadratic4 = 1;
            }
            
            if (fadeInQuadratic5 > 1)
            {
                fadeInQuadratic5 = 1;
            }
        }
        else
        {
            fadeInQuadratic4 = 1;
            fadeInQuadratic5 = 1;
        }
        
        if (_stateMediaAnimation === 1)
        {
            timePreviousRelative4 = performance.now();
            timePreviousAbsolute4 = performance.now();
            
            _stateMediaAnimation = 2;
        }
        else if (_stateMediaAnimation === 2)
        {
            if (fadeIn4 < 1)
            {
                _tagMediaGallery[_indexMedia].style.opacity = 1 - (0.5 * fadeInLinear4);
                _tagMediaGallery[_indexMedia].style.transform = "scale(" + (1 - (0.05 * fadeInQuadratic4)) + ")";
            }
            else
            {
                _tagMediaGallery[_indexMedia].style.opacity = 0.5;
                _tagMediaGallery[_indexMedia].style.transform = "scale(" + 0.95 + ")";
            }
        }
        ////////////////////////////////////////////////////////////////////////HREF ANIMATION
        ////////////////////////////////////////BUTTON ANIMATION
        if (_stateButtonAnimation === 1)
        {
            timePreviousRelative4 = performance.now();
            timePreviousAbsolute4 = performance.now();
            
            _stateButtonAnimation = 2;
        }
        else if (_stateButtonAnimation === 2)
        {
            if (fadeIn4 < 1)
            {
                _tagButtonGallery[_indexButton].style.transform = "scale(" + (1 + (0.05 * fadeInQuadratic4)) + ")";
            }
            else
            {
                _tagButtonGallery[_indexButton].style.transform = "scale(" + 1.05 + ")";
            }
        }
        ////////////////////////////////////////BUTTON ANIMATION
        
        //bottomHeader = 160 + RECTANGLE_HEADER.height;
        
        if (_foundTagBack === false)
        {
            topGallery = V_WINDOW;//VERSION GALLERY
        }
        else
        {
            topGallery = 160;//VERSION PAGE
        }
        
        topFooter = RECTANGLE_FOOTER.height + 30;
        
        if (_foundTagBack === false)
        {
            scrollMax = RECTANGLE_GALLERY.height + 100 + topFooter;//VERSION GALLERY
        }
        else
        {
            scrollMax = ((160 + RECTANGLE_GALLERY.height) - V_WINDOW) + 100 + topFooter;//VERSION PAGE
        }
        
        if (scrollMax < 0)
        {
            scrollMax = 0;
        }
        
        if (_eventScroll > 0)
        {
            _eventScroll = 0;
        }
        else if (_eventScroll < -scrollMax)
        {
            _eventScroll = -scrollMax;
        }
        
        if (_eventScroll === 0)
        {
            opacity = 1;
            scale = 1;
        }
        //else if (_eventScroll < -bottomHeader)
        else if (_eventScroll < -500)
        {
            opacity = 0;
            scale = 0.85;
        }
        else
        {
            //opacity = 1 + (1 / (bottomHeader / _eventScroll));
            opacity = 1 + (1 / (500 / _eventScroll));
            //scale = 1 + (0.15 / (bottomHeader / _eventScroll));
            scale = 1 + (0.15 / (500 / _eventScroll));
        }
        
        smoothAll = 1 - Math.pow(SMOOTH_ALL, TIME_DELTA);
        _translateSmooth += (_eventScroll - _translateSmooth) * smoothAll;
        opacitySmooth += (opacity - opacitySmooth) * smoothAll;
        scaleSmooth += (scale - scaleSmooth) * smoothAll;
        
        //_translateSmooth = translateSmooth;
        
        //TAG TAG TAG TAG TAG TAG TAG TAG TAG TAG TAG TAG TAG TAG TAG TAG TAG TAG TAG
        if (fadeIn < 1)
        {
            _tagLoadingText.style.opacity = 1 - fadeInLinear;
            _tagLoadingBar.style.opacity = 1 - fadeInLinear;
        }
        else
        {
            _tagLoadingText.style.display = "none";
            _tagLoadingBar.style.display = "none";
        }
        
        for (index = 0; index < _countTagLetter; index++)
        {
            //widthPerLetter = bottomHeader / _countTagLetter;
            widthPerLetter = 500 / _countTagLetter;//VERSION GALLERY ET VERSION PAGE
            opacityLetter = 1 - (-_translateSmooth / (widthPerLetter + (widthPerLetter * (_countTagLetter - index))));
            
            if (opacityLetter < 0)
            {
                opacityLetter = 0;
            }
            else if (opacityLetter > 1)
            {
                opacityLetter = 1;
            }
            
            widthLetter = _widthLetter[index] * opacityLetter;
            
            _tagLetter[index].style.opacity = opacityLetter;
            _tagLetter[index].style.width = widthLetter + "px";
        }
        
        _tagName.style.opacity = fadeInLinear;
        _tagName.style.transform = "translate(0px, " + (-50 * (1 - fadeInQuadratic)) + "px)";
        
        if (_foundTagBack === true)
        {
            let varAnimation = 0;
            
            if (_stateBackAnimation === 1)
            {
                timePreviousRelative4 = performance.now();
                timePreviousAbsolute4 = performance.now();
                
                _stateBackAnimation = 2;
            }
            else if (_stateBackAnimation === 2)
            {
                varAnimation = fadeInQuadratic5;
            }
            
            _tagBack.style.opacity = fadeInLinear;
            _tagBack.style.transform = "translate(" + ((50 * (1 - fadeInQuadratic)) + (25 * (1 - varAnimation))) + "px, 0px)";
        }
        
        if (_foundTagOverlayHeader === true)
        {
            _tagOverlayHeader.style.opacity = opacitySmooth;
            _tagOverlayHeader.style.transform = "scale(" + scaleSmooth + ")";
            
            _tagOvertitleHeader.style.opacity = fadeInLinear;
            _tagOvertitleHeader.style.transform = "translate(" + (-10 * (1 - fadeInQuadratic)) + "px, 0px)";
            
            _tagTitleHeader.style.opacity = fadeInLinear;
            _tagTitleHeader.style.transform = "translate(" + (-30 * (1 - fadeInQuadratic)) + "px, 0px)";
            
            _tagSubtitleHeader.style.opacity = fadeInLinear;
            _tagSubtitleHeader.style.transform = "translate(" + (-50 * (1 - fadeInQuadratic)) + "px, 0px)";
            
            _tagScrollDownHeader.style.opacity = fadeInLinear;
            _tagScrollDownHeader.style.transform = "translate(" + (-35 * (1 - fadeInQuadratic)) + "px, " + (-35 * (1 - fadeInQuadratic)) + "px)";
        }
        
        _tagOverlayGallery.style.top = topGallery + "px";
        _tagOverlayGallery.style.opacity = fadeInLinear;
        _tagOverlayGallery.style.transform = "translate(0px, " + (_translateSmooth) + "px)";
        
        if (_foundTagBack === true)
        {
            _tagOvermaintitleGallery.style.transform = "translate(" + (-10 * (1 - fadeInQuadratic)) + "px, 0px)";
            _tagMaintitleGallery.style.transform = "translate(" + (-30 * (1 - fadeInQuadratic)) + "px, 0px)";
        }
        
        ratioMediaImg1 = Math.min(RECTANGLE_GALLERY.width, 800) * 0.7;
        
        for (index = 0; index < _countTagMediaImg; index++)
        {
            _tagMediaGallery[index].style.height = ratioMediaImg1 + "px";
        }
        
        ratioMediaImg2 = ratioMediaImg1 * 0.5;
        
        for (index = 0; index < _countTagMediaImg; index++)
        {
            const RECTANGLE_IMG = _tagImg[index].getBoundingClientRect();
            
            if (ratioMediaImg2 < V_WINDOW)
            {
                offsetImg = 100 * ((RECTANGLE_IMG.top + ratioMediaImg2) / V_WINDOW);
            }
            else
            {
                offsetImg = 50;
            }
            
            _tagImg[index].style.objectPosition = "50% " + offsetImg + "%";
        }
        
        //TAG FOOTER FOOTER FOOTER FOOTER FOOTER FOOTER FOOTER FOOTER FOOTER FOOTER FOOTER FOOTER FOOTER FOOTER
        if (_eventScroll >= -scrollMax + 100)//VERSION GALLERY ET VERSION PAGE
        {
            opacityTranslateScale = 0;
        }
        else
        {
            opacityTranslateScale = 1 - ((scrollMax + _eventScroll) / 100);
            //console.log("opacityTranslateScale = " + opacityTranslateScale + " _eventScroll = " + _eventScroll);
        }
        
        opacityTranslateScaleSmooth += (opacityTranslateScale - opacityTranslateScaleSmooth) * smoothAll;
        
        _tagLineFooter.style.opacity = opacityTranslateScaleSmooth;
        _tagLineFooter.style.transform = "translate(0px, " + (20 * (1 - opacityTranslateScaleSmooth)) + "px) scaleX(" + opacityTranslateScaleSmooth + ")";
        
        _tagContactFooter.style.opacity = opacityTranslateScaleSmooth;
        _tagContactFooter.style.transform = "translate(0px, " + (100 * (1 - opacityTranslateScaleSmooth)) + "px)";
        //TAG FOOTER FOOTER FOOTER FOOTER FOOTER FOOTER FOOTER FOOTER FOOTER FOOTER FOOTER FOOTER FOOTER FOOTER
        
        //TAG RESPONSE
        const TIME_DELTA2 = Math.min((time - timePreviousRelative2) * 0.001, 0.04);
        
        timePreviousRelative2 = time;
        
        fadeIn2 = (time - timePreviousAbsolute2) * 0.001;
        
        fadeInLinear2 = fadeIn2;
        
        if (fadeInLinear2 > 1)
        {
            fadeInLinear2 = 1;
        }
        
        if (fadeIn2 <= 1)
        {
            fadeInQuadratic2 = 1 - Math.pow(1 - fadeIn2, 2);
            fadeInQuadratic3 = Math.pow(fadeIn2, 2);
            
            if (fadeInQuadratic2 > 1)
            {
                fadeInQuadratic2 = 1;
            }
            
            if (fadeInQuadratic3 > 1)
            {
                fadeInQuadratic3 = 1;
            }
        }
        else
        {
            fadeInQuadratic2 = 1;
            fadeInQuadratic3 = 1;
        }
        
        if (_stateResponseAnimation === 1)
        {
            timePreviousRelative2 = performance.now() - timeRetryDuringAnimation;
            timePreviousAbsolute2 = performance.now() - timeRetryDuringAnimation;
            
            //_tagResponseContact.style.opacity = 0;
            //_tagResponseContact.style.transform = "translate(0px, 50px)";
            
            _tagResponseContact.style.backgroundColor = "var(--colorF)";
            _tagResponseContact.textContent = String.fromCodePoint("8635") + " Proceed, please wait...";
            
            _stateResponseAnimation = 2;
        }
        else if (_stateResponseAnimation === 2)
        {
            _tagResponseContact.style.opacity = fadeInLinear2 * opacityTranslateScaleSmooth;
            _tagResponseContact.style.transform = "translate(0px, " + ((50 * (1 - fadeInQuadratic2)) + (100 * (1 - opacityTranslateScaleSmooth))) + "px)";
            
            if (time - timePreviousAbsolute2 >= 2000)
            {
                if (_stateResponseServer === 1)
                {
                    _tagInputContactFooter.value = "";
                    
                    _tagResponseContact.style.backgroundColor = "var(--colorG)";
                    _tagResponseContact.textContent = String.fromCodePoint("8594") + " Your email has been sent !";
                }
                else if (_stateResponseServer === 2)
                {
                    _tagResponseContact.style.backgroundColor = "var(--colorH)";
                    _tagResponseContact.textContent = String.fromCodePoint("9888") + " An error occured, please try again.";
                }
                
                if (_stateResponseServer === 1 || _stateResponseServer === 2)
                {
                    timePreviousRelative2 = performance.now();
                    timePreviousAbsolute2 = performance.now();
                    
                    _stateResponseAnimation = 3;
                }
            }
        }
        else if (_stateResponseAnimation === 3)
        {
            _tagResponseContact.style.opacity = opacityTranslateScaleSmooth;
            _tagResponseContact.style.transform = "translate(0px, " + (100 * (1 - opacityTranslateScaleSmooth)) + "px)";
            
            if (time - timePreviousAbsolute2 >= 1000)
            {
                //_tagInputContactFooter.disabled = false;
                
                timePreviousRelative2 = performance.now();
                timePreviousAbsolute2 = performance.now();
                
                timeRetryDuringAnimation = 1000;
                
                _stateResponseAnimation = 4;
            }
        }
        else if (_stateResponseAnimation === 4)
        {
            _tagResponseContact.style.opacity = (1 - fadeInLinear2) * opacityTranslateScaleSmooth;
            _tagResponseContact.style.transform = "translate(0px, " + ((50 * fadeInQuadratic3) + (100 * (1 - opacityTranslateScaleSmooth))) + "px)";
            
            timeRetryDuringAnimation = 1000 - (time - timePreviousAbsolute2);
            
            if (time - timePreviousAbsolute2 >= 1000)
            {
                _tagResponseContact.style.opacity = 0;
                _tagResponseContact.style.transform = "translate(0px, 50px)";
                
                _stateResponseAnimation = 0;
            }
        }
        //TAG RESPONSE
        
        requestAnimationFrame(updateAnimation);
    }
    
    updateAnimation(timePreviousRelative);
}

function href()
{
    let index = 0;
    
    if (_foundTagBack === true)
    {
        _tagBack.addEventListener("click", () =>
        {
            if (_inhibitClick === false)
            {
                _inhibitClick = true;
                
                _stateBackAnimation = 1;
                
                setTimeout(() =>
                {
                    window.location.href = "index.html";
                }, 1000);
            }
        });
    }
    
    for (index = 0; index < _countTagButton; index++)
    {
        const HREF = _tagButtonGallery[index].getAttribute("href");
        const INDEX = index;
        
        if (HREF !== null)
        {
            _tagButtonGallery[index].addEventListener("click", () =>
            {
                if (_inhibitClick === false)
                {
                    _inhibitClick = true;
                    
                    _indexButton = INDEX;
                    _stateButtonAnimation = 1;
                    
                    setTimeout(() =>
                    {
                        window.location.href = HREF;
                    }, 1000);
                }
            });
        }
    }
    
    for (index = 0; index < _countTagMediaImg; index++)
    {
        const HREF = _tagMediaGallery[index].getAttribute("href");
        const INDEX = index;
        
        if (HREF !== null)
        {
            _tagMediaGallery[INDEX].addEventListener("click", () =>
            {
                if (_inhibitClick === false)
                {
                    _inhibitClick = true;
                    
                    _indexMedia = INDEX;
                    _stateMediaAnimation = 1;
                    
                    setTimeout(() =>
                    {
                        window.location.href = HREF;
                    }, 1000);
                }
            });
        }
    }
}

function input()
{
    function server()
    {
        const FORM_DATA = new FormData();
        
        FORM_DATA.append ("from", _tagInputContactFooter.value);
        
        _stateResponseAnimation = 1;
        _stateResponseServer = 0;
        
        fetch ("contact.php",
        {
            method: "POST",
            body: FORM_DATA
        })
        .then (response => response.text())
        .then (data =>
        {
            if (data === "mail_true")
            {
                _stateResponseServer = 1;
            }
            else
            {
                _stateResponseServer = 2;
            }
        })
        .catch (error =>
        {
            _stateResponseServer = 2;
        });
    }
    
    _tagInputContactFooter.addEventListener("keydown", (event) =>
    {
        if (event.key === "Enter" && (_stateResponseAnimation === 0 || _stateResponseAnimation === 4))
        {
            //_tagInputContactFooter.disabled = true;
            server();
        }
    });
    
    _tagSubmitContactFooter.addEventListener("click", () =>
    {
        if (_stateResponseAnimation === 0 || _stateResponseAnimation === 4)
        {
            //_tagInputContactFooter.disabled = true;
            server();
        }
    });
}

/*function loaded()
{
    
}*/

/*function href(index)
{
    
}*/

async function loading()
{
    if (_stateLoading === 1)
    {
        tag();
        
        event();
        
        loadingAnimation();
        
        await document.fonts.load("0px fontA");
        await document.fonts.ready;
        
        _stateLoading = 2;
    }
    else if (_stateLoading === 2)
    {
        imu();
        
        particuleAnimation();
        
        windowResize();
        screenOrientation();
        
        interfaceAnimation();
        
        href();
        input();
        
        //loaded();
    }
}

window.addEventListener("load", loading);
