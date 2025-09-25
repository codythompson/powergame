import { Container } from "pixi.js";
import { EntityCollection } from "./entity";
import {
  AllTemplateTypes,
  TemplateCollection,
  TemplateType,
  TemplateTypeP,
  TemplateTypeSet,
  TemplateTypeT,
} from "./templates";

export class Game<
  TTS extends TemplateTypeSet<TemplateType>,
  TS extends TemplateCollection<TTS> = TemplateCollection<TTS>,
> {
  entities: EntityCollection;
  templates: TS;

  constructor(container: Container, templates: TS) {
    this.entities = new EntityCollection(container);
    this.templates = templates;
  }

  makeEntity<T extends TemplateTypeT<AllTemplateTypes<TTS>>>(
    type: T,
    params: Omit<
      TemplateTypeP<AllTemplateTypes<TTS>, T>,
      "type" | "collection"
    >,
  ): number {
    const inflatedParams = {
      collection: this.entities,
      ...params,
    } as TemplateTypeP<AllTemplateTypes<TTS>, T>;
    const pushArgs = this.templates.makeEntity<T>(type, inflatedParams);
    return this.entities.pushTree(pushArgs);
  }
}
