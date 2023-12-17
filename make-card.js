// Data
// title
// startDate
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
      this.data.startTime = '11:40';
      this.data.category = 'play';
     
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
    
    if(node.className.match(/command-select-category/))
    {
        const _categoryButtons = this.querySelectorAll('.category-btn');
        _categoryButtons.forEach(button=>button.classList.remove('active'));
        node.classList.add('active');
        this.data.category = node.dataset.category;
    }

    if(node.className.match(/command-create-card/)){
        this.data.startDate = this.querySelector('#startDate').value;
        const _cardDate = `${this.data.startDate} ${this.data.startTime}`;

        const _card = {};
        _card.id = this.id;
        _card.title = this.querySelector('form.info').title.value;
        _card.category = this.data.category;
        _card.startDate = _cardDate ;
        _card.interval = this.querySelector('form').interval.value;
        _card.checktime = this.querySelector('form.check-form').checktime.value;
        _card.url = '';
        _card.memo = '';
        _card.checkingId = '';
        
        const result = this.#setIntervalData(_cardDate, _card.interval, _card.checktime);

        window.postMessage({msg:"REQUEST_NEW_CARD_DATA", data:_card}, location.origin);
        window.postMessage({msg:"REQUEST_NEW_SCHEDULED_LIST_DATA", data:result.scheduledDataArray}, location.origin);
        window.postMessage({msg:"REQUEST_NEW_CHACKING_DATA", data:result.checkingDate}, location.origin);
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
    this.#setCategory();
  }

  #setDatePicker()
  {
    const _day = (this.data.startDate)?  this.data.startDate : util.getDayDashFormat(new Date());
    this.querySelector('#startDate').value = _day;
    rome(startDate, { time: false });
  }

  #setTimePicker(){

    const _hour = (this.data.startTime)? this.#getHour() : new Date().getHours();
    const _minute = (this.data.startTime)? this.#getMinute() : 30;

    const tpSpinboxWithStep = new tui.TimePicker('#missionTime', {
        initialHour: _hour,
        initialMinute: _minute,
        inputType: 'spinbox',
        showMeridiem: false,
        hourStep: 1,
        minuteStep: 10
    });

    tpSpinboxWithStep.on('change', (e) => {
        this.data.startTime = `${e.hour}:${e.minute}`;
      });
  }

  #getHour()
  {
    return parseInt(this.data.startTime.split(":")[0]);
  }

  #getMinute()
  {
    return parseInt(this.data.startTime.split(":")[1]);
  }

  #setTitle()
  {
    const title = (this.data.title)? this.data.title: "-";
    this.querySelector('input[name=title]').value = title;
  }

  #setCategory()
  {
    const _category = (this.data.category)? this.data.category : 'default';
    const _categoryButtons = this.querySelectorAll('.category-btn');
    _categoryButtons.forEach(button => {if(button.dataset.category === _category) button.classList.add('active') });
  }

  #setIntervalData(date, interval, checktime)
  {
    const _key = interval.split("-")[1];
    const _value = interval.split("-")[0];
    let _intervalDateSet = null;
    switch(_key)
    {
        case 'hour':
            _intervalDateSet = this.#getIntervalDateByHour(date, _value, checktime);
        break;
        case 'day':
            _intervalDateSet = this.#getIntervalDateByDay(date, _value, checktime);
        break;
        case 'month':
            _intervalDateSet = this.#getIntervalDateByMonth(date, _value, checktime);
        break;
        case 'year':
            _intervalDateSet = this.#getIntervalDateByYear(date, _value, checktime);
        break;
        default:
            _intervalDateSet = this.#getIntervalDateByHour(date, _value, checktime);
        break;
    }

    const _scheduledPanelData = this.#makePanelData(_intervalDateSet.scheduledDataArray);
    const _waitingPanelData = this.#makeCheckingData(_intervalDateSet.waitingDataArray);

    return {scheduledDataArray:_scheduledPanelData, checkingDate : _waitingPanelData};
  }

  

  #getIntervalDateByHour(preDate, interval, checktime)
  {
    const intervalDateSet = {};
    const _waitingDataArray = [];
    const _scheduledDataArray = [];
    let countOfSchedule = 10;
    if(parseInt(interval) === 0)
    {
        const _checkingDate = new Date(preDate).setSeconds( new Date(preDate).getSeconds() + parseInt(checktime))
        if(util.isFutureDate(preDate)) _scheduledDataArray.push({scheduledDate:new Date(preDate), checkingDate:_checkingDate});
        else _waitingDataArray.push({scheduledDate:new Date(preDate), checkingDate:_checkingDate});

        intervalDateSet.waitingDataArray = _waitingDataArray;
        intervalDateSet.scheduledDataArray = _scheduledDataArray;
        return intervalDateSet;
    }

    for(let i=0; i< countOfSchedule; i++)
    {
        const _preDate = new Date(preDate);
        const _nextDate = _preDate.setHours( _preDate.getHours() + i * parseInt(interval));
        const __nextDate = new Date(_nextDate);
        const _checkingDate = __nextDate.setSeconds( __nextDate.getSeconds() + parseInt(checktime))

        if(util.isFutureDate(_nextDate)) _scheduledDataArray.push({scheduledDate:_nextDate, checkingDate:_checkingDate});
        else 
        {
            _waitingDataArray.push({scheduledDate:_nextDate, checkingDate:_checkingDate});
            countOfSchedule++;
        }
    }

    intervalDateSet.waitingDataArray = _waitingDataArray;
    intervalDateSet.scheduledDataArray = _scheduledDataArray;
    return intervalDateSet;
  }

  #getIntervalDateByDay(preDate, interval, checktime)
  {
    const intervalDateSet = {};
    const _waitingDataArray = [];
    const _scheduledDataArray = [];

    for(let i=0; i<10; i++)
    {
        const _preDate = new Date(preDate);
        const _nextDate = _preDate.setDate( _preDate.getDate() +  i * parseInt(interval));
        const __nextDate = new Date(_nextDate);
        const _checkingDate = __nextDate.setSeconds( __nextDate.getSeconds() + parseInt(checktime))

        if(util.isFutureDate(_nextDate)) _scheduledDataArray.push({scheduledDate:_nextDate, checkingDate:_checkingDate});
        else _waitingDataArray.push({scheduledDate:_nextDate, checkingDate:_checkingDate});
    }
    intervalDateSet.waitingDataArray = _waitingDataArray;
    intervalDateSet.scheduledDataArray = _scheduledDataArray;
    return intervalDateSet;
  }

  #getIntervalDateByMonth(preDate, interval, checktime)
  {
    const intervalDateSet = {};
    const _waitingDataArray = [];
    const _scheduledDataArray = [];

    for(let i=0; i<10; i++)
    {
        const _preDate = new Date(preDate);
        const _nextDate = _preDate.setMonth( _preDate.getMonth() +  i * parseInt(interval));
        const __nextDate = new Date(_nextDate);
        const _checkingDate = __nextDate.setSeconds( __nextDate.getSeconds() + parseInt(checktime))

        if(util.isFutureDate(_nextDate)) _scheduledDataArray.push({scheduledDate:_nextDate, checkingDate:_checkingDate});
        else _waitingDataArray.push({scheduledDate:_nextDate, checkingDate:_checkingDate});
    }
    intervalDateSet.waitingDataArray = _waitingDataArray;
    intervalDateSet.scheduledDataArray = _scheduledDataArray;
    return intervalDateSet;
  }

  #getIntervalDateByYear(preDate, interval, checktime)
  {
    const intervalDateSet = {};
    const _waitingDataArray = [];
    const _scheduledDataArray = [];

    for(let i=0; i<10; i++)
    {
        const _preDate = new Date(preDate);
        const _nextDate = _preDate.setFullYear( _preDate.getFullYear() +  i * parseInt(interval));
        const __nextDate = new Date(_nextDate);
        const _checkingDate = __nextDate.setSeconds( __nextDate.getSeconds() + parseInt(checktime))

        if(util.isFutureDate(_nextDate)) _scheduledDataArray.push({scheduledDate:_nextDate, checkingDate:_checkingDate});
        else _waitingDataArray.push({scheduledDate:_nextDate, checkingDate:_checkingDate});
    }
    intervalDateSet.waitingDataArray = _waitingDataArray;
    intervalDateSet.scheduledDataArray = _scheduledDataArray;
    return intervalDateSet;
  }

  #makePanelData(intervalDataArray)
  {
    const panelDataArray = [];
    intervalDataArray.forEach(data=>{
        const _data = {};
        _data.cardId = this.id;
        _data.id = self.crypto.randomUUID();
        _data.scheduledDate = data.scheduledDate;
        _data.checkingDate =  data.checkingDate;
        panelDataArray.push(_data);
    })
    return panelDataArray;
  }

  #makeCheckingData(intervalDataArray)
  {
    if(intervalDataArray && intervalDataArray.length > 0)
    {
        const length = intervalDataArray.length -1;
        const _data = {};
        _data.cardId = this.id;
        _data.id = self.crypto.randomUUID();
        _data.scheduledDate = intervalDataArray[length].scheduledDate;
        _data.checkingDate =  intervalDataArray[length].checkingDate;
        return  _data;
    }
    else return null;
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
                            <label for="startDate" class="form-label">Date</label>
                            <input type="text" class="form-control" id="startDate" data-rome-id="0" readonly="">
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
                            <input class="form-check-input" type="radio" name="interval" id="0-hour-interval" value="0-hour">
                            <label class="form-check-label" for="0-hour-interval">
                            반복없음
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="interval" id="1-hour-interval" value="1-hour">
                            <label class="form-check-label" for="1-hour-interval">
                            1시간
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="interval" id="3-hour-interval" value="3-hour">
                            <label class="form-check-label" for="3-hour-interval" >
                            3시간
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="interval" id="6-hour-interval" value="6-hour">
                            <label class="form-check-label" for="6-hour-interval">
                            6시간
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="interval" id="12-hour-interval" value="12-hour">
                            <label class="form-check-label" for="12-hour-interval">
                            12시간
                            </label>
                        </div>
                        <hr>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="interval" id="1-day-interval" checked value="1-day">
                            <label class="form-check-label" for="1-day-interval">
                            매일
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="interval" id="7-day-interval" value="7-day">
                            <label class="form-check-label" for="7-day-interval">
                            매주
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="interval" id="1-month-interval" value="1-month">
                            <label class="form-check-label" for="1-month-interval">
                            매월
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="interval" id="1-year-interval" value="1-year">
                            <label class="form-check-label" for="1-year-interval">
                            매년
                            </label>
                        </div>
                    </form>    
                    </div>
                </div>
                <div class="carousel-item">
                    <h4 class="mb-3">Title</h4>
                    <form class="info">
                    <div class="col-sm-6">
                        <label for="missionTitle" class="form-label">Title</label>
                        <input type="text" class="form-control" id="missionTitle" name="title" >
                    </div>
                    <div> 
                        <h4 class="mb-3">Category</h4>

                        <button type="button" data-category="default" class="command-select-category category-btn btn btn-outline-primary btn-sm">일단하자</button>
                        <button type="button" data-category="gym" class="command-select-category category-btn btn btn-outline-primary btn-sm">운동</button>
                        <button type="button" data-category="study" class="command-select-category category-btn btn btn-outline-primary btn-sm">공부</button>
                        <button type="button" data-category="play" class="command-select-category category-btn btn btn-outline-primary btn-sm">음악</button>
                        <button type="button" data-category="reading" class="command-select-category category-btn btn btn-outline-primary btn-sm">독서</button>
                        <button type="button" data-category="draw" class="command-select-category category-btn btn btn-outline-primary btn-sm">그림</button>
                    </div>
                    </form>           
                </div>
                <div class="carousel-item">
                    <div class="d-flex flex-column align-items-stretch flex-shrink-0 bg-body-tertiary" style="width: 380px;">
                        <div class="border-bottom">
                            <span class="fs-5 fw-semibold">Memo</span>
                        </div>    
                        <div class="list-group list-group-flush border-bottom scrollarea" style="max-height: 400px;
                        overflow-y: auto;">
                            <a href="#" class="list-group-item list-group-item-action py-3 lh-sm" aria-current="true">
                                <div class=" mb-1 small d-flex w-100 align-items-center justify-content-between">
                                    <span>2023.12.12 12:22</span>
                                    <small>Wed</small>
                                </div>
                                <div class="d-flex w-100 align-items-center justify-content-between">
                                    <span class="mb-1">List group item heading</span>
                                </div>
                            </a>
                            <a href="#" class="list-group-item list-group-item-action py-3 lh-sm" aria-current="true">
                                <div class=" mb-1 small d-flex w-100 align-items-center justify-content-between">
                                    <span>2023.12.12 12:22</span>
                                    <button type="button" class="btn-close" aria-label="Close"></button>
                                </div>
                                <div class="d-flex w-100 align-items-center justify-content-between">
                                    <span class="mb-1">List group item heading</span>
                                </div>
                            </a>
                    </div>
                    <form class="check-form">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="checktime" id="check-now" value="5">
                            <label class="form-check-label" for="check-now">동시에</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="checktime" id="check-10-minute" value="600" checked>
                            <label class="form-check-label" for="check-10-minute">10분후에</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="checktime" id="check-30-minute" value="1800">
                            <label class="form-check-label" for="check-30-minute">30분 후에</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="checktime" id="check-1-hour" value="3600">
                            <label class="form-check-label" for="check-1-hour">1시간 후에</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="checktime" id="check-2-hour" value="7200">
                            <label class="form-check-label" for="check-2-hour">2시간 후에</label>
                        </div>
                    </form>
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





 


