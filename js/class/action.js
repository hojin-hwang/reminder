class Action
{
    constructor(data)
    {
        this.data = data;
    }

    setData(key, value)
    {
        this.data[key] = value;
        window.postMessage({msg:"UPDATE_ACTION_DATA", data:this.data})
    }
}