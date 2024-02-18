class AvatarMap
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

    getAvatarList()
    {
        return this.map;
    }

    getAvatar(id)
    {
        return this.map.get(id);
    }
}