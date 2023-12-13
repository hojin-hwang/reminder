// Data
// title
// startTime
// interval
// checkTime

class MakeCard extends HTMLElement
{
  constructor(data = null)
  {
      super();
      this.addEventListener('click', this.handleClick);
      this.data =  {...data};
      this.id = self.crypto.randomUUID();
      this.currentPage = 0;
  }

  static get observedAttributes() {return ['type']; }

  handleClick(e) {
    e.preventDefault();
    e.composedPath().find((node)=>{
    if(node.nodeName === 'svg' || node.nodeName === 'path') return false;
    if(typeof(node.className) === 'object' || !node.className || !node.className?.match(/command/)) return false;
    if(node.className.match(/command-move-prev/))
    {
        this.querySelector('.command-move-next').disabled = false;
        this.currentPage--;
        if(this.currentPage <= 0) 
        {
            this.querySelector('.command-close-window').style.display = 'block';
            node.style.display = 'none';
        }
        else
        {
            this.querySelector('.command-close-window').style.display = 'none';
            node.style.display = 'block';
        }
        
        const card_info_list = this.querySelectorAll('article.card-info');
        card_info_list.forEach((card, index)=>{
            card.style.left = `${(this.currentPage-index) * 100}vw`;
        })
    }
    if(node.className.match(/command-move-next/))
    {
        this.querySelector('.command-close-window').style.display = 'none';
        console.log(this.querySelector('.command-close-window'))
        this.querySelector('.command-move-prev').style.display = 'block';
        this.currentPage++;
 
        if(this.currentPage >= 3)  node.disabled = true;
        else node.disabled = false;
        
        const card_info_list = this.querySelectorAll('article.card-info');
        card_info_list.forEach((card, index)=>{
            card.style.left = `${(this.currentPage-index) * -100}vw`;
         })
    }
    if(node.className.match(/command-close-window/))
    {
        this.remove();
    }
    
    });
  }

  connectedCallback() {
      this.#render();
  }
      
  disconnectedCallback(){
      console.log("disconnectedCallback");
      window.removeEventListener("message", this.receiveMessage);
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
      console.log('Media Card element attributes changed.'); 
  }

  #render()
  {
    if(util.isEmptyObject(this.data)) console.log("empty data")
    const template = this.#getTemplate();
    if(template) this.appendChild(template.content.cloneNode(true)); 
  }


  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
      <style>
      make-card{position:fixed; top:0; left:0; width:100vw; height:100vh;z-index:1024; background-color:white;}
      make-card header{display: flex; justify-content: space-between;align-items: center;}
      make-card .carousel-control-prev-icon, make-card .carousel-control-next-icon {filter: invert(1) grayscale(100);}
      make-card header .command-move-prev{display:none;}
      make-card header .btn-close {}
      make-card header button{border:none; background:none;}  
      </style>
      <section>
        <header>
            <button class="btn-close command-close-window" type="button">
                <span class="" aria-hidden="true"></span>
             </button>
            <button class="command-move-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="command-move-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </header>
        <div id="carouselExample" class="carousel slide">
            <div class="carousel-inner">
                <div class="carousel-item active">
                <img src="https://picsum.photos/400" class="d-block w-100" alt="...">
                </div>
                <div class="carousel-item">
                <img src="https://picsum.photos/400" class="d-block w-100" alt="...">
                </div>
                <div class="carousel-item">
                <img src="https://picsum.photos/400" class="d-block w-100" alt="...">
                </div>
            </div>
            
            
        </div>
      </section>
      `;  
      return tempalate;
  }
}
customElements.define('make-card', MakeCard);





 


