class AbstractComponent extends HTMLElement
{
  constructor(data)
  {
    super();
    this.message_prefix = util.secureRandom();
    this.classList.add('action-bear-component');
    this.addEventListener('click', this.absHandleClick);
  }


  absHandleClick(e)
  {
     e.preventDefault();
     const node = e.target;
     if(node.nodeName === 'A')
     {
        e.stopPropagation();
     }
     return;
  }

  static get observedAttributes(){return [];} 

  attributeChangedCallback(name, oldValue, newValue)
  {
    this[name] = newValue;
  }

  connectedCallback()
  {
    
  }

  disconnectedCallback()
  {
    window.removeEventListener("message", this.receiveMessage)
  }

  sendPostMessage(message)
  {
    window.postMessage(message, location.href);
  }

  
}
