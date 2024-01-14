class RecommandCard extends HTMLElement
{
  constructor(data = null)
  {
    super();
    if(data) this.data = this.#setData(data);
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

  #getGroundData(data)
  {
    return (globalThis.data.groundList.find((ground) => ground.id === data.ground))
  }

  #getItemData(data)
  {
    return (globalThis.data.itemList.find((item) => item.groundId === data.ground && item.id === data.item ))
  }

  #setData(data)
  {
    data.groundTitle = this.#getGroundData(data).title;
    data.itemTitle = this.#getItemData(data).title;
    return data;
  }
  
  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
      <article class="recommand border rounded">
        <div class="flex-row justify-content-between">
          <strong class="d-inline-block mb-2 text-primary-emphasis">${this.data.groundTitle} > ${this.data.itemTitle}</strong>
          <span>2,343명 수행중</span>
        </div>
        <h3 class="mb-0">${this.data.title}</h3>
        <div class="mb-1 text-body-secondary">Since 2023</div>
        <p class="card-text">${this.data.desc}</p>
        <button type="button" class="btn btn-outline-primary">자세한 내용을 살펴보세요</button>
      </article>
      `;  
      return tempalate;
  }
}
customElements.define("recommand-card", RecommandCard);

