$(document).ready(function(){
    // Add smooth scrolling to all links
    $(".scroll").on('click', function(event) {

        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
        // Prevent default anchor click behavior
        event.preventDefault();

        // Store hash
        var hash = this.hash;

        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 1000, function(){

            // Add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = hash;
        });
        } // End if
    });
});

(function($) {

    var self = this,
    container, running = false,
    currentY = 0,
    targetY = 0,
    oldY = 0,
    maxScrollTop = 0,
    minScrollTop, direction, onRenderCallback = null,
    fricton = 0.85,
    vy = 0,
    stepAmt = 1,
    minMovement = 0.1,
    ts = 0.1;

    var updateScrollTarget = function(amt) {
    targetY += amt;
    vy += (targetY - oldY) * stepAmt;

    oldY = targetY;
    }
    var render = function() {
    if (vy < -(minMovement) || vy > minMovement) {

        currentY = (currentY + vy);
        if (currentY > maxScrollTop) {
        currentY = vy = 0;
        } else if (currentY < minScrollTop) {
        vy = 0;
        currentY = minScrollTop;
        }

        container.scrollTop(-currentY);

        vy *= fricton;

        if (onRenderCallback) {
        onRenderCallback();
        }
    }
}

var animateLoop = function() {
    if (!running) return;
    requestAnimFrame(animateLoop);
    render();
    //log("45","animateLoop","animateLoop", "",stop);
    }
    var onWheel = function(e) {
    e.preventDefault();
    var evt = e.originalEvent;

    var delta = evt.detail ? evt.detail * -1 : evt.wheelDelta / 40;
    var dir = delta < 0 ? -1 : 1;
    if (dir != direction) {
        vy = 0;
        direction = dir;
    }

    //reset currentY in case non-wheel scroll has occurred (scrollbar drag, etc.)
    currentY = -container.scrollTop();
    updateScrollTarget(delta);
}

/*
* http://paulirish.com/2011/requestanimationframe-for-smart-animating/
*/
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
        window.setTimeout(callback, 1000 / 60);
        };
    })();

/*
* http://jsbin.com/iqafek/2/edit
*/
var normalizeWheelDelta = function() {
// Keep a distribution of observed values, and scale by the
// 33rd percentile.
var distribution = [],
    done = null,
    scale = 30;
return function(n) {
    // Zeroes don't count.
    if (n == 0) return n;
    // After 500 samples, we stop sampling and keep current factor.
    if (done != null) return n * done;
    var abs = Math.abs(n);
    // Insert value (sorted in ascending order).
    outer: do { // Just used for break goto
    for (var i = 0; i < distribution.length; ++i) {
        if (abs <= distribution[i]) {
        distribution.splice(i, 0, abs);
        break outer;
        }
    }
    distribution.push(abs);
    } while (false);
    // Factor is scale divided by 33rd percentile.
    var factor = scale / distribution[Math.floor(distribution.length / 3)];
    if (distribution.length == 500) done = factor;
    return n * factor;
};
}();


$.fn.smoothWheel = function() {
    //  var args = [].splice.call(arguments, 0);
    var options = jQuery.extend({}, arguments[0]);
    return this.each(function(index, elm) {

        if (!('ontouchstart' in window)) {
            container = $(this);
            container.bind("mousewheel", onWheel);
            container.bind("DOMMouseScroll", onWheel);

            //set target/old/current Y to match current scroll position to prevent jump to top of container
            targetY = oldY = container.scrollTop();
            currentY = -targetY;

            minScrollTop = container.get(0).clientHeight - container.get(0).scrollHeight;
            if (options.onRender) {
                onRenderCallback = options.onRender;
            }
            if (options.remove) {
                log("122", "smoothWheel", "remove", "");
                running = false;
                container.unbind("mousewheel", onWheel);
                container.unbind("DOMMouseScroll", onWheel);
            } else if (!running) {
                running = true;
                animateLoop();
            }

            }
        });
    };
})(jQuery);

$(document).ready(function(){
    $(window).smoothWheel();
});


/* Lazy load */

// This is "probably" IE9 compatible but will need some fallbacks for IE8
// - (event listeners, forEach loop)

// wait for the entire page to finish loading
window.addEventListener('load', function() {
	
	// setTimeout to simulate the delay from a real page load
	setTimeout(lazyLoad, 1000);
	
});

function lazyLoad() {
	var card_images = document.querySelectorAll('.card-image');
	
	// loop over each card image
	card_images.forEach(function(card_image) {
		var image_url = card_image.getAttribute('data-image-full');
		var content_image = card_image.querySelector('img');
		
		// change the src of the content image to load the new high res photo
		content_image.src = image_url;
		
		// listen for load event when the new photo is finished loading
		content_image.addEventListener('load', function() {
			// swap out the visible background image with the new fully downloaded photo
			card_image.style.backgroundImage = 'url(' + image_url + ')';
			// add a class to remove the blur filter to smoothly transition the image change
			card_image.className = card_image.className + ' is-loaded';
		});
		
	});
	
}