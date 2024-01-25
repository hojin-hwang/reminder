class ActionCard extends HTMLElement
{
  constructor(action = null)
  {
    super();
    if(action) this.action = this.#setData(action);
    this.intervalID = null;
    window.addEventListener("message", this.onMessage.bind(this), false);
    this.addEventListener('click', this.handleClick);

    this.imageSize = util.randomImageSize();
    this.imageCardSize = util.randomImageCardSize();
  }

  static get observedAttributes(){return [];}

  handleClick(e) {
    //e.preventDefault();
    e.composedPath().find((node)=>{
      if(node.nodeName === 'svg' || node.nodeName === 'path') return false;
      if(typeof(node.className) === 'object' || !node.className || !node.className?.match(/command/)) return false;
      if(node.className.match(/command-show-action-panel/))
      {
        const actionPanel = new ActionPanel(this.data);
        document.querySelector('main').appendChild(actionPanel)
      }
    });
  }

  onMessage(event)
  {
    const window_url = window.location.hostname;
    if(event.origin.indexOf(window_url) < 0) return;
    if(event.data.msg)
    {
        switch(event.data.msg)
        {
            case "CHECKED_ALERT":
              this.innerHTML = '';
              this.render();
              //this.#checkAlertDate();
            break;
        }
    }
  }

  connectedCallback()
  {
    this.render();
    this.#checkAlertDate();
  }

  render()
  {
    const template = this.#getTemplate();
    if(template) this.appendChild(template.content.cloneNode(true));
    this.classList.add('swiper-slide');
    return;
  }

  #getGroundData(data)
  {
    return globalThis.config.groundMap.getGround(data.groundId);
  }

  #getItemData(data)
  {
    return globalThis.config.itemMap.getItem(data.itemId);
  }

  #setData(action)
  {
    this.data = action.data
    this.data.groundTitle = this.#getGroundData(this.data).title;
    this.data.itemTitle = this.#getItemData(this.data).title;
  }

  #checkAlertDate()
  {
    clearInterval(this.intervalID);

    setTimeout(() => {
      if(this.#isPassAlertDate()) 
        {
            this.#changeAlertDate();
        }
    }, 500);

    this.intervalID = setInterval(()=>{
        if(this.#isPassAlertDate()) 
        {
            this.#changeAlertDate();
        }
    }, 10000);
  }

  #isPassAlertDate()
  {
    const alertDate = new Date(this.data.alertDate);
    return (alertDate.getTime() > new Date().getTime())? false : true;
  }

  #changeAlertDate()
  {
    let lastAlertTime = new Date(this.data.alertDate);
    let _nextDate = this.#setAlertDateByInterval(this.data.alertDate, 120)

    while(_nextDate < new Date().getTime())
    {
        lastAlertTime = new Date(_nextDate); 
        _nextDate = this.#setAlertDateByInterval(_nextDate, 120)      
    }

    const _lastAlertTime = util.actionDateFormat(lastAlertTime);
    const checkMessage = {action:this.data, alertTime:_lastAlertTime};
    
    window.postMessage({msg:"CHECK_ALERT_DATE", data:checkMessage}, location.origin);
    
    this.data.alertDate = util.actionDateFormat(new Date(_nextDate));
    this.#changeNextAlertDate();
  }

  #changeNextAlertDate()
  {
    this.querySelector('.alert-date').innerText = this.data.alertDate;
  }

  #setAlertDateByInterval(dateTime, interval)
  {
    //매일, 매주, 매달, 매년 
     const _nextDate = new Date(dateTime).setSeconds( new Date(dateTime).getSeconds() + interval);
    return _nextDate; 
  }

  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
        <style>
          .nav-icon {
            color: #6c757d;
            display: block;
            font-size: 1.5rem;
            line-height: 1.4;
            padding: 0.1rem 0.8rem;
            transition: background .1s ease-in-out,color .1s ease-in-out;
          }
          .indicator {
            background: #3f80ea;
            border-radius: 50%;
            box-shadow: 0 0.1rem 0.2rem rgba(0,0,0,.05);
            color: #fff;
            display: block;
            font-size: .675rem;
            height: 18px;
            padding: 1px;
            position: absolute;
            right: -8px;
            text-align: center;
            top: 0;
            transition: top .1s ease-out;
            width: 18px;
          }
        </style>
        <article class="card swiper-slide command-show-action-panel" id="${this.data.id}">
          <img class="card-img-top" src="https://picsum.photos/${this.imageCardSize[0]}/${this.imageCardSize[1]}" alt="action Character">
          <div class="card-header px-2 pt-2">
            <h5 class="card-title mb-0">${this.data.title}</h5>
            <div>
              <span class="badge bg-info">${this.data.groundTitle}</span>
              <span class="badge bg-success">${this.data.itemTitle}</span>
              <span> 12,034명이 참여</span>
            </div>
          </div>
          <div class="card-body px-2 pt-2">
            <div>다음은 <strong class="alert-date">${this.data.alertDate}</strong>이며 <strong>20시간</strong> 남았습니다.</div>
            
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item px-2 pb-4">
              <p class="mb-2 fw-bold">현재 3단계입니다. <span class="float-end">${this.data.exp}</span></p>
              <div class="progress progress-sm">
                <div class="progress-bar" role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100" style="width: 65%;">
                </div>
              </div>
            </li>
          </ul>
        </article>
      `;  
      return tempalate;
  }
}
customElements.define("action-card", ActionCard);

