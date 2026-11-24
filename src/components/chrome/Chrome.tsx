"use client";

import { Preloader } from "./Preloader";
import { Header } from "./Header";
import { MenuOverlay } from "./MenuOverlay";
import { BottomBar } from "./BottomBar";
import { TelemetryHUD } from "./TelemetryHUD";
import { A11ySheet } from "./A11ySheet";
import { ShortcutsSheet } from "./ShortcutsSheet";
import { Curtain } from "./Curtain";
import { TourController } from "./TourController";
import { Cursor } from "./Cursor";
import { CyberTerminal } from "@/components/terminal/CyberTerminal";

export function Chrome() {
  return (
    <>
      <Preloader />
      <Header />
      <MenuOverlay />
      <BottomBar />
      <TelemetryHUD />
      <A11ySheet />
      <ShortcutsSheet />
      <Curtain />
      <TourController />
      <Cursor />
      <CyberTerminal />
    </>
  );
}
