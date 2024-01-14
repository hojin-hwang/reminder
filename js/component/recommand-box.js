class RecommandBox extends HTMLElement
{
  constructor()
  {
    super();
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
      <label>추천 액션</label>
      <section class="recommand-box">

      </section>   
      `;  
      return tempalate;
  }
}
customElements.define("recommand-box", RecommandBox);

