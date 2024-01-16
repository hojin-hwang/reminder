class CheckCard extends HTMLElement
{
  constructor(data)
  {
    super();
    this.addEventListener('click', this.handleClick);
    window.addEventListener("message", this.onMessage.bind(this), false);
    this.data = {...data};
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

  handleClick(e) {
    //e.preventDefault();
    e.composedPath().find((node)=>{
      if(node.nodeName === 'svg' || node.nodeName === 'path') return false;
      if(typeof(node.className) === 'object' || !node.className || !node.className?.match(/command/)) return false;
      if(node.className.match(/command-done-action/))
      {
        this.#updateCheckedDate();
        this.remove()
      }
      if(node.className.match(/command-pass-action/))
      {
        this.#updateCheckedDate();
        this.remove();
      }
    });
  }

  #updateCheckedDate()
  {
    if(globalThis.data.checkedMap.has(this.data.actionId))
    {
      globalThis.data.checkedMap.get(this.data.actionId).alertDate = this.data.alertDate;
    }
    else
    {
      const newCheckData = {"actionId":this.data.actionId,"alertDate":this.data.alertDate};
      globalThis.data.checkedMap.set(this.data.actionId, newCheckData)
    }
  }
 
  getActionId()
  {
    return this.data.actionId;
  }

  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
      <article class="card rounded border check ">
        <div>
          ${util.secureRandom()} <strong>역사 연대표 공부</strong>를 수행하셨나요? 그 결과를 알려주세요 ${this.data.alertDate}
        </div>
        <div>
          <button type="button" class="btn btn-primary command-done-action">수행했어요</button>
          <button type="button" class="btn btn-secondary command-pass-action">다음에 할게요</button>
          <img src="https://picsum.photos/60/60" style="border-radius: 50%; width:40px; height:40px; float: right!important;">
        </div>
      </article>
      `;  
      return tempalate;
  }
}
customElements.define("check-card", CheckCard);

