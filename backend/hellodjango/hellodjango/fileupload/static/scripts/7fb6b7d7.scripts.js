"use strict";angular.module("rgisApp",["ngCookies","ngResource","ngSanitize","ngRoute","ui.bootstrap","lr.upload"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",resolve:{dataLoaded:["Data",function(a){return a.promise}]}}).when("/analyze",{templateUrl:"views/analyze.html",controller:"AnalyzeCtrl",resolve:{dataLoaded:["Data",function(a){return a.promise}]}}).otherwise({redirectTo:"/"})}]).factory("_",function(){return window._}).factory("d3",function(){return window.d3}).factory("L",function(){return window.L}),angular.module("rgisApp").controller("MainCtrl",["$scope","L",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("rgisApp").controller("PluginInputCtrl",["$scope","$modal","$log","$http","_","d3",function(a,b,c,d){d.get("sample_output.json").then(function(b){a.data=b.data.graph}),a.updateMap=function(a){console.log(a)},a.openPlugin=function(a,d){var e=b.open({templateUrl:"views/"+a+".html",controller:d,keyboard:!0});e.result.then(function(){c.info("Reply received!")})}}]),angular.module("rgisApp").controller("KfunctionCtrl",["$scope","$modalInstance","upload",function(a,b,c){a.execute=function(){c({url:"/api/plugin/kfunction",data:{window:a.window,points:a.points}}).then(function(a){b.close(a)},function(a){b.close(a)})},a.cancel=function(){b.close("cancelled")}}]),angular.module("rgisApp").directive("fileInput",function(){return{templateUrl:"views/fileInput.html",restrict:"A",scope:{name:"@fileInput"},link:function(a,b){var c=angular.element(b.children().children()[0]),d=angular.element(b.children().children()[1]),e=angular.element(b.children().children()[2]);d.css("display","none"),e.bind("click",function(){d.click()}),d.bind("change",function(){var a=d.val().split("\\");a=a[a.length-1],c.val(a)})}}}),angular.module("rgisApp").directive("plotArea",["d3",function(a){return{require:"^map",restrict:"A",scope:{data:"=",callback:"&"},link:function(b,c,d,e){var f=parseFloat(a.select(c[0]).style("width")),g=.7,h={top:20,right:20,bottom:30,left:50},i=f-h.left-h.right,j=g*f-h.top-h.bottom,k=a.select(c[0]).append("svg").attr("width",i+h.left+h.right).attr("height",j+h.top+h.bottom).append("g").attr("transform","translate("+h.left+","+h.top+")");b.render=function(d){f=parseFloat(a.select(c[0]).style("width")),i=f-h.left-h.right,j=g*f-h.top-h.bottom;var l=a.scale.linear().range([0,i]),m=a.scale.linear().range([j,0]),n=a.svg.axis().scale(l).orient("bottom"),o=a.svg.axis().scale(m).orient("left"),p=a.svg.line().x(function(a){return l(a.r)}).y(function(a){return m(a.obs)}),q=a.svg.line().x(function(a){return l(a.r)}).y(function(a){return m(a.hi)}),r=a.svg.line().x(function(a){return l(a.r)}).y(function(a){return m(a.lo)}),s=a.svg.area().x(function(a){return l(a.r)}).y0(function(a){return m(a.lo)}).y1(function(a){return m(a.hi)});a.select(c[0]).select("svg").remove(),k=a.select(c[0]).append("svg").attr("width",i+h.left+h.right).attr("height",j+h.top+h.bottom).append("g").attr("transform","translate("+h.left+","+h.top+")"),l.domain(a.extent(d,function(a){return a.r})),m.domain(a.extent(d,function(a){return a.obs})),k.append("g").attr("class","x axis").attr("transform","translate(0,"+j+")").call(n),k.append("g").attr("class","y axis").call(o).append("text").attr("transform","rotate(-90)").attr("y",6).attr("dy",".71em").style("text-anchor","end").text("L function"),k.append("path").datum(d).attr("class","area").attr("d",s),k.append("path").datum(d).attr("class","line bounds").attr("d",q),k.append("path").datum(d).attr("class","line bounds").attr("d",r),k.append("path").datum(d).attr("class","line").attr("d",p);var t=a.behavior.drag().on("dragstart",function(){e.disableDrag()}).on("drag",function(){var b=l.range(),c=a.event.x>b[0]?a.event.x:b[0];c=c>b[1]?b[1]:c,u.attr("x",c)}).on("dragend",function(){e.enableDrag();var c=a.select(this).attr("x"),d=l.invert(c);b.callback({val:d})}),u=k.append("rect").attr("height",j).attr("width",2).attr("class","cursor").attr("x",3).attr("y",0).call(t)},window.onresize=function(){b.$apply()},b.$watch(function(){return angular.element(window)[0].innerWidth},function(){b.data&&b.render(b.data)}),b.$watch("data",function(a){a&&b.render(a)},!0)}}}]),angular.module("rgisApp").directive("datatable",["$window",function(a){return{templateUrl:"views/datatable.html",restrict:"A",replace:!0,scope:{data:"=datatable",search:"=search"},link:function(b,c){angular.element(a).on("resize",function(){d()});var d=function(){var b=angular.element(c.children()[1]),d=a.innerHeight-b.offset().top;b.css("height",d+"px")},e=angular.element(c.children()[1]),f=a.innerHeight-e.offset().top-55;e.css("height",f+"px")}}}]),angular.module("rgisApp").controller("DataCtrl",["$scope","$http","_","$modal","$log","Data",function(a,b,c,d,e,f){a.data=f.getData().dataLayer,a.selectDataName=0,a.selectedData=a.data[a.selectDataName].data,a.$watch("selectDataName",function(b){a.data[b]&&(a.selectedData=a.data[b].data)}),a.openPlugin=function(a,b){var c=d.open({templateUrl:"views/"+a+".html",controller:b,keyboard:!0});c.result.then(function(){e.info("Reply received!")})}}]),angular.module("rgisApp").factory("Data",["$http","$q","_",function(a,b,c){var d={},e=a.get("sample_output.json").then(function(a){var b=[],e=a.data.point.features,f=c.map(e,function(a){return a.properties}),g=a.data.window.features,h=c.map(g,function(a){return a.properties});b.push({name:"Bedok DGPSZ",type:"polygon",data:h}),b.push({name:"Preschools",type:"point",data:f}),d.dataLayer=b;var i=[];i.push(a.data.point),i.push(a.data.window),d.geoJsonLayer=i});return{promise:e,getData:function(){return d}}}]),angular.module("rgisApp").controller("AnalyzeCtrl",["$scope","Data","$http",function(a,b,c){a.geojson=b.getData().geoJsonLayer,a.data=b.getData().dataLayer,c.get("sample_output.json").then(function(b){a.graph=b.data.graph})}]),angular.module("rgisApp").directive("map",["$window","L",function(a,b){return{restrict:"A",scope:{data:"=",type:"="},controller:["$scope",function(a){a.map=b.mapbox.map("map","lamkeewei.h6p10hml"),this.disableDrag=function(){console.log("drag disabled"),a.map.dragging.disable()},this.enableDrag=function(){a.map.dragging.enable()}}],link:function(c,d){var e=c.map;angular.element(a).on("resize",function(){f()});var f=function(){var b=a.innerHeight-d.offset().top;d.css("height",b+"px")};f();var g=b.geoJson(c.data.data);g.addTo(e)}}}]),angular.module("rgisApp").directive("slideTrigger",function(){return{restrict:"A",link:function(a,b){b.bind("click",function(){var a=angular.element(b.parent()[0].parentNode),c=parseInt(a.css("right"));c>=0?a.css("right","-435px"):a.css("right","0px")})}}}),angular.module("rgisApp").directive("sidebar",function(){return{restrict:"A",link:function(a,b){var c=b.css("height"),d=angular.element(b.children()[0]);d.css("height",c)}}});