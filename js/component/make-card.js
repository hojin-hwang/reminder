// Data
// title
// alertDate (alertDay and alertTime)
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
      if("recommand" === this.data.type) this.data.id = this.id;
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
    
    if(node.className.match(/command-select-ground/))
    {
        const _categoryButtons = this.querySelectorAll('.ground-btn');
        _categoryButtons.forEach(button=>button.classList.remove('active'));
        node.classList.add('active');
        this.data.groundId = node.dataset.id;
        this.#showItem(this.data.groundId);
        this.#setItemActive();
        this.#setTitleByItem();
        this.#showItemDesc();
    }

    if(node.className.match(/command-select-item/))
    {
        const _categoryButtons = this.querySelectorAll('.item-btn');
        _categoryButtons.forEach(button=>button.classList.remove('active'));
        node.classList.add('active');
        this.data.groundId = node.dataset.groundId;
        this.data.itemId = node.dataset.id;
        
        this.#setTitleByItem(this.data.itemId);
        this.#showItemDesc(this.data.itemId);

    }

    if(node.className.match(/command-create-card/)){

        const titleForm = this.querySelector('form.info');
        this.data.title = titleForm.title.value;

        const intervalForm = this.querySelector('form.interval');
        this.data.interval = intervalForm.interval.value;

        const actionBox = document.querySelector('action-box');
        actionBox.addActionCard(this.data);
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
    
    this.#setDatePicker();
    this.#setTimePicker();
    this.#setTitle();
    this.#showGround();

    this.#setGroundActive();

    this.#showItem(this.data.groundId)
    this.#setItemActive(this.data.itemId);
    this.#showItemDesc(this.data.itemId);
  }

  #setDatePicker()
  {
    this.data.alertDay = (this.data.alertDate)?  this.data.alertDate.split(" ")[0] : util.getDayDashFormat(new Date());
    
    const selectDay = this.querySelector('#alertDate');
    selectDay.value = this.data.alertDay;
    
  }

  #setTimePicker(){

    const _hour = (this.data.alertDate)? this.#getHour() : new Date().getHours();
    const _minute = (this.data.alertDate)? this.#getMinute() : 30;
    
    this.data.alertDate = (this.data.alertDate)? this.data.alertDate : this.data.alertDay +" "+ _hour + ":" + _minute;

    const tpSpinboxWithStep = new tui.TimePicker('#missionTime', {
        initialHour: _hour,
        initialMinute: _minute,
        inputType: 'spinbox',
        showMeridiem: false,
        hourStep: 1,
        minuteStep: 10
    });

    tpSpinboxWithStep.on('change', (e) => {
        this.data.alertDate = `${this.data.alertDay} ${e.hour}:${e.minute}`;
        console.log(this.data.alertDate);
    });
  }

  #getHour()
  {
    return parseInt(this.data.alertDate.split(" ")[1].split(":")[0]);
  }

  #getMinute()
  {
    return parseInt(this.data.alertDate.split(" ")[1].split(":")[1]);
  }

  #setTitle()
  {
    const title = (this.data.title)? this.data.title: "-";
    this.querySelector('input[name=title]').value = title;
  }

  #showGround()
  {
    let card = '';
    globalThis.config.groundMap.getGroundList().forEach((value, key, map) => {
        card += `<button type="button" data-id="${value.id}" class="command-select-ground ground-btn btn btn-outline-primary btn-sm">${value.title}</button>`;
    });
    const groundBox = this.querySelector('.ground-box');
    groundBox.innerHTML = card;

  }

  #setGroundActive()
  {
    const _buttons = this.querySelectorAll('.ground-btn');
    _buttons.forEach(button => {
        if(button.dataset.id == this.data.groundId) button.classList.add('active')
    });
  }


  #showItem(groundId)
  {
    let card = '';
    const _itemList = globalThis.config.itemMap.getItemList(groundId);
    _itemList.forEach(item => {
        card += `<button type="button" data-id="${item.id}" data-ground-id="${item.groundId}" class="command-select-item item-btn btn btn-outline-success btn-sm">${item.title}</button>`;
    });
    const itemBox = this.querySelector('.item-box');
    itemBox.innerHTML = card;
  }

  #setItemActive(itemId = null)
  {
    const _buttons = this.querySelectorAll('.item-btn');
    itemId = (itemId)? itemId : _buttons[0].dataset.id;
    _buttons.forEach(button => {
        if(button.dataset.id === itemId) button.classList.add('active')
    });
  }

  #setTitleByItem(itemId = null)
  {
    const _buttons = this.querySelectorAll('.item-btn');
    itemId = (itemId)? itemId : _buttons[0].dataset.id;

    const itemTitle = this.querySelector('form.info').title;
    itemTitle.value = globalThis.config.itemMap.getItem(itemId).title;
  }

  #showItemDesc(itemId = null)
  {
    const _buttons = this.querySelectorAll('.item-btn');
    itemId = (itemId)? itemId : _buttons[0].dataset.id;

    const itemDesc = this.querySelector('.item-desc');
    itemDesc.innerHTML = globalThis.config.itemMap.getItem(itemId).desc;
    this.data.desc = itemDesc.innerText;
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

      .ground-box, .item-box{display:flex; gap:12px;}
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
                <div class="carousel-item  active">
                    <h4 class="mb-3">Title</h4>
                    <form class="info">
                    <div class="col-sm-6">
                        <label for="missionTitle" class="form-label">Title</label>
                        <input type="text" class="form-control" id="missionTitle" name="title" >
                    </div>
                    <div> 
                        <h4 class="mb-3">Ground</h4>
                        <div class="ground-box"></div>

                        <h4 class="mb-3">Item</h4>
                        <div class="item-box"></div>

                        <hr>
                        <div class="item-desc"></div>
                    </div>
                    </form>           
                </div>
                <div class="carousel-item">
                    <h4 class="mb-3">Schedule Date</h4>
                    <div class="row g-3">
                        <div class="col-sm-6">
                            <label for="alertDate" class="form-label">Date</label>
                            <input type="text" class="form-control" id="alertDate" data-rome-id="0" readonly="">
                        </div>
                        <div class="col-sm-6">
                            <label for="missionTime" class="form-label">Time</label>
                            <div id="missionTime"></div>
                        </div>
                    </div>

                    <hr class="my-4">
                    <h4 class="mb-3">Payment</h4>
                    <div class="row g-3">
                    <form class="interval">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="interval" id="1-day-interval" checked value="day">
                            <label class="form-check-label" for="1-day-interval">
                            매일
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="interval" id="7-day-interval" value="week">
                            <label class="form-check-label" for="7-day-interval">
                            매주
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="interval" id="1-month-interval" value="month">
                            <label class="form-check-label" for="1-month-interval">
                            매월
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="interval" id="1-year-interval" value="year">
                            <label class="form-check-label" for="1-year-interval">
                            매년
                            </label>
                        </div>
                    </form>    
                    </div>
                </div>
                
                <div class="carousel-item">
                    <article class="action border rounded card swiper-slide" id="a-12">
                        <img src="https://picsum.photos/100/100" style="border-radius: 50%; width:80px; height:80px;">
                        <div class="action-info">
                            <div class="">
                                
                            </div>
                            <strong>${this.data.title}</strong><br>
                            
                            <small class="remain-time">${this.data.desc}</small><br>
                            <small class="text-muted alert-date">${this.data.alertDate}</small>
                            <div>
                                <span class="badge bg-info">${this.data.groundId}</span>
                                <span class="badge bg-success">${this.data.itemId}</span>
                            </div>
                        </div>
                    </article>
                   
                    <button type="button" class="command-create-card btn btn-primary btn-lg px-4 gap-3">Save Card</button>
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





 


