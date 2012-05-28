$.extend $.fn,
	fetchRelativeParent: () ->
		$this = $(this).eq 0
		parentNode = $this.parent()
		if not parentNode.length or parentNode.get(0).tagName is 'BODY'
			$this
		else if parentNode.css('position') is 'relative'
			parentNode
		else
			parentNode.fetchRelativeParent()
	Zoomz: (options) ->
		if options is false or options is 0
			this.each () ->
				$this = $ this
				clone = $this.data 'clone'
				if clone
					clone.remove()
		defaults =
			style:
				width: 1.4
				height: 1.4
				paddingX: '20px'
				paddingY: '10px'
			wait: 250
			speedOver: 300
			speedOut: 150
		settings = $.extend defaults, options
		ratioed = []
		additionalCss =
			margin: 0
			position: 'absolute'
		$.each settings.style, (index, item) ->
			if typeof item is 'number'
				ratioed.push index
		applyZoom = () ->
			$this = $(this).parent()
			parentNode = $this.parent()
			relativeParent = $this.fetchRelativeParent()
			offsetLeft = $this.offset().left - relativeParent.offset().left
			offsetTop = $this.offset().top - relativeParent.offset().top
			width = $this.width()
			height = $this.height()
			animWidth = if $.inArray('width', ratioed) isnt -1 then width * settings.style.width else parseInt settings.style.width, 10
			animHeight = if $.inArray('height', ratioed) isnt -1 then height * settings.style.height else parseInt settings.style.height, 10
			clone = $this.clone().addClass('clone').appendTo(parentNode).css additionalCss
			px = 'px'
			animProps =
				over:
					width: animWidth + px
					height: animHeight + px
					top: offsetTop - ((animHeight - height) / 2) + px
					left: offsetLeft - ((animWidth - width) / 2) + px
					paddingLeft: settings.style.paddingX
					paddingRight: settings.style.paddingX
					paddingBottom: settings.style.paddingY
					paddingTop: settings.style.paddingY
				out:
					width: width + px
					height: height + px
					left: offsetLeft + px
					top: offsetTop + px
					paddingLeft: parseInt $this.css('padding-left'), 10
					paddingRight: parseInt $this.css('padding-right'), 10
					paddingBottom: parseInt $this.css('padding-bottom'), 10
					paddingTop: parseInt $this.css('padding-top'), 10
			clone.css(animProps.out).hide().css('zIndex', 1).find('img').css 'width', '100%'
			$this.bind 'mouseenter', () ->
				clone.show()
			clone.bind
				mouseenter: (e) ->
					$these = $ this
					$these.addClass 'hover'
					window.setTimeout (() ->
						if $these.hasClass 'hover'
							clone.addClass('animated').css('zIndex', 900000).animate animProps.over, settings.speedOver, () -> $this.trigger('animationComplete').trigger 'enlargementComplete'

						), settings.wait
				mouseleave: () ->
					$these = $ this
					clone.animate animProps.out, settings.speedOut, () -> 
						$these.removeClass 'hover animated'
						$these.css('zIndex', 2).hide()
						$this.trigger('animationComplete').trigger 'shrinkComplete'
					$this.trigger('animationStart').trigger 'shrinkStart'
				click: () -> $this.trigger 'click'
			$this.data 'clone', clone
		this.each () ->
			$this = $ this
			images = $this.find 'img'
			if images.length
				Img = images.get 0
			else
				undefined
			if Img.width
				applyZoom.apply Img
			else
				Img.onload = applyZoom