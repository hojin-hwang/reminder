
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
                const _data = [...event.data.data];
                const _reOrderByData = _data.sort(function(a,b){
                    return a.scheduledDate - b.scheduledDate;
                 })
                
                this.innerHTML = '';
                //remind pannel 데이터 을 만들고
                _reOrderByData.forEach(data=>{
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





 


