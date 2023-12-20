
class CheckingPanel extends HTMLElement
{
  constructor(data)
  {
      super();
      window.addEventListener("message", this.onMessage.bind(this), false);
      this.addEventListener('click', this.handleClick);
      this.data = {...data};
      this.#setData();
  }

  static get observedAttributes() {return ['type']; }

  handleClick(e) {
    //e.preventDefault();
    e.composedPath().find((node)=>{
      if(node.nodeName === 'svg' || node.nodeName === 'path') return false;
      if(typeof(node.className) === 'object' || !node.className || !node.className?.match(/command/)) return false;
      if(node.className.match(/command-skip-schedule/))
      {
        //update skip
        this.#removeCheckData()
      }
      if(node.className.match(/command-done-schedule/))
      {
        //update done
        this.#removeCheckData()
      }
    });
  }

  #removeCheckData()
  {
    //map을 지우고
    globalThis.store.checkingMap.delete(this.data.cardId);
    globalThis.store.controll.writeLocalStorage('checkingList');
    window.postMessage({msg:"DONE_UPDATE_CHECKING_LIST_DATA", data:null}, location.origin);
    //로컬스토리지를 저장한다.
  }

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
    this.data.passedTime = util.remainTimeToScheduledTime(this.data.scheduledDate, false)
    this.data.fomatedDate = util.formatDate(this.data.scheduledDate);
    this.data.title = globalThis.store.cardMap.get(this.data.cardId).title;
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
                <button type="button" class="btn btn-primary btn-sm command-done-schedule"  data-bs-dismiss="toast">Done</button>
                <button type="button" class="btn btn-secondary btn-sm command-skip-schedule" data-bs-dismiss="toast">Skip</button>
                </div>
          </div>
        </div>
      `;  
      return tempalate;
  }
}
customElements.define('checking-panel', CheckingPanel);





 


