/*
 * jQuery Plugins:
 *
 * - Twitter Widget
 * - Testimonial Widget
 * - Toggle
 * - Accordion
 * - Contact Form
 * - Google Map
 *
 * Copyright 2011, MTD
 * http://themeforest.net/user/MTD
 */
(function($){
	$.fn.extend({
	
		// --- -- - TWITTER WIDGET PLUGIN - -- --- //
		elegant_TwitterWidget		: function(){
		
			function	init(el, utils){
			
				// Calculate the max height
				el.twitterList.find("li").each(function(){
					$(this).css({ position: "relative" });
					if( $(this).height() > utils.height ){
						utils.height = $(this).height();
					}
					$(this).css({ position: "absolute" });
				});
				// Set the new height
				el.twitterList.animate({	
					height	: utils.height
				}, 300, function(){
					el.twitterList.find("li").each(function(){ $(this).height( utils.height ) });
				});
				
				// Set the first tweet as current
				el.currentTweet	= el.twitterList.find('li').eq(0);
				el.currentTweet.animate({
					opacity	: 1
				}, 300, function(){
					$(this).addClass("current");
				});
				if( utils.tweetNum === 1 ){
					el.arrowDown.addClass("inactive");
				}
				
				// Add click event on the UP arrow
				el.arrowUp.addClass("inactive").click(function(){
					if( !$(this).hasClass("inactive") && utils.isReady ){
						utils.nextIndex	= utils.currentIndex - 1;
						if( utils.nextIndex === 0 ){
							utils.callback	= function(){
								el.arrowUp.addClass("inactive");
							};
						}else{
							utils.callback	= function(){
								el.arrowDown.removeClass("inactive");
							};
						}
						showNext(el, utils);
					}
				});
				
				// Add click event on the DOWN arrow
				el.arrowDown.click(function(){
					if( !$(this).hasClass("inactive") && utils.isReady ){
						utils.nextIndex	= utils.currentIndex + 1;
						if( utils.nextIndex === utils.tweetNum -1 ){
							utils.callback	= function(){
								el.arrowDown.addClass("inactive");
							};
						}else{
							utils.callback	= function(){
								el.arrowUp.removeClass("inactive");
							};
						}
						showNext(el, utils);
					}
				});
				
				utils.isReady = true;
			
			}
		
			function	getTweets(el, utils){
			
				if( !utils.username ){
					el.twitterList.find("li").eq(0).html("You need to specify a username");
				}else{
					$.ajax({
						url			: "http://twitter.com/statuses/user_timeline/"+utils.username+".json?callback=?",
						dataType	: "json",
						timeout		: 15000,
						success		: function(data){
							var li = '';
							for( i=0; i<utils.tweetNum; i++ ){
							
								var text = data[i].text;
								text = text.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url){return '<a href="'+url+'" target="_blank">'+url+'</a>'});
								text = text.replace(/@(\w+)/g, function(url){return '<a href="http://www.twitter.com/'+url.substring(1)+'" target="_blank">'+url+'</a>'});
								text = text.replace(/#(\w+)/g, function(url){return '<a href="http://twitter.com/search?q=%23'+url.substring(1)+'" target="_blank">'+url+'</a>'});
								li += '<li>'+text+'</li>';
							
							}
							// Append the list
							el.twitterList.html( li );
							// Initialize
							init(el, utils);
						},
						error : function(){
							el.twitterList.find("li").eq(0).html("There was an error connecting to your Twitter account");
						}
					});
				}
			
			}
		
			function	showNext(el, utils){
			
				utils.isReady	= false;
				el.nextTweet	= el.twitterList.find('li').eq( utils.nextIndex );
				
				// Hide current tweet
				el.currentTweet.animate({
					opacity	: 0
				}, 300, function(){
					$(this).removeClass("current");
				});
				// Show next tweet
				el.nextTweet.animate({
					opacity	: 1
				}, 300, function(){
					$(this).addClass("current");
					utils.currentIndex	= utils.nextIndex;
					el.currentTweet	= el.nextTweet;
					utils.callback();
					utils.isReady	= true;
				});
			
			}
		
			return this.each(function(){

			
				var el		= {
						widget				: $(this),
						twitterList			: $(this).find(".twitterList"),
						arrowUp				: $(this).find(".twitterArrowUp"),
						arrowDown			: $(this).find(".twitterArrowDown"),
						testimonialAuthor	: $(this).find(".testimonialAuthor")
					},
					utils	= {
						username		: el.widget.data("user"),
						tweetNum		: parseInt(el.widget.data("num")) || 5,
						currentIndex	: 0,
						callback		: function(){},
						isReady			: false,
						height			: 0
					}	
					
				// Get the tweets to initialize
				getTweets(el, utils);
			
			});
		
		},
		
		// --- -- - TESTIMONIAL WIDGET PLUGIN - -- --- //
		elegant_TestimonialWidget	: function(){
		
			function showNext(el, utils){
				utils.isReady		= false;
				el.nextTestimonial	= el.testimonialList.find('li').eq( utils.nextIndex );
				
				// Hide current Testimonial
				el.currentTestimonial.fadeOut( 200, function(){
					$(this).removeClass("current");
					// Show next Testimonial
					el.nextTestimonial.fadeIn( 200, function(){
						$(this).addClass("current");
						utils.currentIndex		= utils.nextIndex;
						el.currentTestimonial	= el.nextTestimonial;
						utils.callback();
						utils.isReady	= true;
					});
					el.testimonialAuthor.html( el.nextTestimonial.find("cite").html() );
				});
			}
			
			return this.each(function(){
				
				var el		= {
						widget				: $(this),
						testimonialList		: $(this).find(".testimonialList"),
						arrowLeft			: $(this).find(".arrowLeft"),
						arrowRight			: $(this).find(".arrowRight"),
						testimonialAuthor	: $(this).find(".testimonialAuthor")
					},
					utils	= {
						testimonialNum	: el.testimonialList.find('li').length,
						currentIndex	: 0,
						callback		: function(){},
						isReady			: false,
						width			: 0,
						height			: 0,
						outerHeight		: 0
					}
				el.currentTestimonial	= el.testimonialList.find('li').eq(0);				
				
				// Calculate the max height
				el.testimonialList.find("li").each(function(){
					$(this).css({
						opacity	: 0,
						display	: "block"
					});
					if( $(this).outerHeight(true) > utils.outerHeight ){
						utils.outerHeight = $(this).outerHeight(true);
						
					}
					$(this).css({
						opacity	: 1,
						display	: "none"
					});
				});
				
				// Set the new height
				el.testimonialList.find("li").each(function(){
					$(this).css({
						height	: utils.height
					});
				});
				el.testimonialList.css({
					height	: utils.outerHeight
				});
				
				// Set the first Testimonial as current
				el.currentTestimonial.fadeIn(300, function(){
					$(this).addClass("current");
				});
				el.testimonialAuthor.html(
					el.currentTestimonial.find("cite").html()
				);
				
				// Check for inactive arrows
				el.arrowLeft.addClass("inactive");
				if( utils.testimonialNum === 1 ){
					el.arrowRight.addClass("inactive");
				}
				
				// Add click event on the LEFT arrow
				el.arrowLeft.click(function(){
					if( !$(this).hasClass("inactive") && utils.isReady ){
						utils.nextIndex	= utils.currentIndex - 1;
						if( utils.nextIndex === 0 ){
							utils.callback	= function(){
								el.arrowLeft.addClass("inactive");
							};
						}else{
							utils.callback	= function(){
								el.arrowRight.removeClass("inactive");
							};
						}
						showNext(el, utils);
					}
					return false;
				});
				
				// Add click event on the RIGHT arrow
				el.arrowRight.click(function(){
					if( !$(this).hasClass("inactive") && utils.isReady ){
						utils.nextIndex	= utils.currentIndex + 1;
						if( utils.nextIndex === utils.testimonialNum -1 ){
							utils.callback	= function(){
								el.arrowRight.addClass("inactive");
							};
						}else{
							utils.callback	= function(){
								el.arrowLeft.removeClass("inactive");
							};
						}
						showNext(el, utils);
					}
					return false;
				});
				
				utils.isReady = true;
			
			});
	

		},
		
		// --- -- - TOGGLE PLUGIN - -- --- //
		elegant_Toggle	: function(){
			
			return this.each(function(){
			
				var obj			= {
						panel	: $(this),
						title	: $(this).find(".toggleTitle"),
						content	: $(this).find(".toggleContent"),
						isOpen	: $(this).data("open")
					}
				
				// Setting a fixed width prevent the jumpy bug
				obj.content.css({ width	: obj.content.width() });
				
				// Close panel by default
				if( !obj.isOpen ){
					obj.content.slideUp(100);
					obj.panel.addClass("closed");
				}
				
				// Add click event
				obj.title.click(function(){
					obj.content.slideToggle(300);
					obj.panel.toggleClass("closed");
					return false;
				});
						
			});
	
		},
		
		
		// --- -- - CONTACT FORM PLUGIN - -- --- //
		elegant_ContactForm	: function(){
		
			//Content length validation
			function validateLength( obj, el, l ){
				var parent	= el.parents(".formField");
				if( el.val().length < l ) {
					parent.addClass("error");
					return 1;
				} else {
					parent.removeClass('error');
					return 0;
				}
			};
			
			//email validation
			function validateEmail( obj, el ){
				var filter	= /^[a-zA-Z0-9]+[a-zA-Z0-9_.-]+[a-zA-Z0-9_-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{2,4}$/,
					parent	= el.parents(".formField");
				if( filter.test(el.val()) ){
					parent.removeClass("error");
					return 0;
				}else{
					parent.addClass("error");
					return 1;
				}
			};
			
			// Captcha validation
			function validateCaptcha( obj, el ){
				var field1		= parseInt( obj.form.find(".captchaField1").text() ),
					operator	= ( obj.form.find(".captchaField2").text() == "+" ) ? true : false,
					field3		= parseInt( obj.form.find(".captchaField3").text() ),
					correct		= operator ? field1+field3 : field1-field3,
					parent		= el.parents(".captchaField");
				if( el.val() != correct ){
					parent.addClass("error");
					return 1;
				}else{
					parent.removeClass('error');
					return 0;
				}
			};
			
			return this.submit(function(){
				
				var obj	= {
					form	: $(this),
					errors	: 0,
					loader	: $(this).find(".contactLoader"),
					results	: $(this).find(".contactResults")
				}
				
				obj.results.find("span").hide();
				obj.loader.fadeIn(200);
				
				// Validate required fields
				obj.form.find(".required").each(function(){
					if( $(this).hasClass("email") ){
						obj.errors += validateEmail( obj, $(this) );
					}else if( $(this).hasClass("captcha") ){
						obj.errors += validateCaptcha( obj, $(this) );
					}else{
						//Must contain at least 3 characters
						obj.errors += validateLength( obj, $(this), 3 );
					}
				});

				//If there are no errors, send the email
				if(obj.errors === 0){
					var data	= obj.form.serialize(),
						URL		= obj.form.attr("action");
					$.ajax({
						type	: 'post',
						url		: URL,
						data	: data,
						success	: function(results) {
							obj.loader.fadeOut(function(){
								if( /email sent/.test(results) ){
									// Email sent successfully
									obj.results.find(".success").fadeIn();
									obj.form.find(".textField").each(function(){
										$(this).val("");
									});
								} else {
									obj.loader.fadeOut(200, function(){
										obj.results.find(".fail").fadeIn();
									});
								}
							});
						},
						error: function() {
							obj.results.find(".fail").fadeIn();
						}
					});
				}else{
					obj.loader.fadeOut(200);
				}
				return false;		
			});
	
		},
		
		// --- -- - GOOGLE MAP PLUGIN - -- --- //
		elegant_GoogleMap	: function(){
			
			if( $(this).length ){
				$.elegant_GoogleMap_Maps	= $(this);
				$.getScript("http://maps.google.com/maps/api/js?sensor=false&callback=jQuery.fn.elegant_GoogleMap_CallBack&async=2");
			}
		},
		elegant_GoogleMap_CallBack	: function(){
		
			$.elegant_GoogleMap_Maps.each(function(){
		
				var map			= $(this),
					details		= $(this).find(".mapDetails").html(),
					latitude	= map.data("latitude"),
					longitude	= map.data("longitude"),
					coord		= new google.maps.LatLng( latitude, longitude ),
					param		= {
						zoom				: map.data("zoom") || 6,
						zoomControlOptions	: {
							style: google.maps.ZoomControlStyle.SMALL
						},
						panControl			: false,
						streetViewControl	: false,
						center				: coord,
						html				: map.data("title"),
						popup				: true,
						mapTypeId			: google.maps.MapTypeId.ROADMAP
					},
					gmap		= new google.maps.Map( map.get(0), param ),
					bubble		= new google.maps.InfoWindow({
						content		: details,
						maxWidth	: 400
					}),
					icon		= new google.maps.MarkerImage("img/map-marker.png",
						new google.maps.Size(130,127),
						new google.maps.Point(0,0),
						new google.maps.Point(65,120)
					),
					marker		= new google.maps.Marker({
						position	: coord,
						map			: gmap,
						icon		: icon,
						flat		: true,
						title		: map.data("title")
					});
				google.maps.event.addListener(marker, "click", function () {
					bubble.open(gmap, marker);
				});
			
			});
		}
	
	});
})(jQuery);


// Initialize scripts
var mtdScript = {};

jQuery(document).ready(function($){

	mtdScript = {
		
		// Initialize functions
		initSite	: function(){
		
			$("body").removeClass("noJs");
			
			this.placeHolder();
			
			this.topPanel();
			
			// Initialize the twitter widgets
			$(".twitterWidget").elegant_TwitterWidget();
						
			// Initialize the testimonial widgets
			$(".testimonialWidget").elegant_TestimonialWidget();
			
			// Initialize the toggle widgets
			$(".toggle").elegant_Toggle();
			
			
			// Load the Google Map using latitude and longitude values
			$(".googleMap").elegant_GoogleMap();
			
		},
		
		
		
		// Show and Hide the top panel
		topPanel		: function(){
		
			var topPanel	= $("#topPanel"),
				panelHandle	= $("#topPanelHandle"),
				height		= 0,
				wrapHeight	= 0,
				imgs		= topPanel.find("img"),
				imgsNum		= imgs.length,
				readyImg	= 0;
			
			// If there are images in the toppanel
			// load them before initializing the toggle effect
			if( imgsNum ){
				imgs.each(function(){
					$(this).load(function(){
						readyImg++;
						initTopPanel();
					});
				});
			}else{
				initTopPanel();
			}
			
			function initTopPanel(){
				if( imgsNum === readyImg ){
					height		= topPanel.height();
					
					topPanel.css({ display : "block" });
					// wrapHeight	= topPanel.find(".gwrap").height();
					
					topPanel.css({
						marginTop	: -height,
						height		: '352px',
						display		: "block",
						overflow	: "visible"
					});
					
					topPanel.find(".gwrap").css({
						height		: '0px',
						display		: "block",
						overflow	: "visible"
					});
					
					// Open / Close Panel
					panelHandle.click(function(){
						if( !$(this).hasClass("close") ){
							topPanel.animate({
								marginTop	: 0
							}, 350, function(){
								panelHandle.addClass("close")
							});
						}else{
							topPanel.animate({
								marginTop	: -height
							}, 350, function(){
								panelHandle.removeClass("close")
							});
						}
					});
					
					//custom locate button
					
					$('#locate_icon a').click(function(){
							if( !$(panelHandle).hasClass("close") ){
							topPanel.animate({
								marginTop	: 0
							}, 350, function(){
								panelHandle.addClass("close")
							});
						}else{
							topPanel.animate({
								marginTop	: -height
							}, 350, function(){
								panelHandle.removeClass("close")
							});
						}						   
					});
					
					
					
					// Open the panel by clicking on a link that point to #topPanel
					$('a[href="#topPanel"]').click(function(){
						$('html, body').animate({  
							scrollTop: 0  
						}, 300);
						panelHandle.trigger("click");
						return false;
					});
				}
			}
		
		},
		
		
		
	
		// Show a placeholder text in input fields
		placeHolder		: function(){
		
			var inputElement		= document.createElement('input'),
				supportsPlaceholder	= 'placeholder' in inputElement;
			
			if( !supportsPlaceholder ){
				// If your browser does not support placeholders
				$("input[type=text], textarea").each(function(){
					$(this).val($(this).attr('placeholder'));
				}).focus(function(){
					if($(this).val() == $(this).attr('placeholder')) { $(this).val(""); }
				}).blur(function(){
					if($(this).val() == "") { $(this).val($(this).attr('placeholder')); }
				});
			}
		
		}
	
	}
	
	mtdScript.initSite();

});