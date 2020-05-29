(function(){
 const menuButton = document.getElementById('menu-button');
    let menuOpened = false;
    menuButton.addEventListener("click", function(e){
     let menuItems = document.querySelectorAll('nav > ul > li > a > span');
        if(!menuOpened){
             for (var i = 0; i < 3; i ++){
                 menuItems[i].classList.add('menu-item-'+i);
                 menuOpened = true;
     } 
        }
        else{
          for (var i = 0; i < 3; i ++){
                menuItems[i].classList.remove('menu-item-'+i);
              menuOpened = false;
            }    
        }
    });
    
})
();
