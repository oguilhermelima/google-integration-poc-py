
(function ($) {

    "use strict";
	
	siteNavigation();
	
	
	// SCROLL TO ELEMENT
	scrollToAnim();
	
	// ACCORDIAN
	panelAccordian();
		
	
	// ISOTOPE PORTFOLIO WITH FILTER
	if(isExists('.portfolioContainer')){
		var $container = $('.portfolioContainer');
		$container.isotope({
			filter: '*',
			animationOptions: {
				duration: 750,
				easing: 'linear',
				queue: false
			}
		});
	 
		$('.portfolioFilter a').click(function(){
			$('.portfolioFilter .current').removeClass('current');
			$(this).addClass('current');
	 
			var selector = $(this).attr('data-filter');
			$container.isotope({
				filter: selector,
				animationOptions: {
					duration: 750,
					easing: 'linear',
					queue: false
				}
			 });
			 return false;
		}); 
	}
	
	$('a[href="#"]').on('click', function(event){
		return;
	});
	
	
	$('[data-nav-menu]').on('click', function(event){
		
		var $this = $(this),
			visibleHeadArea = $this.data('nav-menu');
		
		$(visibleHeadArea).toggleClass('visible');
		
	});

	
	var winWidth = $(window).width();
	dropdownMenu(winWidth);
	
	$(window).on('resize', function(){
		dropdownMenu(winWidth);
		
	});
	
	var countLineProgress = 0;
	var countCounterUp = 0;
	
	var a = 0 ;
	
	countCounterUp = enableCounterUp(countCounterUp);
	
	$(window).on('scroll', function(){
		
		countCounterUp = enableCounterUp(countCounterUp);
	
	});

	
})(jQuery);

function panelAccordian(){
	
	var panelTitle = $('.panel-title');
	panelTitle.on('click', function(){
		
		$(this).toggleClass('active');
		
	});
	
}

function enableCounterUp(a){
	
	var counterElement;
	
	if(isExists('#counter')){ counterElement = $('#counter'); }
	else{ return; }
		
	var oTop = $('#counter').offset().top - window.innerHeight;
	if (a == 0 && $(window).scrollTop() > oTop) {
		$('.counter-value').each(function() {
			var $this = $(this),
				countDuration = $this.data('duration'),
				countTo = $this.attr('data-count');
			$({
				countNum: $this.text()
			}).animate({
				countNum: countTo
			},{

				duration: countDuration,
				easing: 'swing',
				step: function() {
					$this.text(Math.floor(this.countNum));
				},
				complete: function() {
					$this.text(this.countNum);
				}

			});
		});
		a = 1;
	}

	return a;
}

function dropdownMenu(winWidth){
	
	if(winWidth > 767){
		
		$('.main-menu li.drop-down').on('mouseover', function(){
			var $this = $(this),
				menuAnchor = $this.children('a');
				
			menuAnchor.addClass('mouseover');
			
		}).on('mouseleave', function(){
			var $this = $(this),
				menuAnchor = $this.children('a');
				
			menuAnchor.removeClass('mouseover');
		});
		
	}else{
		
		$('.main-menu li.drop-down > a').on('click', function(){
			
			if($(this).attr('href') == '#') return false;
			if($(this).hasClass('mouseover')){ $(this).removeClass('mouseover'); }
			else{ $(this).addClass('mouseover'); }
			return false;
		});
	}
	
}

function isExists(elem){
	if ($(elem).length > 0) { 
		return true;
	}
	return false;
}

function scrollToAnim(){
	// Select all links with hashes
$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 500, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });
}

function siteNavigation(){
	
	if(isExists('.site-navigation')){
		var elemCount = $('.site-navigation li').length - 2;
		var count = 0;
		
		var navIDs = [];
		$('.site-navigation').find('li > a').each(function(){
			var id = $(this).attr('href');
			if(id != '#') navIDs.push(id); 
		});
		
		$('.site-navigation > li > a').on('click', function(){
			
			var $this = $(this),
				clickedElem;
			
			$('.site-navigation > li > a').removeClass('active');
			
			if($this.hasClass('btn-next')) count++;
			else if($this.hasClass('btn-prev')) count--;
			else{
				clickedElem = $this.attr('href');
				count = jQuery.inArray(clickedElem, navIDs) + 1;
			}
			
			if((count > elemCount) || (count < 1)) {
				count = 0;
				$('html, body').animate({ scrollTop: 0 }, 100);
				return;
			}
			
			var currentAnchor = $('.site-navigation > li > a[href="'+ navIDs[count-1] +'"]');
			currentAnchor.addClass('active');
			
			$('html, body').animate({ scrollTop: $(navIDs[count-1]).offset().top }, 300);
			
		});
	}
	
}
/////////////// SCROLL PARA SESSÃO HTML
// Recebe a url e retorna os parametros 
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var submit = getParameterByName('submit');

// Faz rolagem para sessão de locais no html 
if (submit=="locais"){
	var scrolldown = document.getElementById("locais");
	scrolldown.scrollIntoView();
}

////////////////// BUSCA CEP E AUTO COMPLETA CAMPOS
$("#cep").focusout(function(){
	$.ajax({
	//O campo URL diz o caminho de onde virá os dados
	url: 'https://viacep.com.br/ws/'+$(this).val()+'/json/unicode/',
    //Define o tipo de dado para JSON
	dataType: 'json',
	//SUCESS função executada caso consiga ler a fonte de dados com sucesso
	success: function(endereco){
	    $("#rua").val(endereco.logradouro);
		$("#bairro").val(endereco.bairro);
		$("#cidade").val(endereco.localidade);
		$("#estado").val(endereco.uf);
		}
	});
});

/////////////// SLIDER QUANTIDADE DE LOCAIS - FILTROS INDEX
var slider = document.getElementById("range-places");
var output = document.getElementById("count-places");
output.innerHTML = slider.value; // APRESENTA O VALOR PADRÃO DO SLIDER

// MUDA O VALOR TODA VEZ QUE MOVIMENTA O SLIDER
slider.oninput = function() {
    output.innerHTML = this.value;
}