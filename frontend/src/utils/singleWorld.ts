import { EnemyDamage, OnGrass, Seasons, brainLimit } from "../types/global";
import { Player } from "./player";

export class SingleWorld{
    grass: number[] = new Array<number>(SingleWorld.WORLD_WIDTH * SingleWorld.WORLD_HEIGHT);
    onGrass: number[] = new Array<number>(SingleWorld.WORLD_WIDTH * SingleWorld.WORLD_HEIGHT);
    season: Seasons = Seasons.Spring;
    globalTemperature: number = 160;
    private timeElapsed: number = 0;
    private previousTimeElapsed: number = 0;
    static readonly WORLD_COUNT = brainLimit;
    static readonly WORLD_WIDTH = 50;
    static readonly WORLD_HEIGHT = 50;
    static readonly WORLD_TICK_TIME = 100;
    static readonly WORLD_SEASON_TICKS = 200;
    static readonly WORLD_BURNING_MINIMUM_TEMPERATURE = 180;
    static readonly WORLD_ZERO_TEMPERATURE = 100;
    static readonly WORLD_FIRE_TEMPERATURE = 200;
    public tickCount: number = 0;
    public player: Player;

    // For random numbers
    m_w = 123456789;
    m_z = 987654321;
    mask = 0xffffffff;

    // Takes any integer
    setSeed(i: number) {
        this.m_w = (123456789 + i) & this.mask;
        this.m_z = (987654321 - i) & this.mask;
    }

    // Returns number between 0 (inclusive) and 1.0 (exclusive),
    // just like Math.random().
    getRandom()
    {
        this.m_z = (36969 * (this.m_z & 65535) + (this.m_z >> 16)) & this.mask;
        this.m_w = (18000 * (this.m_w & 65535) + (this.m_w >> 16)) & this.mask;
        var result = ((this.m_z << 16) + (this.m_w & 65535)) >>> 0;
        result /= 4294967296;
        return result;
    }

    constructor()
    {
        this.setSeed(1595423);
        this.player = new Player();
        for(let i = 0; i < SingleWorld.WORLD_WIDTH; i++)
        {
            for(let j = 0; j < SingleWorld.WORLD_HEIGHT; j++)
            {
                const grassIndex = i + j * SingleWorld.WORLD_WIDTH; 
                this.grass[grassIndex] = 160;

                this.onGrass[grassIndex] = 0;
                const rnd = this.getRandom() * 2000;
                if(rnd < 200) this.onGrass[grassIndex] = OnGrass.Bush;
                else if(rnd < 250) this.onGrass[grassIndex] = OnGrass.Rat;
                else if(rnd < 275) this.onGrass[grassIndex] = OnGrass.Panda;
                else if(rnd < 300) this.onGrass[grassIndex] = OnGrass.Alces;
                else if(rnd < 310) this.onGrass[grassIndex] = OnGrass.Ridder;


                if(i === this.player.positionX && j === this.player.positionY)
                {
                    this.onGrass[grassIndex] = OnGrass.Ai;
                }
            }
        }
    }

    applySeasonTemperature()
    {
        for(let i = 0; i < SingleWorld.WORLD_WIDTH; i++)
        {
            for(let j = 0; j < SingleWorld.WORLD_HEIGHT; j++)
            {
                const grassIndex = i + j * SingleWorld.WORLD_WIDTH;
                const shouldTemperatureBeLower = this.grass[grassIndex] > this.globalTemperature && this.grass[grassIndex] > 100;
                const shouldTemperatureBeHigher = this.grass[grassIndex] < this.globalTemperature && this.grass[grassIndex] < 200;
                if(shouldTemperatureBeLower) this.grass[grassIndex] -= 1;
                else if(shouldTemperatureBeHigher) this.grass[grassIndex] += 1;
            }
        }
    }

    progressSeason()
    {
        this.tickCount++;
        if(this.tickCount >= SingleWorld.WORLD_SEASON_TICKS)
        {
            this.tickCount -= SingleWorld.WORLD_SEASON_TICKS;
            if(this.season === Seasons.Spring) this.season = Seasons.Summer; 
            else if(this.season === Seasons.Summer) this.season = Seasons.Autumn; 
            else if(this.season === Seasons.Autumn) this.season = Seasons.Winter; 
            else if(this.season === Seasons.Winter) this.season = Seasons.Spring; 

            if(this.season === Seasons.Spring) this.globalTemperature = 160; 
            else if(this.season === Seasons.Summer) this.globalTemperature = 180; 
            else if(this.season === Seasons.Autumn) this.globalTemperature = 140; 
            else if(this.season === Seasons.Winter) this.globalTemperature = 100;
        }
        this.applySeasonTemperature();
    }

    moveEnemies()
    {
        const enemiesPositions: number[] = [];
        for(let i = 0; i < this.onGrass.length; i++)
        {
            const isEnemy = this.onGrass[i] === OnGrass.Rat || this.onGrass[i] === OnGrass.Panda || this.onGrass[i] === OnGrass.Alces || this.onGrass[i] === OnGrass.Ridder;
            if(isEnemy && this.getRandom() * 5 < 1)
            enemiesPositions.push(i);
        }
        enemiesPositions.forEach(enemyIndex => {
            let positionX = enemyIndex % SingleWorld.WORLD_WIDTH;
            let positionY = (enemyIndex - positionX) / SingleWorld.WORLD_WIDTH;
            const enemyNumber = this.onGrass[enemyIndex];
            
            const rnd = this.getRandom() * 4;
            if(rnd < 1) positionX--;
            else if(rnd < 2) positionX++;
            else if(rnd < 3) positionY--;
            else if(rnd < 4) positionY++;

            positionX = positionX % SingleWorld.WORLD_WIDTH;
            positionY = positionY % SingleWorld.WORLD_HEIGHT;

            const newEnemyIndex = positionX + positionY * SingleWorld.WORLD_WIDTH;

            if(this.onGrass[newEnemyIndex] === 0)
            {
                this.onGrass[enemyIndex] = 0;
                this.onGrass[newEnemyIndex] = enemyNumber;
            } if(this.onGrass[newEnemyIndex] === OnGrass.Ai)
            {
                
                if(this.onGrass[enemyIndex] === OnGrass.Rat)
                {
                    this.player.addHealth(-EnemyDamage.Rat);
                    //this.player.addInventory(1);
                    this.player.energy -= 2;
                } else if(this.onGrass[enemyIndex] === OnGrass.Panda)
                {
                    this.player.addHealth(-EnemyDamage.Panda);
                    //this.player.addInventory(2);
                    this.player.energy -= 2;
                } else if(this.onGrass[enemyIndex] === OnGrass.Alces)
                {
                    this.player.addHealth(-EnemyDamage.Alces);
                    //this.player.addInventory(5);
                    this.player.energy -= 2;
                } else if(this.onGrass[enemyIndex] === OnGrass.Ridder)
                {
                    this.player.addHealth(-EnemyDamage.Ridder);
                    //this.player.addInventory(10);
                    this.player.energy -= 2;
                }

                this.onGrass[enemyIndex] = 0;
            }

        });
    }

    startFire(positionX: number, positionY: number)
    {
        positionX = positionX % SingleWorld.WORLD_WIDTH;
        positionY = positionY % SingleWorld.WORLD_HEIGHT;

        const newFireIndex = positionX + positionY * SingleWorld.WORLD_WIDTH;

        const isBurnable = this.onGrass[newFireIndex] === OnGrass.Bush || this.onGrass[newFireIndex] === OnGrass.Wall;
        if(isBurnable)
        {
            const isTemperatureHighEnaugh = this.grass[newFireIndex] >= SingleWorld.WORLD_BURNING_MINIMUM_TEMPERATURE;
            if(isTemperatureHighEnaugh)
            {
                this.onGrass[newFireIndex] = OnGrass.Fireplace;
            }
        }
    }

    spreadFire()
    {
        const firePositions: number[] = [];
        for(let i = 0; i < this.onGrass.length; i++)
        {
            const isFire = this.onGrass[i] === OnGrass.Fireplace;
            if(isFire)
            firePositions.push(i);
        }
        firePositions.forEach(fireIndex => {
            let positionX = fireIndex % SingleWorld.WORLD_WIDTH;
            let positionY = (fireIndex - positionX) / SingleWorld.WORLD_WIDTH;

            this.grass[fireIndex] = SingleWorld.WORLD_FIRE_TEMPERATURE;
            
            this.startFire(positionX - 1, positionY);
            this.startFire(positionX + 1, positionY);
            this.startFire(positionX, positionY - 1);
            this.startFire(positionX, positionY + 1);

        });
    }

    warmthQueue: Array<[x: number, y: number, distance: number]> = new Array<[number, number, number]>(0);

    calculateWarmth(indexStart: number, indexEnd: number, distance: number = 1)
    {
        if(distance > 4) return;
        const startPositionX = indexStart % SingleWorld.WORLD_WIDTH;
        const startPositionY = (indexStart - startPositionX) / SingleWorld.WORLD_WIDTH;
        const startTemperature = this.grass[indexStart];

        const endPositionX = indexEnd % SingleWorld.WORLD_WIDTH;
        const endPositionY = (indexEnd - endPositionX) / SingleWorld.WORLD_WIDTH;
        const endTemperature = this.grass[indexEnd];

        const isOutOfBounds = startPositionX < 0 || startPositionX >= SingleWorld.WORLD_WIDTH || startPositionY < 0 || startPositionY >= SingleWorld.WORLD_HEIGHT;
        if(isOutOfBounds) return;

        const isLimitedByObject = this.onGrass[indexEnd] === OnGrass.Bush || this.onGrass[indexEnd] === OnGrass.Wall;
        if(isLimitedByObject) return;

        if(endTemperature >= startTemperature) return;

        const newTemperature = (Math.floor((startTemperature - endTemperature) * 0.2) + endTemperature);

        this.grass[indexEnd] = newTemperature;

        const newIndex1 = ((endPositionX - 1) % SingleWorld.WORLD_WIDTH) + ((endPositionY) % SingleWorld.WORLD_HEIGHT) * SingleWorld.WORLD_WIDTH;
        if(startPositionX >= endPositionX) 
            this.warmthQueue.push([indexEnd, newIndex1, distance + 1]);
        const newIndex2 = ((endPositionX + 1) % SingleWorld.WORLD_WIDTH) + ((endPositionY) % SingleWorld.WORLD_HEIGHT) * SingleWorld.WORLD_WIDTH; 
        if(startPositionX <= endPositionX) 
            this.warmthQueue.push([indexEnd, newIndex2, distance + 1]);
        const newIndex3 = ((endPositionX) % SingleWorld.WORLD_WIDTH) + ((endPositionY - 1) % SingleWorld.WORLD_HEIGHT) * SingleWorld.WORLD_WIDTH; 
        if(startPositionY >= endPositionY) 
        this.warmthQueue.push([indexEnd, newIndex3, distance + 1]);
        const newIndex4 = ((endPositionX) % SingleWorld.WORLD_WIDTH) + ((endPositionY + 1) % SingleWorld.WORLD_HEIGHT) * SingleWorld.WORLD_WIDTH; 
        if(startPositionY <= endPositionY) 
        this.warmthQueue.push([indexEnd, newIndex4, distance + 1]);
    }

    spreadWarmth()
    {
        const firePositions: number[] = [];
        for(let i = 0; i < this.onGrass.length; i++)
        {
            const isFire = this.onGrass[i] === OnGrass.Fireplace;
            if(isFire)
            firePositions.push(i);
        }
        firePositions.forEach(fireIndex => {
            
            const newPositionX = fireIndex % SingleWorld.WORLD_WIDTH;
            const newPositionY = (fireIndex - newPositionX) / SingleWorld.WORLD_WIDTH;

            this.calculateWarmth(fireIndex, (newPositionX - 1) % SingleWorld.WORLD_WIDTH + newPositionY * SingleWorld.WORLD_WIDTH);
            this.calculateWarmth(fireIndex, (newPositionX + 1) % SingleWorld.WORLD_WIDTH + newPositionY * SingleWorld.WORLD_WIDTH);
            this.calculateWarmth(fireIndex, (newPositionX + ((((newPositionY - 1) % SingleWorld.WORLD_HEIGHT) * SingleWorld.WORLD_WIDTH) )));
            this.calculateWarmth(fireIndex, (newPositionX + ((((newPositionY + 1) % SingleWorld.WORLD_HEIGHT) * SingleWorld.WORLD_WIDTH) )));

            while(this.warmthQueue.length > 0)
            {
                this.calculateWarmth(this.warmthQueue[0][0], this.warmthQueue[0][1], this.warmthQueue[0][2]);
                this.warmthQueue.shift();
            }

        });
    }

    isGameFinished()
    {
        if(this.player.getHealth() <= 0 || this.player.getWarmth() <= 0) return true;
        else return false;
    }

    calculatePlayerWarmth()
    {
        const onGrassIndex = this.player.positionX + this.player.positionY * SingleWorld.WORLD_WIDTH;
        const temperatureOfSpace = this.grass[onGrassIndex] - 100;

        this.player.addWarmth(- Math.max(50 - (temperatureOfSpace), 0) / 10);
    }

    play(delta: number | null = null): boolean
    {
        if(delta !== null)
        {
            const timePassedSinceLastPlay = delta * (1000 / 60);
            this.timeElapsed += timePassedSinceLastPlay;
        }

        const isTimeTrackedAndNotEnaughPassed = delta !== null && (this.previousTimeElapsed + SingleWorld.WORLD_TICK_TIME > this.timeElapsed);
        if(isTimeTrackedAndNotEnaughPassed) return false;
        
        this.previousTimeElapsed += SingleWorld.WORLD_TICK_TIME;
        
        this.progressSeason();
        this.moveEnemies();
        this.spreadFire();
        this.spreadWarmth();
        this.player.addHealth(-1);
        this.calculatePlayerWarmth();
        return true;
    }

    moveUnit(x: number, y: number)
    {
        const newPositionX = (this.player.positionX + x);
        const newPositionY = (this.player.positionY + y);

        const isOutOfBounds = newPositionX < 0 || newPositionX >= SingleWorld.WORLD_WIDTH || newPositionY < 0 || newPositionY >= SingleWorld.WORLD_HEIGHT;

        if(isOutOfBounds) return;

        const oldIndex = this.player.positionX + this.player.positionY * SingleWorld.WORLD_WIDTH;
        const newIndex = newPositionX + newPositionY * SingleWorld.WORLD_WIDTH;

        if(this.onGrass[newIndex] === 0)
        {
            this.onGrass[oldIndex] = 0;
            this.onGrass[newIndex] = OnGrass.Ai;
            this.player.positionX = newPositionX;
            this.player.positionY = newPositionY;
        } else if(this.onGrass[newIndex] === OnGrass.Wall || this.onGrass[newIndex] === OnGrass.Bush)
        {
            this.onGrass[newIndex] = 0;
            this.player.addInventory(1);
        } else if(this.onGrass[newIndex] === OnGrass.Fireplace)
        {
            this.player.addHealth(-Player.FIRE_DAMAGE);
        } else if(this.onGrass[newIndex] === OnGrass.Rat)
        {
            this.player.addHealth(-EnemyDamage.Rat);
            //this.player.addInventory(1);
            this.player.energy -= 1;
            this.onGrass[newIndex] = 0;
        } else if(this.onGrass[newIndex] === OnGrass.Panda)
        {
            this.player.addHealth(-EnemyDamage.Panda);
            //this.player.addInventory(2);
            this.player.energy -= 1;
            this.onGrass[newIndex] = 0;
        } else if(this.onGrass[newIndex] === OnGrass.Alces)
        {
            this.player.addHealth(-EnemyDamage.Alces);
            //this.player.addInventory(5);
            this.player.energy -= 1;
            this.onGrass[newIndex] = 0;
        } else if(this.onGrass[newIndex] === OnGrass.Ridder)
        {
            this.player.addHealth(-EnemyDamage.Ridder);
            //this.player.addInventory(10);
            this.player.energy -= 1;
            this.onGrass[newIndex] = 0;
        }
    }

    placeFireplaceUnit(x: number, y: number)
    {
        const newPositionX = (this.player.positionX + x) % SingleWorld.WORLD_WIDTH;
        const newPositionY = (this.player.positionY + y) % SingleWorld.WORLD_HEIGHT;
        const newIndex = newPositionX + newPositionY * SingleWorld.WORLD_WIDTH;

        if(this.onGrass[newIndex] === 0) this.onGrass[newIndex] = OnGrass.Fireplace;
    }

    placeWallUnit(x: number, y: number)
    {
        const newPositionX = (this.player.positionX + x) % SingleWorld.WORLD_WIDTH;
        const newPositionY = (this.player.positionY + y) % SingleWorld.WORLD_HEIGHT;
        const newIndex = newPositionX + newPositionY * SingleWorld.WORLD_WIDTH;

        if(this.onGrass[newIndex] === 0) this.onGrass[newIndex] = OnGrass.Wall;
    }

    eatAndRest = () =>
    {
        if(this.player.getInventory() > 0)
        {
            this.player.addInventory(-1);
            this.player.addHealth(10);
        }
        this.player.energy++;
    }
    rest = () =>
    {
        this.player.energy++;
    }
    moveLeft = () =>
    {
        this.moveUnit(-1, 0);
    }
    moveRight = () =>
    {
        this.moveUnit(1, 0);
    }
    moveUp = () =>
    {
        this.moveUnit(0, -1);
    }
    moveDown = () =>
    {
        this.moveUnit(0, 1);
    }
    placeFireplaceLeft = () =>
    {
        this.placeFireplaceUnit(-1, 0);
    }
    placeFireplaceRight = () =>
    {
        this.placeFireplaceUnit(1, 0);
    }
    placeFireplaceUp = () =>
    {
        this.placeFireplaceUnit(0, -1);
    }
    placeFireplaceDown = () =>
    {
        this.placeFireplaceUnit(0, 1);
    }
    placeWallLeft = () =>
    {
        this.placeFireplaceUnit(-1, 0);
    }
    placeWallRight = () =>
    {
        this.placeFireplaceUnit(1, 0);
    }
    placeWallUp = () =>
    {
        this.placeFireplaceUnit(0, -1);
    }
    placeWallDown = () =>
    {
        this.placeFireplaceUnit(0, 1);
    }

}