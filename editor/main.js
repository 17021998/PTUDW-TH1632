(function () {
	$(".clickable-row").click(function() {
		window.location = $(this).data("href");
	});
	
	var isMobile = {
		Android: function () {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function () {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function () {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function () {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function () {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function () {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	var fullHeight = function () {

		if (!isMobile.any()) {
			$('.js-fullheight').css('height', $(window).height());
			$(window).resize(function () {
				$('.js-fullheight').css('height', $(window).height());
			});
		}

	};

	var burgerMenu = function () {

		$('.js-toggle').on('click', function (event) {
			event.preventDefault();
			var $this = $(this);

			if ($('body').hasClass('offcanvas')) {
				$this.removeClass('active');
				$('body').removeClass('offcanvas');
			} else {
				$this.addClass('active');
				$('body').addClass('offcanvas');
			}
		});
	};

	var menuToggle = function () {
		$('.js-menu-toggle').on('click', function (event) {
			event.preventDefault();
			var $this = $(this);

			if ($this.hasClass('active')) {
				$this.removeClass('active');
			}
			else {
				$this.addClass('active');
			}
		});

		$(".js-menu-toggle ul").click(function (e) {
			e.stopPropagation();
		});
	};


	var mobileMenuOutsideClick = function () {

		$(document).click(function (e) {
			var container = $("#page-aside, .js-toggle");
			if (!container.is(e.target) && container.has(e.target).length === 0) {

				if ($('body').hasClass('offcanvas')) {

					$('body').removeClass('offcanvas');
					$('.js-toggle').removeClass('active');

				}

			}
		});

		$(window).scroll(function () {
			if ($('body').hasClass('offcanvas')) {

				$('body').removeClass('offcanvas');
				$('.js-toggle').removeClass('active');

			}
		});

	};

	$(function () {
		fullHeight();
		burgerMenu();
		menuToggle();
		mobileMenuOutsideClick();
	});
}());