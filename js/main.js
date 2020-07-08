let portfolioDOMLi = null;
  
const $ = selector => {
  return document.querySelector(selector);
};

const $all = selector => {
  return document.querySelectorAll(selector);
}

(function(){
  const myFullpage = new fullpage('#fullpage', {
    anchors: ['home', 'o-mnie', 'portfolio', 'kontakt'],
    lazyLoad: true
});
 const menuButton = $('#menu-button');
    let menuOpened = false;
    menuButton.addEventListener("click", function(e) {
     let menuItems = $all('nav > ul > li > a > span');
        if(!menuOpened){
          for (var i = 0; i < 3; i ++) {
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
const options = {
  method: "post",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    query: 
      `{projects {
        id
        siteUrl
        githubUrl
        title
        image {
          url
        }
      }}`
  })
};
let portfolioItems = null;
fetch(`https://api-eu-central-1.graphcms.com/v2/ckca7ovz30a0201wdcrmt8b53/master`, options)
  .then(res => res.json())
  .then(res => {
    $('.loader-tile').style.display = "none";
    renderPortfolioItems(res);
  });

const renderPortfolioItems = ({ data }) => {
  const portfolioItems = data;
  createCarouselItems(portfolioItems);
}

let carouselItemsCount = null;
let numberOfElWithActClass = 0;

const createCarouselItems = (data) => {
  if(data.projects != undefined) carouselItemsCount = data.projects.length;

  if(carouselItemsCount == null || carouselItemsCount == 0) {
    let noItemsText = document.createElement('h2');
    noItemsText.innerText = 'No projects to show!'
    $(".portfolio-list").appendChild(noItemsText);
    $(".portfolio-list").style.padding = 0;
  } 
  else {
    numberOfElWithActClass = 0;
    data.projects.forEach((element, index) => {
      let newLi = document.createElement('li');
      newLi.innerHTML = `
        <img src="${element.image.url}" class="portfolio-image"></img>
        <h4 class="text-white portfolio-title">${element.title}</h4>
        <a href="${element.siteUrl}" class="portfolio-link">
          <img src="img/link_icon.png" class="portfolio-icon"></img>
        </a>
        <a href="${element.githubUrl}" class="portfolio-link">
          <img src="img/github_icon.png" class="portfolio-icon"></img>
        </a>

      `;
      
      index === 0 ? newLi.classList.add("act") : null;
      index === 1 ? newLi.classList.add("next") : null;
      index === 2 ? newLi.classList.add("new-next") : null;
      index > 2 ? newLi.classList.add("hide") : null;
      $(".portfolio-list").appendChild(newLi);
    });
    portfolioDOMLi = $all(".portfolio-list > li");
  }
}

function next() {
  console.log(numberOfElWithActClass);
  if(numberOfElWithActClass < carouselItemsCount-1) {
    portfolioDOMLi[numberOfElWithActClass].classList.remove("act");
    portfolioDOMLi[numberOfElWithActClass].classList.add("prev");
    portfolioDOMLi[numberOfElWithActClass+1].classList.remove("next");
    portfolioDOMLi[numberOfElWithActClass+1].classList.add("act");
    
    if(portfolioDOMLi[numberOfElWithActClass+2]) {
      portfolioDOMLi[numberOfElWithActClass+2].classList.remove(...portfolioDOMLi[numberOfElWithActClass+2].classList);
      portfolioDOMLi[numberOfElWithActClass+2].classList.add("next");
    }

    if(portfolioDOMLi[numberOfElWithActClass-1]) {
      portfolioDOMLi[numberOfElWithActClass-1].classList.remove(...portfolioDOMLi[numberOfElWithActClass-1].classList);
      portfolioDOMLi[numberOfElWithActClass-1].classList.add("hide");
    }

    numberOfElWithActClass++;
  }
}

function prev() {
  if(numberOfElWithActClass > 0) {
    portfolioDOMLi[numberOfElWithActClass].classList.remove("act");
    portfolioDOMLi[numberOfElWithActClass].classList.add("next");
    portfolioDOMLi[numberOfElWithActClass-1].classList.remove("prev");
    portfolioDOMLi[numberOfElWithActClass-1].classList.add("act");
    
    if(portfolioDOMLi[numberOfElWithActClass-2]) {
      portfolioDOMLi[numberOfElWithActClass-2].classList.remove(...portfolioDOMLi[numberOfElWithActClass-2].classList);
      portfolioDOMLi[numberOfElWithActClass-2].classList.add("prev");
    }
    
    if(portfolioDOMLi[numberOfElWithActClass+1]) {
      portfolioDOMLi[numberOfElWithActClass+1].classList.remove(...portfolioDOMLi[numberOfElWithActClass+1].classList);
      portfolioDOMLi[numberOfElWithActClass+1].classList.add("hide");
    }

    numberOfElWithActClass--;
  }
}

// slide = element => {
//   console.log(slider);
//   if (element.classList.contains('next')) {
//     next();    
//   } else if (element.classList.contains('prev')) {
//     prev();
//   }
// }

const slider = $(".portfolio-list"),
    swipe = new Hammer($(".swipe"));

// slider.onclick = event => slide(event.target);

swipe.on("swipeleft", (ev) => {
    next();
});

swipe.on("swiperight", (ev) => {
  prev();
});
