class ItemMap
{
    constructor()
    {
        this.map = new Map();
    }

    setList(data = null)
    {
        if(!data || data.length === 0) return;
        
        data.forEach(element => {
            this.map.set(element.id, element);
        });
    }

    getItemList(groundId)
    {
        const list = [];
        this.map.forEach((value)=> {
            if(value.groundId === groundId) list.push(value)
        });
        return list;
    }

    getItem(id)
    {
        return this.map.get(id);
    }
}