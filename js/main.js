$(document).ready(function(e) {
	Modernizr.load([ {
		test : Modernizr.cssanimations,
		complete : function () {
		    
		    $.ajax({
		        url:"data/home.json",
		        dataType:"json",
		        success:function(response) {
		          //alert(response.services.length);  
		          Site.init(response);
		        },
		        error:function(e) {
		          alert("error loading datas");
		        }
		    });
		}
	  },
	]);
});

var Site = (function(){
	
	"use strict";
	
	//json response
	var response;
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
	var services_MOC_subCats = [];
	var services_RDA_subCats = [];
	var services_SBP_subCats = [];
	var services_color_scheme = [];
	var organizations_color_scheme = [];
	var services_subCat_desc = [];
	var services_subCat_title = [];
    
	var model;
	var colCount = 0;
	var colWidth = 0;
	var margin = 10;
	var windowWidth = 0;
	var blocks = [];
	var blockHeights = [];
	var timeout;
	
	function populateContent() {
	    
	    $(".services_icon_box").each(function(index) {
		  $(this).find("img").attr({"src":response.services[index].iconBig});
		  $(this).find("p").append(response.services[index].name);
		});
		
		$.each(response.services[0].subMenu, function(index) {
		     
              //generate id to be used as tag
              var n = response.services[0].subMenu[index].name.toLowerCase();;
              var pattern1 = /[\W]/g;
              n =  n.replace(pattern1, " "); 
              var pattern2 = /\s{1,}/g;
              var generated_id =  n.replace(pattern2, "_");
              //trace(generated_id);
              $("#SBP_sub").find("ul").append("<li class='services_sub_cat' id='"+ generated_id +"'><p>"+ response.services[0].subMenu[index].name +"</p></li>");
		  
		});
		
		$.each(response.services[1].subMenu, function(index) {
              //generate id to be used as tag
              var n = response.services[1].subMenu[index].name.toLowerCase();
               var pattern1 = /[\W]/g;
              n =  n.replace(pattern1, " "); 
              var pattern2 = /\s{1,}/g;
              var generated_id =  n.replace(pattern2, "_");
              //trace(generated_id);
              
              $("#GLD_sub").find("ul").append("<li class='services_sub_cat' id='"+ generated_id +"'><p>"+ response.services[1].subMenu[index].name +"</p></li>");
              
          
        });
        
        $.each(response.services[2].subMenu, function(index) {
            
              //generate id to be used as tag
              var n = response.services[2].subMenu[index].name.toLowerCase();;
              var pattern1 = /[\W]/g;
              n =  n.replace(pattern1, " "); 
              var pattern2 = /\s{1,}/g;
              var generated_id =  n.replace(pattern2, "_");
              //trace(generated_id);
              $("#MOC_sub").find("ul").append("<li class='services_sub_cat' id='"+ generated_id +"'><p>"+ response.services[2].subMenu[index].name +"</p></li>");
              
          
        });
        
        $.each(response.services[3].subMenu, function(index) {
              //generate id to be used as tag
              var n = response.services[3].subMenu[index].name.toLowerCase();;
               var pattern1 = /[\W]/g;
               n =  n.replace(pattern1, " "); 
               var pattern2 = /\s{1,}/g;
               var generated_id =  n.replace(pattern2, "_");
              //trace(generated_id);
              $("#RDA_sub").find("ul").append("<li class='services_sub_cat' id='"+ generated_id +"'><p>"+ response.services[3].subMenu[index].name +"</p></li>");
                  
        });
        
        $(".organizations_icon_box").each( function(index) {
            
              var n = response.organizations[index].name; 
              var pattern1 = /[\W]/g;
              n =  n.replace(pattern1, " "); 
              var pattern2 = /\s{1,}/g;
              var generated_id =  n.replace(pattern2, "_");
              //trace(generated_id);
              $(this).attr({"id":generated_id});
              $(this).find("img").attr({"src":response.organizations[index].iconBig});
              $(this).find("p").append(response.organizations[index].name);
        });
        
        //populate blocks
        if (response.blocks.length > 0) {
            $.each(response.blocks, function(index) {
               
               var node = document.createElement("div");
               if (response.blocks[index].image) { 
                   node.className = "block big";
               }
               else {
                   node.className = "block small";
                   node.style.backgroundColor = response.blocks[index].color;
               }
               node.dataset.tags = response.blocks[index].tags;
               document.getElementById("blocks_container").appendChild(node);
               
               if (response.blocks[index].image) {
                   var node2 = document.createElement("img");
                   node2.className = "thumb";
                   node2.setAttribute("src", response.blocks[index].image );
                   node.appendChild(node2);
               }
               
               var node3 = document.createElement("div");
               node3.className = "title";
               node.appendChild(node3);
               
               var node4 = document.createElement("p");
               node4.innerHTML = response.blocks[index].title;
               if (response.blocks[index].image) node4.style.color = response.blocks[index].color;
               node3.appendChild(node4);
               
               var node5 = document.createElement("div");
               node5.className = "icons_container";
               node.appendChild(node5);
               
               var node6 = document.createElement("img");
               node5.appendChild(node6);
                      
            });
        }
        else {
            
        }
        
	}
	
	function init(_response) {
	    //response = $.parseJSON(_response);
	    response = _response;
	    populateContent();
	    
	    if ("addEventListener" in document.body) {
    		//for IOS devices you prevent native scrolling and create a custom scrolling events
    		document.body.addEventListener('touchmove', function(event) {
    			 //event.preventDefault();
    		}, false);
    		
    		var Scroller = function(element) {
    		
    		  this.element = this;
    		  this.startTouchY = 0;
    		  this.animateTo(0);
    		
    		  element.addEventListener("touchstart", this, false);
    		  element.addEventListener("touchmove", this, false);
    		  element.addEventListener("touchend", this, false);
    		}
    		
    		Scroller.prototype.handleEvent = function(e) {
    		  switch (e.type) {
    			case "touchstart":
    			  this.onTouchStart(e);
    			  break;
    			case "touchmove":
    			  this.onTouchMove(e);
    			  break;
    			case "touchend":
    			  this.onTouchEnd(e);
    			  break;
    		  }
    		}
    		Scroller.prototype.onTouchStart = function(e) {
    		  // This will be shown in part 4.
    		  //this.stopMomentum();
    		
    		  this.startTouchY = e.touches[0].clientY;
    		  this.contentStartOffsetY = this.contentOffsetY;
    		}
    		
    		Scroller.prototype.onTouchMove = function(e) {
    		  if (this.isDragging()) {
    			var currentY = e.touches[0].clientY;
    			var deltaY = currentY - this.startTouchY;
    			var newY = deltaY + this.contentStartOffsetY;
    			this.animateTo(newY);
    		  }
    		}
    		
    		Scroller.prototype.onTouchEnd = function(e) {
    		  if (this.isDragging()) {
    			if (this.shouldStartMomentum()) {
    			  // This will be shown in part 3.
    			  //this.doMomentum();
    			} else {
    			  this.snapToBounds();
    			}
    		  }
    		}
    		
    		Scroller.prototype.animateTo = function(offsetY) {
    			
    		  this.contentOffsetY = offsetY;
    		  // We use webkit-transforms with translate3d because these animations
    		  // will be hardware accelerated, and therefore significantly faster
    		  // than changing the top value.
    		  document.getElementById("content").style.webkitTransform = "translate3d(0, " + offsetY + "px, 0)";
    		}
    		
    		// Implementation of this method is left as an exercise for the reader.
    		// You need to measure the current position of the scrollable content
    		// relative to the frame. If the content is outside of the boundaries
    		// then simply reposition it to be just within the appropriate boundary.
    		Scroller.prototype.snapToBounds = function() {
    		  ///...
    		}
    		
    		// Implementation of this method is left as an exercise for the reader.
    		// You need to consider whether their touch has moved past a certain
    		// threshold that should be considered ‘dragging’.
    		Scroller.prototype.isDragging = function() {
    		  ///...
    		}
    		
    		// Implementation of this method is left as an exercise for the reader.
    		// You need to consider the end velocity of the drag was past the
    		// threshold required to initiate momentum.
    		Scroller.prototype.shouldStartMomentum = function() {
    		  ///...
    		}
    		
    		var content = new Scroller(document.getElementById("content"));
		}
		
		
		
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
			$("#main_banner #red_bar").css({"margin-top":$("#illustration").height()});
			
			
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
			
			//$("#illustration_container").css({"top":$(window).scrollTop()});
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
		$("#MOC_sub .services_sub_cat").each(function(index, element) {
            services_MOC_subCats.push($(this).attr("id"));
        });
		$("#RDA_sub .services_sub_cat").each(function(index, element) {
            services_RDA_subCats.push($(this).attr("id"));
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
				else if ($.inArray($(this).attr("id"), services_MOC_subCats) != -1) model.setCurrTag("Management_Organizational_Change");
				else if ($.inArray($(this).attr("id"), services_RDA_subCats) != -1) model.setCurrTag("Resource_Development_Allocation"); 
				else if ($.inArray($(this).attr("id"), services_SBP_subCats) != -1) model.setCurrTag("Strategic_Business_Planning");  
				
				model.setCurrSubTag($(this).attr("id"), index);
				//trace(model.getCurrSection()+":"+model.getCurrTag()+":"+model.getCurrSubTag());
			});
		});
        
        $.each(response.services, function(index) {
            $.each(response.services[index].subMenu, function(_index) {
               services_subCat_title.push(response.services[index].subMenu[_index].name);
               services_subCat_desc.push(response.services[index].subMenu[_index].desc);
               //trace(response.services[index].subMenu[_index].desc);
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
		var currSubTagIndex;
		
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
		
		this.setCurrSubTag= function(_subTag, _index) {
			currSubTag = _subTag;
			currSubTagIndex = _index
			this.onSubTagChange.notify("onSubTagChange");
		}
		this.getCurrSubTag = function() {
			return currSubTag;
		}
		this.getCurrSubTagIndex = function() {
		  return currSubTagIndex;
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
		
		//recruit associated tags from DOM data-tags attribute 
		$.each(services_cats, function(index, value) {
		  if (_this.block.data("tags").split(",").contains(value.toLowerCase())) _this.servicesTags.push(value); 
		  //if (_this.block.hasClass(value)) _this.servicesTags.push(value);
		});
		$.each(services_GLD_subCats, function(index, value) {
		  if (_this.block.data("tags").split(",").contains(value.toLowerCase())) _this.servicesSubTags.push(value); 
		  //if (_this.block.hasClass(value)) _this.servicesSubTags.push(value);
		});
		$.each(services_MOC_subCats, function(index, value) {
		  if (_this.block.data("tags").split(",").contains(value.toLowerCase())) _this.servicesSubTags.push(value); 
		  //if (_this.block.hasClass(value)) _this.servicesSubTags.push(value);
		});
		$.each(services_RDA_subCats, function(index, value) {
		  if (_this.block.data("tags").split(",").contains(value.toLowerCase())) _this.servicesSubTags.push(value); 
		  //if (_this.block.hasClass(value)) _this.servicesSubTags.push(value);
		});
		$.each(services_SBP_subCats, function(index, value) {
		  if (_this.block.data("tags").split(",").contains(value.toLowerCase())) _this.servicesSubTags.push(value); 
		  //if (_this.block.hasClass(value)) _this.servicesSubTags.push(value);
		});
		$.each(organizations_cats, function(index, value) {
		  if (_this.block.data("tags").split(",").contains(value.toLowerCase())) _this.organizationsTags.push(value); 
		  //if (_this.block.hasClass(value)) _this.organizationsTags.push(value);
		});
	}
	Block.prototype.update = function(_event) {
			switch (_event) {
				case "onSectionChange":
					if ((model.getCurrTag() == "undefined") || (model.getCurrTag() == undefined)) {
						if (this.size == "big") {
							 if (model.getCurrSection() == "services") {
								 this.block.find(".title p").css({"color":services_color_scheme[$.inArray(this.servicesTags[0], services_cats)]});
								 this.block.find(".icons_container img").attr({"src":"images/icons/icon_"+this.servicesTags[0]+"_color.png"}); 
							 }
							 else if (model.getCurrSection() == "organizations") {
								 this.block.find(".title p").css({"color":organizations_color_scheme[$.inArray(this.organizationsTags[0], organizations_cats)]}); 
								 this.block.find(".icons_container img").attr({"src":"images/icons/icon_"+this.organizationsTags[0]+"_color.png"}); 
							 }
						}
						else {
							 if (model.getCurrSection() == "services") {
								 this.block.css({"background-color":services_color_scheme[$.inArray(this.servicesTags[0], services_cats)]}); 
							 	 this.block.find(".icons_container img").attr({"src":"images/icons/icon_"+this.servicesTags[0]+"_white.png"}); 
							 }
							 else if (model.getCurrSection() == "organizations") {
								 this.block.css({"background-color":organizations_color_scheme[$.inArray(this.organizationsTags[0], organizations_cats)]});
								  this.block.find(".icons_container img").attr({"src":"images/icons/icon_"+this.organizationsTags[0]+"_white.png"}); 
							 }
						}	
					}
					break;
				case "onTagChange":
					if ((model.getCurrTag() != "undefined") && (model.getCurrTag() != undefined)) {
						if (($.inArray(model.getCurrTag(), this.servicesTags) != -1) || ($.inArray(model.getCurrTag(), this.organizationsTags) != -1)) {
							if (this.size == "big") {
								 this.block.find(".icons_container img").attr({"src":"images/icons/icon_"+model.getCurrTag()+"_color.png"});
								 if (model.getCurrSection() == "services") this.block.find(".title p").css({"color":services_color_scheme[$.inArray(model.getCurrTag(), services_cats)]}); 
								 else if (model.getCurrSection() == "organizations") this.block.find(".title p").css({"color":organizations_color_scheme[$.inArray(model.getCurrTag(), organizations_cats)]}); 
							}
							else {
								 this.block.find(".icons_container img").attr({"src":"images/icons/icon_"+model.getCurrTag()+"_white.png"}); 
								 if (model.getCurrSection() == "services") this.block.css({"background-color":services_color_scheme[$.inArray(model.getCurrTag(), services_cats)]}); 
								 else if (model.getCurrSection() == "organizations") this.block.css({"background-color":organizations_color_scheme[$.inArray(model.getCurrTag(), organizations_cats)]});
							}						
						}
					} 
					break;
				case "onSubTagChange":
					break;
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
	
	Array.prototype.contains = function(obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    }
	
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
					trace(model.getCurrSubTagIndex());
					trace(model.getCurrTag());
					trace(services_subCat_title[model.getCurrSubTagIndex()]);
					trace(services_subCat_desc[model.getCurrSubTagIndex()]);
					
					$(".sub_tag_title").html(services_subCat_title[model.getCurrSubTagIndex()].toUpperCase());
					switch (model.getCurrTag()) {
					   case "Strategic_Business_Planning":
					       
					       break;
					   case "Governance_Leadership_Development":
                           break;
                       case "Management_Organizational_Change":
                           break;
                       case "Resource_Development_Allocation":
                           break;
					}
					
				}
				break;
		}
	}
	
	return {
		init:init,
		update:update
	}
})();

function trace(_val) {
	if (console) {
		console.log(_val);
	}
} 
