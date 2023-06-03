export class Player{
    positionX = 10;
    positionY = 10;
    health = 100;
    warmth = 20;
    energy = 100;
    inventory = 0;


    public static readonly MAX_ENERGY = 100;
    public static readonly MAX_HEALTH = 100;
    public static readonly MAX_WARMTH = 20;
    public static readonly MAX_INVENTORY = 10;
    public static readonly FIRE_DAMAGE = 10;

    addInventory(value: number)
    {
        this.inventory += value;
        if(this.inventory > Player.MAX_INVENTORY) this.inventory = Player.MAX_INVENTORY;
    }

    constructor()
    {
        this.health = Player.MAX_HEALTH;
        this.warmth = Player.MAX_WARMTH;
        this.energy = Player.MAX_ENERGY;
    }

}