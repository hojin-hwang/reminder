// Data
// cardId
// title , issueTime, RemainingTime, interval, checkTime, checked(boolean)
// sailData(Object), 
// type(history, recommand, default) 
// style (Object: backgroundColor, backGroundImage)
// orderTime (no checked issueTime, checked checkTime)

class RemindPanel extends HTMLElement
{
  constructor(cardData, data = null)
  {
      super();
      this.addEventListener('click', this.handleClick);
      this.cardData =  {...cardData};
      this.data =  {...data};
      console.log(this.cardData);
      console.log(this.data)
      this.id = self.crypto.randomUUID();
  }

  static get observedAttributes() {return ['type']; }

  handleClick(e) {
      e.composedPath().find((node) => 
      {
          if (!node.className || !node.className.match(/command/)) return false;
      });
  }


  connectedCallback() {
      this.#render();
  }
      
  disconnectedCallback(){
      console.log("disconnectedCallback");
      window.removeEventListener("message", this.receiveMessage);
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
      console.log('Media Card element attributes changed.'); 
  }

  #render()
  {
    if(util.isEmptyObject(this.data)) console.log("empty data")
    this.#setData();
    const template = this.#getTemplate();
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(template.content.cloneNode(true)); 
  }

  #setData()
  {
     this.data.title = "여긴 제목이 들어가고 1줄까지...";
  }

  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
      <style>
        panel{
        display:block; padding:12px 8px; padding-bottom: 8px; border: 1px solid #eee;
        max-width:85vw;
        }
        article.fish{display: flex; position: relative;}
        .fish > .head{min-width: 64px; padding-right: 12px;}
        .fish > .head > img {max-width: 64px;border-radius: 15%;}
        .fish > .body{width:100%; font-size: 14px;display: flex;flex-direction: column; justify-content: space-around;gap: 8px;}
        .fish > .body > .belly{display: flex;justify-content: space-between;align-items: center;}
        .fish > .body > .belly > .front {display: flex; flex-direction: column;}
        .fish > .body > .belly > .tail {color:#475569;}
        .fish > .sail{position: absolute; top:-25px; right: -30px;font-size: 12px;background-color: blueviolet;color: white;padding: 6px;border-radius: 12px;}
       </style>
       <panel class="">
       <article class="fish">
            <div class="head">
                <img src="https://picsum.photos/200">
            </div>
            <div class="body">
                <div class="fin">
                    <span>${this.cardData.title}</span>
                </div>
                <div class="belly">
                    <div class="front">
                        <span>${util.formatDate(this.data.scheduledDate)}</span>
                        <span>${util.remainTimeToScheduledTime(this.data.scheduledDate)} 남았어요</span>
                    </div>

                    <div class="tail">
                        <span>${util.intervalComment(this.cardData.interval)} 마다</span>
                    </div>
                </div>
            </div>
            <!-- <div class="sail">
            //     <span>핫해요</span>
            // </div>-->
        </article>
        </panel>
      `;  
      return tempalate;
  }
}
customElements.define('remind-panel', RemindPanel);





 


