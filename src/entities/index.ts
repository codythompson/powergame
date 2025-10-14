import { Container } from "pixi.js";
import { Game } from "../game";
import { TemplateCollection } from "../templates";
import { SystemTemplate, SystemTemplateType } from "./system";
import { makePort, PortTemplateType } from "./port";

export type DefaultTemplateTypeSet = {
  system: SystemTemplateType;
  port: PortTemplateType;
};

export type DefaultTemplateTypeStrings = keyof DefaultTemplateTypeSet;

export type DefaultTemplateTypes =
  DefaultTemplateTypeSet[DefaultTemplateTypeStrings];


const templateStore = {
  system: new SystemTemplate(),
  port: makePort,
};
const templateCollection = new TemplateCollection<DefaultTemplateTypeSet, DefaultTemplateTypes, DefaultTemplateTypeStrings>(
  templateStore
);

export function makeGame(container: Container): Game<DefaultTemplateTypeSet,  DefaultTemplateTypes, DefaultTemplateTypeStrings> {
  return new Game(container, templateCollection);
}
