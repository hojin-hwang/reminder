class GroupMap
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

    getGroundList()
    {
        return this.map;
    }

    getGround(id)
    {
        return this.map.get(id);
    }
}