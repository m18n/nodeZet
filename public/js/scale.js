var bol=false;


$( "#photoscale" ).click(function() {
    width=screen.width;
    console.log(width);
    if(width<=656){
        if(bol==false)
            $( "#glimg" ).css( "transform","scale(1.3)" );
        else
            $( "#glimg" ).css( "transform","scale(1)" );
        bol=!bol;
    }
});
