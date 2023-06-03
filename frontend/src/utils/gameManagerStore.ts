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
    previewWorld: SingleWorld;
    previewBrain: Brain;
    bestWorldCopy: SingleWorld;
    bestBrainCopy: Brain;
    brains: Brain[];
    copyBestBrain: () => void;
    resetWorlds: () => void;
}

export class GameManagerStore implements IGameManagerStore{
    public screen: GameScreen;
    public camera: GameCamera;
    public worlds: SingleWorld[] = [];
    
    public brains: Brain[] = [];
    public bestBrainCopy: Brain = new Brain(null);
    public bestWorldCopy: SingleWorld = new SingleWorld();

    public previewWorld: SingleWorld = new SingleWorld();
    public previewBrain: Brain = new Brain(this.bestBrainCopy);

    copyBestBrain()
    {
        this.brains = new Array<Brain>(brainLimit);

        for(let i = 0; i < brainLimit; i++)
            this.brains[i] = new Brain(this.bestBrainCopy);
        for(let i = 0; i < brainLimit; i++)
        {
            this.brains[i].evolution();
            this.brains[i].evolution();
            this.brains[i].evolution();
        }
    }

    resetWorlds()
    {
        for(let i = 0; i < SingleWorld.WORLD_COUNT; i++)
        {
            this.worlds[i] = new SingleWorld();
        }
    }

    constructor(gameData: GameManagerStore | null = null)
    {   
        if(gameData !== null)
        {
            this.screen = gameData.screen;
            this.camera = gameData.camera;
            this.worlds = gameData.worlds;
            this.previewWorld = gameData.previewWorld;
            this.brains = gameData.brains;
            this.bestBrainCopy = gameData.bestBrainCopy;
            this.bestWorldCopy = gameData.bestWorldCopy;
        }
        else
        {
            this.screen = new GameScreen();
            this.camera = new GameCamera();
            this.bestBrainCopy = new Brain();

            const savedBrain = localStorage.getItem("brain");
            if(savedBrain)
                this.bestBrainCopy = JSON.parse(savedBrain) as Brain;

            this.bestWorldCopy = new SingleWorld();

            for(let i = 0; i < SingleWorld.WORLD_COUNT; i++)
            {
                this.worlds[i] = new SingleWorld();
            }

            this.previewWorld = new SingleWorld();
            this.previewBrain = new Brain();
            this.copyBestBrain();
        }
        makeAutoObservable(this);
            
    }
}