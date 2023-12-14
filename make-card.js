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
    //e.preventDefault();
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
      make-card{position:fixed; top:0; left:0; right:0; height:100vh;z-index:100; background-color:white;}
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
                    <h4 class="mb-3">Schedule Date</h4>
                    <div class="row g-3">
                        <div class="col-sm-6">
                            <label for="missionDate" class="form-label">Date</label>
                            <input type="text" class="form-control" id="missionDate" data-rome-id="0" readonly="">
                        </div>
                        <div class="col-sm-6">
                            <label for="missionTime" class="form-label">Time</label>
                            <input type="text" readonly class="form-control" id="missionTime" placeholder="" value="" required="">
                            <div class="invalid-feedback">
                                Valid last name is required.
                            </div>
                        </div>
                    </div>

                    <hr class="my-4">
                    <h4 class="mb-3">Payment</h4>
                    <div class="row g-3">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
                            <label class="form-check-label" for="flexRadioDefault1">
                            Default radio
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked>
                            <label class="form-check-label" for="flexRadioDefault2">
                            Default checked radio
                            </label>
                        </div>
                    </div>
                </div>
                <div class="carousel-item">
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





 


