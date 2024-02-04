class MakeCard extends AbstractComponent
{
  constructor(data = null)
  {
      super();
      this.addEventListener('click', this.handleClick);
      
      if(data.constructor.name === 'Action') this.data =  {...data.data};
      else this.data =  {...data};
      
      if("recommand" === this.data.type) {
        this.data.recommandId = this.data.id;
        this.data.id = self.crypto.randomUUID();
      }

      this.imageCardSize = util.randomImageCardSize();
  }

  static get observedAttributes() {return ['type']; }

  handleClick(e) {
    //e.preventDefault();
    e.composedPath().find((node)=>{
    if(node.nodeName === 'svg' || node.nodeName === 'path') return false;
    if(typeof(node.className) === 'object' || !node.className || !node.className?.match(/command/)) return false;
    
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
        this.#setGroundTitle(this.data.groundId)
    }

    if(node.className.match(/command-select-item/))
    {
        const _categoryButtons = this.querySelectorAll('.item-btn');
        _categoryButtons.forEach(button=>button.classList.remove('active'));
        node.classList.add('active');
        this.data.itemId = node.dataset.id;
        
        this.#setTitleByItem(this.data.itemId);
        this.#showItemDesc(this.data.itemId);
        this.#setItemTitle(this.data.itemId)

    }

    if(node.className.match(/command-create-card/)){

        const titleForm = this.querySelector('form.info');
        this.data.title = titleForm.title.value;

        const intervalForm = this.querySelector('form.interval');
        this.data.interval = intervalForm.interval.value;

        const actionBox = document.querySelector('action-box');
        actionBox.addActionCard(this.data);

        const recommandBox = document.querySelector('recommand-box');
        recommandBox.moveRecommandCard(this.data);
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

    
    this.#setInterval();
    



    this.#showItem(this.data.groundId)
    this.#setItemActive(this.data.itemId);
    this.#showItemDesc(this.data.itemId);
    this.#showActiveDate();
  }

  #setDatePicker()
  {
    this.data.alertDay = (this.data.alertDate)?  this.data.alertDate.split(" ")[0] : util.getDayDashFormat(new Date());
    
    const selectDay = this.querySelector('#alertDate');
    selectDay.value = this.data.alertDay;
    this.#showActiveDate();
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
        this.#showActiveDate()
    });
  }

  #setInterval()
  {
    const _interval_radio = this.querySelectorAll('input[name=interval]');
    _interval_radio.forEach(radio => {
        if(radio.value === this.data.interval)
        {
            radio.checked = true;
        }
    })
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

  #setGroundTitle(id)
  {
    this.querySelector('.grond-title').innerHTML = globalThis.config.groundMap.getGround(id).title;
  }

  #setItemTitle(id)
  {
    const _buttons = this.querySelectorAll('.item-btn');
    const itemId = (id)? id : _buttons[0].dataset.id;
    this.querySelector('.item-title').innerHTML = globalThis.config.itemMap.getItem(itemId).title;
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

  #showActiveDate()
  {
    const _date = this.querySelector('.aletDate');
    _date.innerHTML = this.data.alertDate;
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

      .carousel-item > div{padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 24px;}

      .ground-box, .item-box{display:flex; gap:12px;}
      </style>
      <section>
        <div id="carouselExample" class="carousel slide">
            <div class="carousel-inner">
                <div class="carousel-item  active">
                    <div>
                        <div style="display: flex; justify-content: flex-end;">
                            <button class="btn-close command-close-window" type="button">
                            <span class="" aria-hidden="true"></span>
                            </button>
                        </div>
                        <div>
                            <h4 class="mb-3">Title</h4>
                            <div class="col-sm-6">
                                <form class="info">
                                <input type="text" class="form-control" id="missionTitle" name="title" >
                                </form>
                            </div>
                        </div>
                        <div> 
                            <h4 class="mb-3">Ground</h4>
                            <div class="ground-box"></div>
                        </div>
                        <div>
                            <h4 class="mb-3">Item</h4>
                            <div class="item-box"></div>
                        </div>
                        <hr>
                        <div class="item-desc"></div>
                        <div style="display: flex;gap: 8px;">
                            <button style="width:100%;" type="button" data-bs-target="#carouselExample" data-bs-slide="next" class="command-move-next btn btn-primary btn-lg px-4 gap-3">Next (1/3) </button>
                        </div>
                    </div>              
                </div>
                <div class="carousel-item">
                    <div>
                        <div style="display: flex; justify-content: flex-end;">
                            <button class="btn-close command-close-window" type="button">
                            <span class="" aria-hidden="true"></span>
                            </button>
                        </div>
                        <div>
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
                        </div>
                        <div>
                        <h4 class="mb-3">반복</h4>
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
                        <div style="display: flex;gap: 8px;">
                            <button type="button" data-bs-target="#carouselExample" data-bs-slide="prev" class="command-move-prev btn btn-secondary btn-lg px-4 gap-3">Back</button>
                            <button style="width:100%;" type="button" data-bs-target="#carouselExample" data-bs-slide="next" class="command-move-next btn btn-primary btn-lg px-4 gap-3">Next (2/3) </button>
                        </div>
                    </div>    
                </div>
                <div class="carousel-item">
                    <div>
                        <div style="display: flex; justify-content: flex-end;">
                            <button class="btn-close command-close-window" type="button">
                            <span class="" aria-hidden="true"></span>
                            </button>
                        </div>
                        <h4 class="mb-3">Action Card</h4>
                        <article class="card">
                            <img class="card-img-top" src="https://picsum.photos/${this.imageCardSize[0]}/${this.imageCardSize[1]}" alt="action Character">
                            <div class="card-header px-2 pt-2">
                                <h5 class="card-title mb-0">${this.data.title}</h5>
                                <div>
                                <span class="badge bg-info grond-title"></span>
                                <span class="badge bg-success item-title"></span>
                                <span> 12,034명이 참여</span>
                                </div>
                            </div>
                            <div class="card-body px-2 pt-2">
                                <div><strong class="aletDate">${this.data.alertDate}</strong></div>
                                
                            </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item px-2 pb-4">
                                <small class="remain-time">${this.data.desc}</small><br>
                                </li>
                            </ul>
                        </article>
                        <div style="display: flex;gap: 8px;">
                            <button type="button" data-bs-target="#carouselExample" data-bs-slide="prev" class="command-move-prev btn btn-secondary btn-lg px-4 gap-3">Back</button>
                            <button type="button" style="width:100%;" class="command-create-card btn btn-primary btn-lg px-4 gap-3">Save Card</button>
                        </div>
                    </div>
                </div>
            </div>
            
            
        </div>
      </section>
      `;  
      return tempalate;
  }
}
customElements.define('make-card', MakeCard);





 


