class RecommandCard extends HTMLElement
{
  constructor(data = null)
  {
    super();
    this.addEventListener('click', this.handleClick);
    if(data) this.data = this.#setData(data);
  }

  static get observedAttributes(){return [];}

  handleClick(e) {
    //e.preventDefault();
    e.composedPath().find((node)=>{
      if(node.nodeName === 'svg' || node.nodeName === 'path') return false;
      if(typeof(node.className) === 'object' || !node.className || !node.className?.match(/command/)) return false;
      if(node.className.match(/command-add-user-action/))
      {
        // const actionBox = document.querySelector('action-box');
        // actionBox.addActionCard(this.data);
        // this.remove()
        const makeCard = new MakeCard(this.data);
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

  #getGroundData(data)
  {
    return (globalThis.data.groundList.find((ground) => ground.id === data.groundId))
  }

  #getItemData(data)
  {
    return (globalThis.data.itemList.find((item) => item.groundId === data.groundId && item.id === data.itemId ))
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
        <button type="button" class="btn btn-primary command-add-user-action">임시 추가</button>
      </article>
      `;  
      return tempalate;
  }
}
customElements.define("recommand-card", RecommandCard);

