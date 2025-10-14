import { Container } from "pixi.js";
import { Game } from "../game";
import { TemplateCollection } from "../templates";
import { SystemTemplate, SystemTemplateType } from "./system";
import { makePort, PortTemplateType } from "./port";
import { WireTemplate, WireTemplateType } from "./wire";

export type DefaultTemplateTypeSet = {
  system: SystemTemplateType;
  port: PortTemplateType;
  wire: WireTemplateType;
};

export type DefaultTemplateTypeStrings = keyof DefaultTemplateTypeSet;

export type DefaultTemplateTypes =
  DefaultTemplateTypeSet[DefaultTemplateTypeStrings];

const templateStore = {
  system: new SystemTemplate(),
  port: makePort,
  wire: new WireTemplate(),
};
const templateCollection = new TemplateCollection<
  DefaultTemplateTypeSet,
  DefaultTemplateTypes,
  DefaultTemplateTypeStrings
>(templateStore);

export function makeGame(
  container: Container,
): Game<
  DefaultTemplateTypeSet,
  DefaultTemplateTypes,
  DefaultTemplateTypeStrings
> {
  return new Game(container, templateCollection);
}
