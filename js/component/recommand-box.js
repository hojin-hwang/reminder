class RecommandBox extends HTMLElement
{
  constructor()
  {
    super();
    this.addEventListener('click', this.handleClick);
  }

  static get observedAttributes(){return [];}

  handleClick(e) {
    //e.preventDefault();
    e.composedPath().find((node)=>{
      if(node.nodeName === 'svg' || node.nodeName === 'path') return false;
      if(typeof(node.className) === 'object' || !node.className || !node.className?.match(/command/)) return false;
      if(node.className.match(/command-add-void-action/))
      {
        const makeCard = new MakeCard();
        document.querySelector('main').appendChild(makeCard)
      }
    });
  }

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

  showRecommandAction(data)
  {
    const _box = this.querySelector('.recommand-box');
    _box.innerHTML = '';
    this.list = this.#sortData(data);
    this.list.forEach(element => {
      const recommandCard = new RecommandCard(element);
      _box.appendChild(recommandCard);
    });
  }

  #sortData(data)
  {
    return data;
  }
  
  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
      <div style="display: flex;      justify-content: space-between;      align-items: center;      padding: 12px 0;">
        <label>추천 액션</label>
        <button type="button" class="btn btn-sm btn-primary command-add-void-action">빈액션 추가</button>
      </div>
      
      <section class="recommand-box">

      </section>   
      `;  
      return tempalate;
  }
}
customElements.define("recommand-box", RecommandBox);

