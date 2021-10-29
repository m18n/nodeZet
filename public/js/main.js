var imge=document.getElementById("glimg");
var imgst=document.getElementsByClassName("imgphoto")[0];
imgst.style.border="solid 1px green";

function image(img) {
    var src = img.src;
    if(imgst!=null)
    	imgst.style.border='none';
    img.style.border='solid 1px green';
    imge.src=src;
    imgst=img;
}
