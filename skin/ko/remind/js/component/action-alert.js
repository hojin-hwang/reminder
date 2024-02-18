class ActionAlert extends AbstractComponent
{
  constructor(data)
  {
    super();
    window.addEventListener("message", this.onMessage.bind(this), false);
    this.data = data
  }

  static get observedAttributes(){return [];}

  connectedCallback()
  {
    setTimeout(() => {
      this.render();
    }, 500);
  }

  render()
  {
    const template = this.#getTemplate();
    if(template) this.appendChild(template.content.cloneNode(true));
    this.#removeAlert();
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
            break;
        }
    }
  }

  #removeAlert()
  {
    setTimeout(() => {
      this.remove();
    }, 2000);
  }
   
  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
      <style>
          action-alert{position: absolute;z-index: 1024;top: 10%;left: 50%;transform: translate(-50%, -10%);width: 90vw;}
      </style>
      <div class="alert alert-primary alert-dismissible" role="alert">
        <div class="alert-message">
          <strong>${this.data}</strong>
        </div>
      </div>  
      
      `;  
      return tempalate;
  }
}
customElements.define("action-alert", ActionAlert);

