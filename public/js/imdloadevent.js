// function setBlockHWTL(block1,block2){
//     $(block1).css({"left":block2.x+"px","top":block2.y+"px","width":block2.width+"px","height":block2.height+"px"})
// }
let imgs = document.querySelectorAll("img")
let loader = document.getElementById("loaderdiv")
for (let i = 0; i < imgs.length; i++) {
    let clone = loader.cloneNode(true)
    let parent = imgs[i].parentNode;
    clone.appendChild(imgs[i])
    parent.appendChild(clone)

}
// Объявление переменной и присваивание ей результат работы функции
let imageInterval = setInterval(() => {
    // Вывод в консоли состояние свойства complete для каждой картинки
    let gotov=true;
    for (let i = 0; i < imgs.length; i++) {
        if (imgs[i].complete == false)
            gotov = false;
        else{
            if(imgs[i].parentNode.classList.contains("loaderdiv"))
            {
                
                let loader=imgs[i].parentNode
                loader.parentNode.appendChild(imgs[i])
                loader.remove();
                
            }
            console.log("LOAD")
        }
    }
    // Создаем условие для очистки работы метода setInterval
    if (gotov==true) {
        // Очищаем переменную imageInterval
        clearInterval(imageInterval);
    }
    
}, 50)
// let loadrs=document.getElementById("loaders")
// let start=document.getElementById("startloader")
// for(let i=0;i<imgs.length;i++){
//     let element=start.cloneNode(true);
//     setBlockHWTL(element,imgs[i])
//     loadrs.appendChild(element)

// }
// start.remove()
// let loader=document.getElementsByClassName("loader")
// console.log(imgs[5].x);
// console.log(imgs[5].y);
// console.log(imgs[5])

// console.log($(imgs[5]).css("display"))