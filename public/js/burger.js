
$(".burger").click(function() {
    $(".header-phone").css("display","flex");
    $(".header-phone").toggleClass('animend animstart');

}); 
$(".cross").click(function(){

    $(".header-phone").toggleClass('animstart animend');
});