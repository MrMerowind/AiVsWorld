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
}