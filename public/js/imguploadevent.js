let photos = document.querySelectorAll("img");
for(let i=0;i<photos.length;i++){
    photos[i].classList.add("downloadimg")

}
// Объявление переменной и присваивание ей результат работы функции
let imageInterval = setInterval(() => {
    
// Вывод в консоли состояние свойства complete для каждой картинки
let all=true    
    for(let i=0;i<photos.length;i++){
        if(photos[i].complete==false)
            all=false
        else{
            photos[i].classList.remove("downloadimg")
        }
        console.log('image '+i+" "+photos[i].complete);
        
       
    }
    
// Создаем условие для очистки работы метода setInterval
    if (all==true) {
    // Очищаем переменную imageInterval
                     clearInterval(imageInterval);
    }
}, 50)  