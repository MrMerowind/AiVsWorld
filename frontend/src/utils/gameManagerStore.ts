import { makeAutoObservable } from "mobx";
import { GameScreen } from "./gameScreen";
import { GameCamera } from "./gameCamera";
import { SingleWorld } from "./singleWorld";
import { Brain } from "./brain";
import { brainLimit } from "../types/global";

export interface IGameManagerStore{
    screen: GameScreen;
    camera: GameCamera;
    worlds: SingleWorld[];
    bestWorld: SingleWorld | null;
    bestBrain: Brain;
    brains: Brain[];
    copyBestBrain: () => void;
}

export class GameManagerStore implements IGameManagerStore{
    public screen: GameScreen;
    public camera: GameCamera;
    public worlds: SingleWorld[] = [];
    public bestWorld: SingleWorld | null;

    public bestBrain: Brain = new Brain();
    public brains: Brain[] = [];

    copyBestBrain()
    {
        this.brains = [];

        for(let i = 0; i < brainLimit; i++);
        this.brains.push(new Brain(this.bestBrain));
    }

    constructor(gameData: GameManagerStore | null = null)
    {   
        if(gameData !== null)
        {
            this.screen = gameData.screen;
            this.camera = gameData.camera;
            this.worlds = gameData.worlds;
            this.bestWorld = gameData.bestWorld;
            this.brains = gameData.brains;
        }
        else
        {
            this.screen = new GameScreen();
            this.camera = new GameCamera();

            for(let i = 0; i < SingleWorld.WORLD_COUNT; i++)
            {
                this.worlds[i] = new SingleWorld();
            }

            this.bestWorld = new SingleWorld();
        }
        makeAutoObservable(this);
            
    }
}