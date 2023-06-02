import { makeAutoObservable } from "mobx";
import { GameScreen } from "./gameScreen";
import { GameCamera } from "./gameCamera";
import { SingleWorld } from "./singleWorld";

export interface IGameManagerStore{
    screen: GameScreen;
    camera: GameCamera;
    worlds: SingleWorld[];
    bestWorld: SingleWorld | null;
}

export class GameManagerStore implements IGameManagerStore{
    public screen: GameScreen;
    public camera: GameCamera;
    public worlds: SingleWorld[] = [];
    public bestWorld: SingleWorld | null;

    constructor(gameData: GameManagerStore | null = null)
    {   
        if(gameData !== null)
        {
            this.screen = gameData.screen;
            this.camera = gameData.camera;
            this.worlds = gameData.worlds;
            this.bestWorld = gameData.bestWorld;
        }
        else
        {
            this.screen = new GameScreen();
            this.camera = new GameCamera();

            for(let i = 0; i < SingleWorld.WORLD_COUNT; i++)
            {
                this.worlds[i] = new SingleWorld();
            }

            this.bestWorld = this.worlds[0];
        }
        makeAutoObservable(this);
            
    }
}