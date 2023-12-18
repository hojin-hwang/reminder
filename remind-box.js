
class RemindBox extends HTMLElement
{
  constructor(data)
  {
      super();
      window.addEventListener("message", this.onMessage.bind(this), false);
      this.data = {...data};
  }

  static get observedAttributes() {return ['type']; }


  onMessage(event)
  {
    const window_url = window.location.hostname;
    if(event.origin.indexOf(window_url) < 0) return;
    if(event.data.msg)
    {
        switch(event.data.msg)
        {
            case "DONE_UPDATE_SCHEDULED_LIST_DATA":
                //시간대로 정렬을 한다
                const _reOrderByData = globalThis.store.scheduledList.sort(function(a,b){
                    return a.scheduledDate - b.scheduledDate;
                })
                
                //하나의 카드에 하나의 스케줄만 허용하고
                const _cardIdSet = new Set();
                const _panelDataList = [];
    
                for(let i=0; i < _reOrderByData.length; i++)
                {
                    if(!_cardIdSet.has(_reOrderByData[i].cardId)) 
                    {
                        _panelDataList.push(_reOrderByData[i]);
                        _cardIdSet.add(_reOrderByData[i].cardId);
                    }
                }

                this.innerHTML = '';
                //remind pannel 데이터 을 만들고
                _panelDataList.forEach(data=>{
                    const _cardData = globalThis.store.cardMap.get(data.cardId);
                    const remind_panel = new RemindPanel(_cardData, data);
                    this.appendChild(remind_panel)
                })
            break;
        }
    }
  }

  connectedCallback() {
      this.#render();

      //로컬에 있는 데이터를 

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
    const template = this.#getTemplate();
    if(template) this.appendChild(template.content.cloneNode(true));
    if(globalThis.store)console.log(globalThis.store.scheduledList)
  }
  

  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
        <style></style>
        <div class="remind-bxo"></div>
      `;  
      return tempalate;
  }
}
customElements.define('remind-box', RemindBox);





 


