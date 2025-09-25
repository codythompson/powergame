import { Container } from "pixi.js";
import { Game } from "../game";
import { TemplateCollection } from "../templates";
import { makeSystem, SystemTemplateType } from "./system";

export type DefaultTemplateTypeSet = {
  system: SystemTemplateType;
};
export type DefaultTemplateTypes =
  DefaultTemplateTypeSet[keyof DefaultTemplateTypeSet];

const templateStore = {
  system: makeSystem,
};
const templateCollection = new TemplateCollection<DefaultTemplateTypeSet>(
  templateStore,
);

export function makeGame(container: Container): Game<DefaultTemplateTypeSet> {
  return new Game(container, templateCollection);
}
