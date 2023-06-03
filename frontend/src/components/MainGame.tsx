import { AppProvider, useApp, useTick} from "@pixi/react";
import React, { useEffect, useRef, useState } from "react";
import { useGameManagerStore } from "../hooks/useGameManagerStore";
import { World } from "./World";

export function MainGameComponent(){

    const app = useApp();

    return (
        <AppProvider value={app}>
            <World />
        </AppProvider>
    );
}