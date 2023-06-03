export class Player{
    positionX = 10;
    positionY = 10;
    private health = 100;
    private warmth = 20;
    energy = 100;
    private inventory = 0;

    survivalPoints = 0;


    public static readonly MAX_ENERGY = 100;
    public static readonly MAX_HEALTH = 100;
    public static readonly MAX_WARMTH = 20;
    public static readonly MAX_INVENTORY = 10;
    public static readonly FIRE_DAMAGE = 10;

    addWarmth(value: number)
    {
        this.survivalPoints += value > 0 ? value : 0;
        this.warmth += value;
        if(this.warmth > Player.MAX_WARMTH)
        {
            this.survivalPoints -= this.warmth - Player.MAX_WARMTH;
            this.warmth = Player.MAX_WARMTH;
        }
    }

    getWarmth()
    {
        return this.warmth;
    }

    addInventory(value: number)
    {
        this.survivalPoints += value > 0 ? value : 0;
        this.inventory += value;
        if(this.inventory > Player.MAX_INVENTORY) this.inventory = Player.MAX_INVENTORY;
    }

    addHealth(value: number)
    {
        this.survivalPoints += value > 0 ? value : 0;
        this.health += value;
        if(this.health > Player.MAX_HEALTH)
        {
            this.survivalPoints -= this.health - Player.MAX_HEALTH;
            this.health = Player.MAX_HEALTH;
        }
    }

    getHealth()
    {
        return this.health;
    }

    getInventory()
    {
        return this.inventory;
    }

    constructor()
    {
        this.health = Player.MAX_HEALTH;
        this.warmth = Player.MAX_WARMTH;
        this.energy = Player.MAX_ENERGY;
    }

}