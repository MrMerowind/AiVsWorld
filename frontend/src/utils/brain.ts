import { OnGrass } from "../types/global";
import { SingleWorld } from "./singleWorld";

type NeuronType = [value: number, a: number | null, b: number | null, c: number | null];
type EndFunctionType = [fn: () => void, a: number | null, b: number | null, c: number | null];

export class Brain{

    endFunctions: Array<EndFunctionType> = new Array<[() => void, number | null, number | null, number | null]>();

    neurons2: Array<NeuronType> = new Array<[number, number | null, number | null,number | null]>(10);

    neurons1: Array<NeuronType> = new Array<[number, number | null, number | null,number | null]>(10);

    visionBoardOnGrass: Array<[value: number, wall: number | null, fireplace: number | null, bush: number | null,
        rat: number | null, panda: number | null, alces: number | null, ridder: number | null]> = new Array<[number, number | null, number | null, number | null, number | null,number | null,number | null, number | null]>(81);
    visionBoardPlayer: Array<[value: number, checked: boolean]> = new Array<[number, boolean]>(40);

    peekBoard(wolrd: SingleWorld)
    {
        const health = wolrd.player.health;
        const warmth = wolrd.player.warmth;
        const energy = wolrd.player.energy;
        const inventory = wolrd.player.inventory;
        const posX = wolrd.player.positionX;
        const posY = wolrd.player.positionY;
        for(let i = 0; i < 10; i++) this.visionBoardPlayer[i + 0][1] = health >= i * 10 + 1;
        for(let i = 0; i < 10; i++) this.visionBoardPlayer[i + 10][1] = warmth >= i * 2 + 1;
        for(let i = 0; i < 10; i++) this.visionBoardPlayer[i + 20][1] = energy >= i * 10 + 1;
        for(let i = 0; i < 10; i++) this.visionBoardPlayer[i + 30][1] = inventory >= i + 1;

        let visionBoardIndex = 0;
        for(let i = -9; i <= 9; i++)
        {
            for(let j = -9; j <= 9; j++)
            {
                const tilePosX = (posX + i) % SingleWorld.WORLD_WIDTH;
                const tilePosY = (posY + j) % SingleWorld.WORLD_HEIGHT;
                const index = tilePosX + tilePosY * SingleWorld.WORLD_WIDTH;

                this.visionBoardOnGrass[visionBoardIndex][0] = wolrd.onGrass[index];
                visionBoardIndex++;
            }
        }
    }
    
    connectFuncions(wolrd: SingleWorld)
    {
        this.endFunctions.push([wolrd.moveDown, null, null, null]);
        this.endFunctions.push([wolrd.moveUp, null, null, null]);
        this.endFunctions.push([wolrd.moveLeft, null, null, null]);
        this.endFunctions.push([wolrd.moveRight, null, null, null]);
        this.endFunctions.push([wolrd.placeFireplaceDown, null, null, null]);
        this.endFunctions.push([wolrd.placeFireplaceUp, null, null, null]);
        this.endFunctions.push([wolrd.placeFireplaceLeft, null, null, null]);
        this.endFunctions.push([wolrd.placeFireplaceRight, null, null, null]);
        this.endFunctions.push([wolrd.placeWallDown, null, null, null]);
        this.endFunctions.push([wolrd.placeWallUp, null, null, null]);
        this.endFunctions.push([wolrd.placeWallLeft, null, null, null]);
        this.endFunctions.push([wolrd.placeWallRight, null, null, null]);
        this.endFunctions.push([wolrd.rest, null, null, null]);
        this.endFunctions.push([wolrd.eatAndRest, null, null, null]);
    }

    calculateFromVisionBoard(visionBoardIndex: number)
    {
        if(visionBoardIndex < 0 || visionBoardIndex > 120) return 0;

        // TODO: If crased check this 80 number
        if(visionBoardIndex > 80)
        {
            visionBoardIndex -= 80;
            if(this.visionBoardPlayer[visionBoardIndex][1]) return this.visionBoardPlayer[visionBoardIndex][0];
            else return 0;
        }
        else
        {
            if(this.visionBoardOnGrass[visionBoardIndex][0] === OnGrass.Wall) return this.visionBoardOnGrass[visionBoardIndex][1];
            if(this.visionBoardOnGrass[visionBoardIndex][0] === OnGrass.Fireplace) return this.visionBoardOnGrass[visionBoardIndex][2];
            if(this.visionBoardOnGrass[visionBoardIndex][0] === OnGrass.Bush) return this.visionBoardOnGrass[visionBoardIndex][3];
            if(this.visionBoardOnGrass[visionBoardIndex][0] === OnGrass.Rat) return this.visionBoardOnGrass[visionBoardIndex][4];
            if(this.visionBoardOnGrass[visionBoardIndex][0] === OnGrass.Panda) return this.visionBoardOnGrass[visionBoardIndex][5];
            if(this.visionBoardOnGrass[visionBoardIndex][0] === OnGrass.Alces) return this.visionBoardOnGrass[visionBoardIndex][6];
            if(this.visionBoardOnGrass[visionBoardIndex][0] === OnGrass.Ridder) return this.visionBoardOnGrass[visionBoardIndex][7];
        }

        return 0;
    }

    calculateNeuronNode1(neuronNumber: number)
    {
        let sum = 0;
        for(let i = 1; i <= 3; i++)
        {
            if(this.neurons1[neuronNumber][1] !== null)
            sum += (neuronNumber ? this.calculateFromVisionBoard(this.neurons1[neuronNumber][1] as number) : 0) as number;
        }
        if(sum > 0) return this.neurons2[neuronNumber][0];
    }

    calculateNeuronNode2(neuronNumber: number)
    {
        let sum = 0;
        for(let i = 1; i <= 3; i++)
        {
            if(this.neurons2[neuronNumber][1] !== null)
            sum += (neuronNumber ? this.calculateNeuronNode1(this.neurons2[neuronNumber][1] as number) : 0) as number;
        }
        if(sum > 0) return this.neurons2[neuronNumber][0];

    }

    calculateFunctionNode(node: EndFunctionType)
    {
        return 0 + (node[1] ? this.calculateNeuronNode2(node[1]) as number : 0) + (node[2] ? this.calculateNeuronNode2(node[2]) as number : 0) + (node[3] ? this.calculateNeuronNode2(node[3]) as number : 0);
    }

    makeDecision(world: SingleWorld)
    {
        this.peekBoard(world);
        this.connectFuncions(world);

        let highestScore = 0;
        let index = 0;
        if(this.endFunctions.length > 0)
        {
            highestScore = this.calculateFunctionNode(this.endFunctions[0]);
        }
        for(let i = 1; i < this.endFunctions.length; i++)
        {
            const newScore = this.calculateFunctionNode(this.endFunctions[i]);
            if(newScore > highestScore)
            {
                highestScore = newScore;
                index = i;
            }
        }
        this.endFunctions[index][0]();
    }

    constructor(best: Brain | null = null)
    {
        return;
    }

}