class RecommandCard extends AbstractComponent
{
  constructor(data = null)
  {
    super();
    this.addEventListener('click', this.handleClick);
    if(data) this.data = this.#setData(data);
    this.#setId();
  }

  static get observedAttributes(){return [];}

  handleClick(e) {
    //e.preventDefault();
    e.composedPath().find((node)=>{
      if(node.nodeName === 'svg' || node.nodeName === 'path') return false;
      if(typeof(node.className) === 'object' || !node.className || !node.className?.match(/command/)) return false;
      if(node.className.match(/command-show-recommand-panel/))
      {
        this.removeModalComponent();
        const recommandPanel = new RecommandPanel(this.data);
        document.querySelector('main').appendChild(recommandPanel)
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

  #setId()
  {
    this.setAttribute('id', this.data.id);
  }

  #getGroundData(data)
  {
    return globalThis.config.groundMap.getGround(data.groundId);
  }

  #getItemData(data)
  {
    return globalThis.config.itemMap.getItem(data.itemId);
  }

  #setData(data)
  {
    data.groundTitle = this.#getGroundData(data).title;
    data.itemTitle = this.#getItemData(data).title;
    data.itemImage = this.#getItemData(data).image;
    return data;
  }
  
  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
      <article class="recommand border rounded">
        <img class="card-img-top" src="${this.data.itemImage}" alt="action Character">
        <div class="flex-row justify-content-between">
          <strong class="d-inline-block mb-2 text-primary-emphasis">${this.data.groundTitle} > ${this.data.itemTitle}</strong>
          <span>2,343명 수행중</span>
        </div>
        <h3 class="mb-0">${this.data.title}</h3>
        <div class="mb-1 text-body-secondary">Since 2023</div>
        <p class="card-text">${this.data.desc}</p>
        <button type="button" class="btn btn-outline-primary command-show-recommand-panel">자세한 내용을 살펴보세요</button>
      </article>
      `;  
      return tempalate;
  }
}
customElements.define("recommand-card", RecommandCard);

