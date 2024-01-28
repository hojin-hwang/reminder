class Action
{
    constructor(data)
    {
        this.data = data;
        this.setData("groundTitle", this.#getGroundData().title);
        this.setData("itemTitle", this.#getItemData().title);
    }

    setData(key, value)
    {
        this.data[key] = value;
        window.postMessage({msg:"UPDATE_ACTION_DATA", data:this.data});
    }
    getData(key)
    {
        return this.data[key];
    }

    #getGroundData()
    {
        return globalThis.config.groundMap.getGround(this.data.groundId);
    }

    #getItemData()
    {
        return globalThis.config.itemMap.getItem(this.data.itemId);
    }
}