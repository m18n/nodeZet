$(window).scroll(function(event){
    if($(this).scrollTop()==0){
        $(".header-nav").removeAttr("style");
        console.log("))");
    }else{
        $(".header-nav").css({"position":"fixed"
                        ,"margin-top":"0px"
                    ,"border-bottom":"solid 2px #cfcfcf"
                    ,"padding":"0px 20px"});
    }
    
});
