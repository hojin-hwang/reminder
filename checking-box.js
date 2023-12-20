
class CheckingBox extends HTMLElement
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
            case "DONE_UPDATE_CHECKING_LIST_DATA":
                
                //array로 변경한 후
                // const beforeOrderList = Array.from(globalThis.store.checkingMap, function (entry) {
                //     return { key: entry[0], value: entry[1] };
                // });

                // //Sorting 한다음
                // const _reOrderByData = beforeOrderList.sort(function(a,b){
                //     return a.value.checkingDate - b.value.checkingDate;
                // })

                const beforeOrderList = [];
                for (const [name, value] of globalThis.store.checkingMap) {
                    beforeOrderList.push(value);
                }

                //Sorting 한다음
                const _reOrderByData = beforeOrderList.sort(function(a,b){
                    return a.checkingDate - b.checkingDate;
                })

                //현재 시간보다 지났다면 만들어서 넣는다
                this.innerHTML = '';
                _reOrderByData.forEach(data => {
                    if(!util.isFutureDate(data.checkingDate))
                    {
                        const _panel = new CheckingPanel(data);
                        this.appendChild(_panel);
                    }
                    
                });
                return;
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
        <div class="checking-box"></div>
      `;  
      return tempalate;
  }
}
customElements.define('checking-box', CheckingBox);





 


