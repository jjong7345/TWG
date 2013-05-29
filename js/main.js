$(document).ready(function(e) {
	Modernizr.load([ {
		test : Modernizr.cssanimations,
		complete : function () {
			Site.init();
		}
	  },
	]);
});

var Site = (function(){
	
	"use strict";
	
	// Calulate image ratio by (height/width) of image
	var imageRatio = 839/1600;
	var decreaseRatio = 150;
	
	var mainBannerHeight;
	var services;
	var organizations;
	var _this = this;
	var organizations_cats = [];
	var services_cats = [];
	var services_GLD_subCats = [];
	var services_FCS_subCats = [];
	var services_ODS_subCats = [];
	var services_SBP_subCats = [];
	var services_color_scheme = [];
	var organizations_color_scheme = [];
	
	var model;
	var colCount = 0;
	var colWidth = 0;
	var margin = 10;
	var windowWidth = 0;
	var blocks = [];
	var blockHeights = [];
	var timeout;
	
	function init() {
		
		$("#hit_area").mouseenter(function(e) {
			$(".popup").show();
		});
		
		$("#hit_area").mouseleave(function(e) {
            $(".popup").hide();
        });
		
		//set up observer pattern for event listeners
		Event.prototype = {
			attach:function(_listener, _functionCall) {
				this.listeners.push(_listener);
				this.functionCalls.push(_functionCall);
			},
			notify:function(_event){
				for (var i=0; i<this.listeners.length; i++) {
					this.listeners[i][this.functionCalls[i]](_event);
				}
			}
		}
		
		$(window).resize(function(e) {
			
			windowWidth = $(window).width(); 
			
			if ($(window).width() < 1000) windowWidth = 1000;
			
			/*mainBannerHeight = (windowWidth * imageRatio) + $("#red_bar").height() + $("#main_desc").height() + parseInt($("#main_desc").css("padding-top")) + parseInt($("#illustration").css("border-bottom-width"));*/
			$("#illustration").height((windowWidth * imageRatio) - (decreaseRatio));
			
			mainBannerHeight = $("#illustration").height() + $("#red_bar").height() + $("#main_desc").height() + parseInt($("#main_desc").css("padding-top")) + parseInt($("#illustration").css("border-bottom-width")) + 1;
			
			//$("html, body").scrollTop(mainBannerHeight);
			
			clearTimeout(timeout);
			timeout = setTimeout(setupBlocks, 150);
			
			$(window).scroll();
			
        });
		
		$(window).scroll(function(e) {
			if ($(window).scrollTop() > (mainBannerHeight)) {
				$("#header").css({"top":-($(window).scrollTop() - (mainBannerHeight))});
			} 
			else {
				$("#header").css({"top":"0px"});
			}
			//trace("scrolling");
		});		
		
		services = $("#services");
		organizations = $("#organizations");
		
		services.click(function(e) {
			model.setCurrSection("services");
			//update();
			closeMainBanner();
			
			return false;
		});
		organizations.click(function(e) {
			model.setCurrSection("organizations");
			//update();
			closeMainBanner();
			
			return false;
		});
		
		$(".logo").click(function(e) {
			openMainBanner();
			
			return false;
		});
		 
		$(".services_icon_box").each(function(index, element) {
			services_cats.push($(this).attr("id"));
			services_color_scheme.push($(this).css("background-color"));
			
       		$(this).click(function() {
				model.setCurrTag(services_cats[index]);
				model.setCurrSubTag("undefined");
				//trace(model.getCurrSection()+":"+model.getCurrTag()+":"+model.getCurrSubTag());
			});
	    });
		
		$("#GLD_sub .services_sub_cat").each(function(index, element) {
            services_GLD_subCats.push($(this).attr("id"));
        });
		$("#FCS_sub .services_sub_cat").each(function(index, element) {
            services_FCS_subCats.push($(this).attr("id"));
        });
		$("#ODS_sub .services_sub_cat").each(function(index, element) {
            services_ODS_subCats.push($(this).attr("id"));
        });
		$("#SBP_sub .services_sub_cat").each(function(index, element) {
            services_SBP_subCats.push($(this).attr("id"));
        });
		
		$(".organizations_icon_box").each(function(index, element) {
			organizations_cats.push($(this).attr("id"));
			organizations_color_scheme.push($(this).css("background-color"));
       		$(this).click(function(e) {
				model.setCurrTag(organizations_cats[index]);
				model.setCurrSubTag("undefined");
			});
	    });
		
		$(".services_sub_cat").each(function(index, element) {
			$(this).mouseover(function(e) {
				$(this).css({"background-color":"#705554"});
			});
			$(this).mouseout(function(e) {
				$(this).css({"background-color":""});
			});
			$(this).click(function(e) {
				if ($.inArray($(this).attr("id"), services_GLD_subCats) != -1) model.setCurrTag("Governance_Leadership_Development"); 
				else if ($.inArray($(this).attr("id"), services_FCS_subCats) != -1) model.setCurrTag("Fundraising_Campaign_Services");
				else if ($.inArray($(this).attr("id"), services_ODS_subCats) != -1) model.setCurrTag("Organizational_Development_Scaling"); 
				else if ($.inArray($(this).attr("id"), services_SBP_subCats) != -1) model.setCurrTag("Strategic_Business_Planning");  
				
				model.setCurrSubTag($(this).attr("id"));
				//trace(model.getCurrSection()+":"+model.getCurrTag()+":"+model.getCurrSubTag());
			});
		});
		
		model = new Model();
		model.onSectionChange.attach(this, "update");
		model.onTagChange.attach(this, "update");
		model.onSubTagChange.attach(this, "update");
		$(".block").each(function(index, element) {
            var _block = new Block($(this));
			blocks.push(_block);
			//blocks.sort(function() {return 0.5 - Math.random()});
			model.onSectionChange.attach(_block, "update");
			model.onTagChange.attach(_block, "update");
			model.onSubTagChange.attach(_block, "update");
        });
		
		//initialize
		model.setCurrSection("services");
		
		$(window).resize();
	}
	
	function Model() {
		var currSection;
		var currTag;
		var currSubTag;
		
		this.onSectionChange = new Event(this);
		
		this.setCurrSection = function(_section) {
			currSection = _section;
			this.onSectionChange.notify("onSectionChange");
		}
		this.getCurrSection = function() {
			return currSection;
		}
		
		this.onTagChange = new Event(this);
		
		this.setCurrTag = function(_tag) {
			currTag = _tag;
			this.onTagChange.notify("onTagChange");
		}
		this.getCurrTag = function() {
			return currTag;
		}
		
		this.onSubTagChange = new Event(this);
		
		this.setCurrSubTag= function(_subTag) {
			currSubTag = _subTag;
			this.onSubTagChange.notify("onSubTagChange");
		}
		this.getCurrSubTag = function() {
			return currSubTag;
		}
	}
	
	function Event(_sender) {
		this.sender = _sender;
		this.listeners = [];
		this.functionCalls = [];
	}
	
	
	function closeMainBanner() {
		mainBannerHeight = $("#illustration").height() + $("#red_bar").height() + $("#main_desc").height() + parseInt($("#main_desc").css("padding-top")) + parseInt($("#illustration").css("border-bottom-width")) + 1;
		/*$("#main_banner").animate({"top":-mainBannerHeight+"px"},{ queue:false, easing:"easeInOutQuad", duration:500, complete:function() {
			$("#main_banner").css({"height":"0px"});
		}});
		$("#content").animate({"top":-mainBannerHeight+"px"},{ queue:false, easing:"easeInOutQuad", duration:500, complete:function() {
			$("#content").css({"top":"0px"});
		}});*/
		
		
		$("html, body").animate({ scrollTop: mainBannerHeight +"px" }, { queue:false, easing:"easeInOutQuad", duration:500 } );
	}
	
	function openMainBanner() {
		$("#main_banner").css({"height":mainBannerHeight+"px"});
		//$("#main_banner").css({"top":-mainBannerHeight+"px"});
		$("#main_banner").css({"height":""});
		/*$("#main_banner").animate({"top":0+"px"},{ queue:false, easing:"easeInOutQuad", duration:500 });
		//$("#content").css({"top":-mainBannerHeight+"px"});
		$("#content").css({"top":-mainBannerHeight+"px"}).animate({"top":0+"px"},{ queue:false, easing:"easeInOutQuad", duration:500});*/
		
		$("html, body").animate({ scrollTop: 0 +"px" }, { queue:false, easing:"easeInOutQuad", duration:500 } );
		
	}
	
	function Block(_block) {
		var _this = this;
		this.block = _block;
		this.servicesTags = [];
		this.servicesSubTags = [];
		this.organizationsTags = [];
		if (this.block.hasClass("big")) this.size = "big";
		else this.size = "small";
		
		//recruit associated tags from DOM class attribute 
		$.each(services_cats, function(index, value) {
		  if (_this.block.hasClass(value)) _this.servicesTags.push(value);
		});
		$.each(services_GLD_subCats, function(index, value) {
		  if (_this.block.hasClass(value)) _this.servicesSubTags.push(value);
		});
		$.each(services_FCS_subCats, function(index, value) {
		  if (_this.block.hasClass(value)) _this.servicesSubTags.push(value);
		});
		$.each(services_ODS_subCats, function(index, value) {
		  if (_this.block.hasClass(value)) _this.servicesSubTags.push(value);
		});
		$.each(services_SBP_subCats, function(index, value) {
		  if (_this.block.hasClass(value)) _this.servicesSubTags.push(value);
		});
		$.each(organizations_cats, function(index, value) {
		  if (_this.block.hasClass(value)) _this.organizationsTags.push(value);
		});
		
		this.update = function(_event) {
			//trace(model.getCurrSection()+":"+model.getCurrTag()+":"+model.getCurrSubTag());
			//trace(_this.organizationsTags );
			switch (_event) {
				case "onSectionChange":
					if ((model.getCurrTag() == "undefined") || (model.getCurrTag() == undefined)) {
						if (_this.size == "big") {
							 if (model.getCurrSection() == "services") {
								 _this.block.find(".title p").css({"color":services_color_scheme[$.inArray(_this.servicesTags[0], services_cats)]});
								 _this.block.find(".icons_container img").attr({"src":"images/icons/icon_"+_this.servicesTags[0]+"_color.png"}); 
							 }
							 else if (model.getCurrSection() == "organizations") {
								 _this.block.find(".title p").css({"color":organizations_color_scheme[$.inArray(_this.organizationsTags[0], organizations_cats)]}); 
								 _this.block.find(".icons_container img").attr({"src":"images/icons/icon_"+_this.organizationsTags[0]+"_color.png"}); 
							 }
						}
						else {
							 if (model.getCurrSection() == "services") {
								 _this.block.css({"background-color":services_color_scheme[$.inArray(_this.servicesTags[0], services_cats)]}); 
							 	 _this.block.find(".icons_container img").attr({"src":"images/icons/icon_"+_this.servicesTags[0]+"_white.png"}); 
							 }
							 else if (model.getCurrSection() == "organizations") {
								 _this.block.css({"background-color":organizations_color_scheme[$.inArray(_this.organizationsTags[0], organizations_cats)]});
								  _this.block.find(".icons_container img").attr({"src":"images/icons/icon_"+_this.organizationsTags[0]+"_white.png"}); 
							 }
						}	
					}
					break;
				case "onTagChange":
					if ((model.getCurrTag() != "undefined") && (model.getCurrTag() != undefined)) {
						if (($.inArray(model.getCurrTag(), _this.servicesTags) != -1) || ($.inArray(model.getCurrTag(), _this.organizationsTags) != -1)) {
							if (_this.size == "big") {
								 _this.block.find(".icons_container img").attr({"src":"images/icons/icon_"+model.getCurrTag()+"_color.png"});
								 if (model.getCurrSection() == "services") _this.block.find(".title p").css({"color":services_color_scheme[$.inArray(model.getCurrTag(), services_cats)]}); 
								 else if (model.getCurrSection() == "organizations") _this.block.find(".title p").css({"color":organizations_color_scheme[$.inArray(model.getCurrTag(), organizations_cats)]}); 
							}
							else {
								 _this.block.find(".icons_container img").attr({"src":"images/icons/icon_"+model.getCurrTag()+"_white.png"}); 
								 if (model.getCurrSection() == "services") _this.block.css({"background-color":services_color_scheme[$.inArray(model.getCurrTag(), services_cats)]}); 
								 else if (model.getCurrSection() == "organizations") _this.block.css({"background-color":organizations_color_scheme[$.inArray(model.getCurrTag(), organizations_cats)]});
							}						
						}
					} 
					break;
				case "onSubTagChange":
					break;
			}
		}
	}
	
	function setupBlocks() {
		colWidth = $('.block').outerWidth();
		blockHeights = [];
		colCount = Math.floor(windowWidth/(colWidth+margin));
		$("#blocks_container").width(((colWidth+margin)* colCount) + margin);
		for(var i=0;i<colCount;i++){
			blockHeights.push(margin);
		}
		positionBlocks();
	}
	
	function positionBlocks() {
		$.each(blocks, function(_arrayIndex, _value){
			var min = Array.min(blockHeights);
			var index = $.inArray(min, blockHeights);
			var leftPos = margin+(index*(colWidth+margin));
			
			if (Modernizr.cssanimations) {
				//trace("css Animation available");
				blocks[_arrayIndex].block.css({
					'left':leftPos+'px',
					'top':min+'px'
				});
			}
			else {
				//jQuery fallBack
				blocks[_arrayIndex].block.animate({"left":leftPos+"px", "top":min+"px"}, { queue:false, easing:"easeInOutQuad", duration:700})
				//trace("css Animation not available");
			}
			
			blockHeights[index] = min + blocks[_arrayIndex].block.outerHeight() + margin;
		});
		
		//calculate approximate #blocks_container height
		var min2 = Array.min(blockHeights);
		var index2 = $.inArray(min2, blockHeights);	
		$("#blocks_container").height(blockHeights[index2] + 300);
		//
	}
	
	// Function to get the Min value in Array
	Array.min = function(array) {
		return Math.min.apply(Math, array);
	};
	
	function update(_event) {
		switch (_event) {
			case "onSectionChange":
				model.setCurrTag("undefined");
				model.setCurrSubTag("undefined");
				
				switch (model.getCurrSection()) {
					case "services":
						services.find(".nav_title .arrow").addClass("active");
						organizations.find(".nav_title .arrow").removeClass("active");
						services.find(".nav_title .arrow").removeClass("transparent");
						organizations.find(".nav_title .arrow").addClass("transparent");
						services.find(".nav_title p").removeClass("transparent");
						organizations.find(".nav_title p").addClass("transparent");
						
						$("#services_nav").show();
						$("#organizations_nav").hide();
						break;
					case "organizations":
						services.find(".nav_title .arrow").removeClass("active");
						organizations.find(".nav_title .arrow").addClass("active");
						services.find(".nav_title .arrow").addClass("transparent");
						organizations.find(".nav_title .arrow").removeClass("transparent");
						services.find(".nav_title p").addClass("transparent");
						organizations.find(".nav_title p").removeClass("transparent");
						
						$("#organizations_nav").show();
						$("#services_nav").hide();
						break;
				}
				break;
				
			case "onTagChange":
				if ((model.getCurrTag() != "undefined") && (model.getCurrTag() != undefined)) {
					blocks.sort(function() {return 0.5 - Math.random()});
					for (var i=0; i<blocks.length; i++) {
						if (($.inArray(model.getCurrTag(), blocks[i].servicesTags) != -1) || ($.inArray(model.getCurrTag(), blocks[i].organizationsTags) != -1 )) {
							var _tempBlock = blocks[i];
							blocks.splice(i,1);
							blocks.unshift(_tempBlock);
						}
					}
					setupBlocks();
				}
				break;
			case "onSubTagChange":
				if ((model.getCurrSubTag() != "undefined") && (model.getCurrSubTag() != undefined)) {
					//blocks.sort(function() {return 0.5 - Math.random()});
					for (var i=0; i<blocks.length; i++) {
						if ($.inArray(model.getCurrSubTag(), blocks[i].servicesSubTags) != -1) {
							var _tempBlock = blocks[i];
							blocks.splice(i,1);
							blocks.unshift(_tempBlock);
						}
					}
					setupBlocks();
					
				}
				break;
		}
	}
	
	function trace(_val) {
		if (console) {
			console.log(_val);
		}
	}
	
	return {
		init:init,
		update:update
	}
})();

