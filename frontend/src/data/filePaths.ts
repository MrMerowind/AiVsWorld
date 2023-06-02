import { Assets, BaseTexture, Texture } from "pixi.js";

const serverPath = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/";

export class Terrain{
    public static getPath(value: number)
    {
        if(value < 100) return serverPath.toString() + "img/" + value.toString() + ".png";
        else
        {
            if(value < 120) return serverPath.toString() + "img/100.png";
            if(value < 140) return serverPath.toString() + "img/120.png";
            if(value < 160) return serverPath.toString() + "img/140.png";
            if(value < 180) return serverPath.toString() + "img/160.png";
            else return serverPath.toString() + "img/180.png";
        }
    }

    private static textures: Map<string, Texture | null> = new Map<string, Texture>();

    public static preloadAllTextures()
    {
        for(let i = 10; i < 18; i++)
            this.getTexture(this.getPath(i));

        for(let i = 100; i < 200; i += 20)
            this.getTexture(this.getPath(i));
    }

    public static getTexture(path: string)
    {
        if(!this.textures.has(path))
        {
            this.textures.set(path, null);
            Assets.load(path).then(texture => this.textures.set(path, texture));
        }

        return this.textures.get(path);
    }
}