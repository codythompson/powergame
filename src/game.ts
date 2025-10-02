import { Container } from "pixi.js";
import { EntityCollection, Node } from "./entity";
import {
  AllTemplateTypes,
  CustomOnly,
  TemplateCollection,
  TemplateType,
  TemplateTypeE,
  TemplateTypeP,
  TemplateTypeSet,
  TemplateTypeT,
} from "./templates";
import { Tracked } from "./types/typed";

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
    params: CustomOnly<TemplateTypeP<AllTemplateTypes<TTS>, T>>,
  ): Node<Tracked<TemplateTypeE<TTS[T]>>> {
    const inflatedParams = {
      collection: this.entities,
      ...params,
    } as TemplateTypeP<AllTemplateTypes<TTS>, T>;
    const pushArgs = this.templates.makeEntity<T>(type, inflatedParams);
    const id = this.entities.pushTree(pushArgs);
    return this.entities.getNode(id)!;
  }
}
