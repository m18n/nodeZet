

priceproc();
function priceproc(){
	
	var price=0;
	price=parseInt($(".startprice").val());
	$(".form option:selected").each(function()
	{
		
		var temp=$(this).val();
		var arr=temp.split("/");
		console.log(temp);
		console.log("Price "+arr[1]);
		price+=parseInt(arr[1]);
	    // Add $(this).val() to your list
	});
	$(".pricexam").text(price+"$");
}
$( ".self" ).change(function() {
	priceproc();
});
