import { Seasons } from "../types/global";



export class SingleWorld{
    grass: number[] = new Array<number>(SingleWorld.WORLD_WIDTH * SingleWorld.WORLD_HEIGHT);
    season: Seasons = Seasons.Spring;
    globalTemperature: number = 160;
    private timeElapsed: number = 0;
    private previousTimeElapsed: number = 0;
    static readonly WORLD_COUNT = 10;
    static readonly WORLD_WIDTH = 90;
    static readonly WORLD_HEIGHT = 40;
    static readonly WORLD_TICK_TIME = 100;
    static readonly WORLD_SEASON_TICKS = 200;
    public tickCount: number = 0;

    constructor()
    {
        for(let i = 0; i < SingleWorld.WORLD_WIDTH; i++)
        {
            for(let j = 0; j < SingleWorld.WORLD_HEIGHT; j++)
            {
                const grassIndex = i + j * SingleWorld.WORLD_WIDTH; 
                this.grass[grassIndex] = 160;
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

            console.log("Aktualny sezon: ", this.season);

        }
        this.applySeasonTemperature();
    }

    play(delta: number | null = null)
    {
        if(delta !== null)
        {
            const timePassedSinceLastPlay = delta * (1000 / 60);
            this.timeElapsed += timePassedSinceLastPlay;
        }

        const isTimeTrackedAndNotEnaughPassed = delta !== null && (this.previousTimeElapsed + SingleWorld.WORLD_TICK_TIME > this.timeElapsed);
        if(isTimeTrackedAndNotEnaughPassed) return;
        
        this.previousTimeElapsed += SingleWorld.WORLD_TICK_TIME;
        
        this.progressSeason();
    }

}