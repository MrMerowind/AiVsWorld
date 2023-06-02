import { GameScreen } from "./gameScreen";

export class GameCamera{
    private offsetX;
    private offsetY;
    private cameraSpeed;
    private gameScreenHandle: GameScreen | null;
    private playerPositionX: number;
    private playerPositionY: number;

    constructor()
    {
        this.offsetX = 0;
        this.offsetY = 0;
        this.playerPositionX = 0;
        this.playerPositionY = 0;
        this.gameScreenHandle = null;
        this.cameraSpeed = 0.1;
    }

    public setGameScreenHandle(handle: GameScreen): void
    {
        this.gameScreenHandle = handle;
    }
    public setPlayerPosition(x: number, y: number): void
    {
        this.playerPositionX = x;
        this.playerPositionY = y;
    }
    public centerOnPlayer(): void
    {
        if(this.gameScreenHandle === null) return;

        this.offsetX = this.playerPositionX - this.gameScreenHandle.getCenterHorizontal();
        this.offsetY = this.playerPositionY - this.gameScreenHandle.getCenterVertical();
    }
    public moveTowardsPlayer(delta: number): void
    {
        if(this.gameScreenHandle === null) return;

        const moveToX: number = this.playerPositionX - this.gameScreenHandle.getCenterHorizontal();
        const moveToY: number = this.playerPositionY - this.gameScreenHandle.getCenterVertical();

        const moveToXAbs = moveToX - this.offsetX;
        const moveToYAbs = moveToY - this.offsetY;

        const distance = Math.hypot(moveToXAbs, moveToYAbs);


        const minimumDistance = 20;

        if(distance >= minimumDistance)
        {
            if(Math.abs(moveToXAbs) > minimumDistance) this.offsetX += (moveToXAbs / distance) * this.cameraSpeed * delta;
            if(Math.abs(moveToYAbs) > minimumDistance) this.offsetY += (moveToYAbs / distance) * this.cameraSpeed * delta;
        }

    }
    public setOffset(x: number, y: number): void
    {
        this.offsetX = x;
        this.offsetY = y;
    }
    public move(x: number, y: number): void
    {
        this.offsetX += x;
        this.offsetY += y;
    }
    
    public getOffset(): [x: number, y: number]
    {
        return [this.offsetX, this.offsetY];
    }
    public getOffsetX(): number
    {
        return this.offsetX;
    }
    public getOffsetY(): number
    {
        return this.offsetY;
    }
    
}