class CheckBox extends HTMLElement
{
  constructor()
  {
    super();
    window.addEventListener("message", this.onMessage.bind(this), false);
  }

  static get observedAttributes(){return [];}

  connectedCallback()
  {
    this.render();
    
  }

  render()
  {
    const template = this.#getTemplate();
    if(template) this.appendChild(template.content.cloneNode(true));
    //if(this.list.length === 0) console.log("make new action")
    //else this.showAction();
    return;
  }

  onMessage(event)
  {
    const window_url = window.location.hostname;
    if(event.origin.indexOf(window_url) < 0) return;
    if(event.data.msg)
    {
        switch(event.data.msg)
        {
            case "CHECK_ALERT_DATE":
              this.#appendCheckCard(event.data.data);
            break;
        }
    }
  }

  #appendCheckCard(data)
  {
    if(this.#isNotChecked(data.action.id, data.alertTime))
    {
      //create check-card
      //append check-card
      //update checkedList data
      console.log(data)

    }
  }

  #isNotChecked(actionId, lastAlertDate)
  {
    if(!globalThis.data.checkedList) return true;
    const checkedAction = globalThis.data.checkedList.find(element => element.actionId === actionId && element.alertDate === lastAlertDate);
    return (checkedAction)? false:true;
  }
  
  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
      <label>Check</label>
      <section class="check-box">
        
        
      </section>   
      `;  
      return tempalate;
  }
}
customElements.define("check-box", CheckBox);

