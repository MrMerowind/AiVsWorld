import { Stage } from "@pixi/react";
import React, { useEffect } from "react";
import { GameManagerStoreProvider, useGameManagerStore } from "../hooks/useGameManagerStore";
import { MainGameComponent } from "./MainGame";

export const GameManager = () => {

    const ctx = useGameManagerStore();

    ctx.screen.setAutoSize();

    return (
        <GameManagerStoreProvider gameData={ctx}>
            <Stage width={ctx.screen.getWidth()} height={ctx.screen.getHeight()}>
                <MainGameComponent />
            </Stage>
        </GameManagerStoreProvider>
    );
};