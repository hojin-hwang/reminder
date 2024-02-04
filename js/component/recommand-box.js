class RecommandBox extends AbstractComponent
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
        const void_data = {
          "id": "r-01",
          "type":"recommand",
          "user": "",
          "groundId": "0",
          "itemId": "0",
          "title": "일단 한번 해봐",
          "desc": "일단 계획을 세우고 뭔가라도 해보세요",
          "alertDate":"2024-01-17 19:40",
          "interval": "week",
          "avatar": {},
          "info": {},
          "level":0,
          "exp":0
        };

        const makeCard = new MakeCard(void_data);
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
    this.list = this.#sortData(data);
    this.#appendRecommandCard();
  }

  moveRecommandCard(recommadData)
  {
    let selectedData = null;
    
    this.list = this.list.filter((data) =>{
      if(data.id === recommadData.recommandId) selectedData = data;
      else return data;
    });
    this.list.push(selectedData);
    this.#appendRecommandCard();
  }

  #sortData(data)
  {
    return data;
  }
  
  #appendRecommandCard()
  {
    const _box = this.querySelector('.recommand-box');
    _box.innerHTML = '';

    this.list.forEach(element => {
      const recommandCard = new RecommandCard(element);
      _box.appendChild(recommandCard);
    });
  }

  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
      <div style="display: flex;      justify-content: space-between;      align-items: center;      padding: 12px 0;">
        <label>추천 액션</label>
        <button type="button" class="btn btn-sm btn-primary command-add-void-action">그냥 액션 추가</button>
      </div>
      
      <section class="recommand-box">

      </section>   
      `;  
      return tempalate;
  }
}
customElements.define("recommand-box", RecommandBox);

