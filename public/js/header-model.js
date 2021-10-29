$(window).scroll(function(event){
    if($(this).scrollTop()==0){
        $(".header-nav-all").removeAttr("style");
        $(".pid").css("display","none");
        console.log("))");
    }else{
        $(".pid").css("display","flex");
        $(".header-nav-all").css({"position":"fixed",
                                "border-bottom":"solid 2px #cfcfcf"});
       
    }
    
});
