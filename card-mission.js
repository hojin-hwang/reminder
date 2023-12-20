
class CardMission extends HTMLElement
{
  constructor(data)
  {
      super();
      this.addEventListener('click', this.handleClick);
      window.addEventListener("message", this.onMessage.bind(this), false);
      this.data = {...data};
  }

  static get observedAttributes() {return ['type']; }

  handleClick(e) {
      e.composedPath().find((node) => 
      {
          if (!node.className || !node.className.match(/command/)) return false;
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
            case "_____":
            break;
        }
    }
  }

  connectedCallback() {
      this.#render();
  }
      
  disconnectedCallback(){
      console.log("disconnectedCallback");
      window.removeEventListener("message", this.onMessage);
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
      console.log('Media Card element attributes changed.'); 
  }

  #render()
  {
    this.intervalComment = util.intervalComment(this.data.interval);
    if(this.intervalComment === '0')
    {
        this.intervalComment = '반복이 없습니다.'
    }
    else
    {
        this.intervalComment = `매 ${this.intervalComment} 마다 반복됩니다.`;
    }
    
    // this.categoryName = this.#getCategoryName();
    this.#getNextRemainTime();
    const template = this.#getTemplate();
    if(template) this.appendChild(template.content.cloneNode(true)); 
  }

  #getNextRemainTime()
  {
    if(globalThis.store.scheduledList.length === 0) return null;

    //현재 가장 가까운 Scheduled Time을 확보하고
    const _scheduledListForCard = globalThis.store.scheduledList.filter( element => element.cardId === this.data.id)
    const _scheduledListForCardOrder = _scheduledListForCard.sort(function(a, b) {
        return a.scheduledDate - b.scheduledDate;
      });
    
    this.nextRemainTime = "";
    if(_scheduledListForCardOrder && _scheduledListForCardOrder.length > 0)  
    {
        this.nextRemainTime = util.remainTimeToScheduledTime(_scheduledListForCardOrder[0].scheduledDate)
    }
  }


  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
        <style>
        </style>
        <div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
                <div class="col-md-4" style="background-size: cover;
                background-position: center; height: 260px; background-image: url('https://picsum.photos/600');" class="img-fluid rounded-bottom">
                
                </div>
                <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${this.data.title}</h5>
                    <p class="card-text">
                    시작일은 ${this.data.startDate} 입니다. <br>
                    ${this.intervalComment}
                    </p>
                    <p class="card-text"><small class="text-body-secondary">다음 알람시간까지 ${this.nextRemainTime} 남았습니다.</small></p>
                    <button class="btn btn-success rounded-pill px-3 btn-sm" type="button">${this.data.category}</button>
                    <button class="btn btn-primary" type="button">자세히 보기</button>
                </div>
                </div>
            </div>
        </div>
      `;  
      return tempalate;
  }
}
customElements.define('card-mission', CardMission);





 


