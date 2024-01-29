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

    updateExp()
    {
        const exp_point = this.#getExpPoint();
        let current_exp = parseInt(this.data["exp"]);
        current_exp = current_exp + exp_point;
        if(current_exp >= 100)
        {
            this.setData("exp", current_exp - 100);
            this.setData("level", parseInt(this.data["level"])+1)
        }
        else
        {
            this.setData("exp", current_exp);
        }
    }

    #getGroundData()
    {
        return globalThis.config.groundMap.getGround(this.data.groundId);
    }

    #getItemData()
    {
        return globalThis.config.itemMap.getItem(this.data.itemId);
    }

    #getExpPoint()
    {
        let point = 0;
        switch(this.data["interval"])
        {
            
            case "day":
                point = 5;
            break; 
            case "week":
                point = 22;
            break; 
            case "one-week":
                point = 33;
            break;   
            default:
                point = 5;
            break;   
        }
        return point;
    }
}