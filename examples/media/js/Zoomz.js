(function($) {
	$.extend($.fn, {
		fetchRelativeParent: function() {
			var $this = $(this).eq(0),
					parentNode = $this.parent();
			if (!parentNode.length || parentNode.get(0).tagName === 'BODY') {
				return $this;
			} else if (parentNode.css('position') === 'relative') {
				return parentNode;
			} else {
				return parentNode.fetchRelativeParent();
			}
		},

		Zoomz: function(options) {
			if (options === false || options === 0) {
				return this.each(function() {
					var $this = $(this),
							clone = $this.data('clone');
					if (clone) {
						clone.remove();
					}
				});
			}
			var defaults = {
						style: {
							width: 1.4,
							height: 1.4,
							paddingX: '20px',
							paddingY: '10px'
						},
						wait: 250,
						speedOver: 300,
						speedOut: 150
					},
					settings = $.extend(defaults, options),
					ratioed = [],
					additionalCss =	{
						margin: 0,
						position: 'absolute'
					};
			$.each(settings.style, function(index, item) {
				if (typeof item === 'number') {
					ratioed.push(index);
				}
			});
			var applyZoom = function() {
						var $this = $(this).parent(),
								relativeParent = $this.fetchRelativeParent(),
								// @TODO: Investigate how to test universal case w/ margins and relative parent of body elm.
								offsetLeft = $this.offset().left - relativeParent.offset().left, // + parseInt(relativeParent.css('margin-left'), 10),
								offsetTop = $this.offset().top - relativeParent.offset().top, // + parseInt(relativeParent.css('margin-top'), 10),
								width = $this.width(),
								height = $this.height(),
								animWidth = $.inArray('width', ratioed) !== -1 ? width * settings.style.width : parseInt(settings.style.width, 10),
								animHeight = $.inArray('height', ratioed) !== -1 ? height * settings.style.height : parseInt(settings.style.height, 10),
								clone = $this.clone().addClass('clone').appendTo($this.parent()).css(additionalCss),
								animProps = {
									over: {
										width: animWidth + 'px',
										height: animHeight + 'px',
										'top': offsetTop - ((animHeight - height) / 2) + 'px',
										'left': offsetLeft - ((animWidth - width) / 2) + 'px',
										'paddingLeft': settings.style.paddingX,
										'paddingRight': settings.style.paddingX,
										'paddingBottom': settings.style.paddingY,
										'paddingTop': settings.style.paddingY
									},
									out: {
										width: width + 'px',
										height: height + 'px',
										 'left': offsetLeft + 'px',
										'top': offsetTop + 'px',
										'paddingLeft': parseInt($this.css('padding-left'), 10),
										'paddingRight': parseInt($this.css('padding-right'), 10),
										'paddingBottom': parseInt($this.css('padding-bottom'), 10),
										'paddingTop': parseInt($this.css('padding-top'), 10)
									}
								};
						clone.css(animProps.out).hide().css('zIndex', 1).find('img').css('width', '100%');
						$this.bind('mouseenter', function() {
							clone.show();
						});
						clone.bind({
							mouseenter: function(e) {
								var	$these = $(this);
								$these.addClass('hover');
								window.setTimeout(function() {
									if ($these.hasClass('hover')) {
										clone.addClass('animated').css('zIndex', 900000).animate(animProps.over, settings.speedOver, function() {
											$this.trigger('animationComplete').trigger('enlargmentComplete');
										});
										$this.trigger('animationStart').trigger('enlargementStart');
									}
								}, settings.wait);
							},
							mouseleave: function() {
								var $these = $(this);
								clone.animate(animProps.out, settings.speedOut, function() {
									$these.removeClass('hover animated');
									$(this).css('zIndex', 2).hide();
									$this.trigger('animateComplete').trigger('shrinkComplete');
								});
								$this.trigger('animationStart').trigger('shrinkStart');
							},
							click: function() {
								$this.trigger('click');
							}
						});
						$this.data('clone', clone);	
					};
			return this.each(function() {
				var $this = $(this),
						images = $this.find('img'),
						Img;
				if (images.length) {
					Img = images.get(0);
				} else {
					return;
				}
				if (Img.width) {
					applyZoom.apply(Img);
				} else {
					Img.onload = applyZoom;
				}
			});
		}
	});
}(jQuery));
