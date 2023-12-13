// Data
// title
// startTime
// interval
// checkTime

class MakeCard extends HTMLElement
{
  constructor(data = null)
  {
      super();
      this.addEventListener('click', this.handleClick);
      this.data =  {...data};
      this.id = self.crypto.randomUUID();
      this.currentPage = 0;
  }

  static get observedAttributes() {return ['type']; }

  handleClick(e) {
    e.preventDefault();
    e.composedPath().find((node)=>{
    if(node.nodeName === 'svg' || node.nodeName === 'path') return false;
    if(typeof(node.className) === 'object' || !node.className || !node.className?.match(/command/)) return false;
    if(node.className.match(/command-move-prev/))
    {
        this.shadowRoot.querySelector('.command-move-next').disabled = false;
        this.currentPage--;
        if(this.currentPage <= 0) node.disabled = true;
        else node.disabled = false;
        
        const card_info_list = this.shadowRoot.querySelectorAll('article.card-info');
        card_info_list.forEach((card, index)=>{
            card.style.left = `${(this.currentPage-index) * 100}vw`;
        })
    }
    if(node.className.match(/command-move-next/))
    {
        this.currentPage++;
        this.shadowRoot.querySelector('.command-move-prev').disabled = false;
        if(this.currentPage >= 3)  node.disabled = true;
        else node.disabled = false;
        
        const card_info_list = this.shadowRoot.querySelectorAll('article.card-info');
        card_info_list.forEach((card, index)=>{
            card.style.left = `${(this.currentPage-index) * -100}vw`;
         })
    }
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
    const template = this.#getTemplate();
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(template.content.cloneNode(true)); 
  }


  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
        <style>
            section{display: flex; flex-direction: column; width: 100vw; position: fixed; top :300px; left:0;}
            header{display: flex; justify-content: space-between;}
            .box{display: flex; flex-direction: row; width:400vw; position: relative;}
            article.card-info{width:100%;position: absolute;}
            article.card-info:nth-child(1){left:0}
            article.card-info:nth-child(2){left:100vw}
            article.card-info:nth-child(3){left:200vw}
            article.card-info:nth-child(4){left:300vw}
        </style>
        <section>
            <header>
                <button type="button" class="command-move-prev" disabled>이전</button>
                <span>Make Card</span>
                <button type="button" class="command-move-next">다음</button>
            </header>
            <div class="box">
                <article class="card-info">
                    <input type="text" name="startDate" placeholder="2023.12.12">
                    <input type="text" name="startTime" placeholder="17:40">
                    <hr>
                    Interval
                </article>
                <article class="card-info">
                    <input type="text" name="title" placeholder="title">
                </article>
                <article class="card-info">
                    checkTime
                </article>
                <article class="card-info">info</article>
            </div>
        </section>
      `;  
      return tempalate;
  }
}
customElements.define('make-card', MakeCard);





 


