class ActionCard extends HTMLElement
{
  constructor(data = null)
  {
    super();
    if(data) this.data = this.#setData(data);
    this.intervalID = null;
    window.addEventListener("message", this.onMessage.bind(this), false);
  }

  static get observedAttributes(){return [];}

  onMessage(event)
  {
    const window_url = window.location.hostname;
    if(event.origin.indexOf(window_url) < 0) return;
    if(event.data.msg)
    {
        switch(event.data.msg)
        {
            case "CHECK_ALERT_DATE":
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
    return (globalThis.data.groundList.find((ground) => ground.id === data.ground))
  }

  #getItemData(data)
  {
    return (globalThis.data.itemList.find((item) => item.groundId === data.ground && item.id === data.item ))
  }

  #setData(data)
  {
    data.groundTitle = this.#getGroundData(data).title;
    data.itemTitle = this.#getItemData(data).title;
    return data;
  }

  #checkAlertDate()
  {
    clearInterval(this.intervalID);
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
    let _nextDate = new Date(this.data.alertDate).setSeconds( new Date(this.data.alertDate).getSeconds() + 120);
    
    while(_nextDate < new Date().getTime())
    {
        lastAlertTime = new Date(_nextDate); 
        _nextDate = new Date(_nextDate).setSeconds( new Date(_nextDate).getSeconds() + 120);       
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

  
  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
        <article class="action border rounded card swiper-slide">
            <img src="https://picsum.photos/100/100" style="border-radius: 50%; width:80px; height:80px;">
            <div class="action-info">
                <div class="">
                    
                </div>
                <strong>${this.data.title}</strong><br>
                
                <small class="remain-time">5분 전입니다.</small><br>
                <small class="text-muted alert-date">${this.data.alertDate}</small>
                <div>
                    <span class="badge bg-info">${this.data.groundTitle}</span>
                    <span class="badge bg-success">${this.data.itemTitle}</span>
                </div>
            </div>
        </article>
      `;  
      return tempalate;
  }
}
customElements.define("action-card", ActionCard);

