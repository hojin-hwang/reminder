
class CheckingPanel extends HTMLElement
{
  constructor(data)
  {
      super();
      window.addEventListener("message", this.onMessage.bind(this), false);
      this.data = {...data};
      console.log(this.data)
      this.#setData();
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
            case "____":
                
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
  
  #setData()
  {
    this.data.passedTime = util.remainTimeToScheduledTime(this.data.value.scheduledDate, false)
    this.data.fomatedDate = util.formatDate(this.data.value.scheduledDate);
    this.data.title = globalThis.store.cardMap.get(this.data.key).title;
  }
  
  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
        <style></style>
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
            <svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#007aff"></rect></svg>
                <strong class="me-auto">${this.data.title}</strong>
                <small>${this.data.passedTime}이 지났습니다.</small>
            </div>
            <div class="toast-body">
                scheduled Date ${this.data.fomatedDate}
                <div class="mt-2 pt-2 border-top">
                <button type="button" class="btn btn-primary btn-sm">Done</button>
                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="toast">Skip</button>
                </div>
          </div>
        </div>
      `;  
      return tempalate;
  }
}
customElements.define('checking-panel', CheckingPanel);





 


