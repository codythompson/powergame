import { Container } from "pixi.js";
import { EntityCollection, Node } from "./entity";
import {
  CustomOnly,
  TemplateCollection,
  TemplateType,
  TemplateTypeE,
  TemplateTypeP,
  TemplateTypeSet,
} from "./templates";
import { Tracked } from "./types/typed";

export class Game<
  TTS extends TemplateTypeSet<AllTT, AllT>,
  AllTT extends TemplateType<AllT>,
  AllT extends string,
  TS extends TemplateCollection<TTS, AllTT, AllT> = TemplateCollection<TTS, AllTT, AllT>,
> {
  entities: EntityCollection;
  templates: TS;

  constructor(container: Container, templates: TS) {
    this.entities = new EntityCollection(container);
    this.templates = templates;
  }

  makeEntity<T extends AllT>(
    type: T,
    params: CustomOnly<TemplateTypeP<TTS[T]>>,
  ): Node<Tracked<TemplateTypeE<TTS[T]>>> {
    const inflatedParams = {
      collection: this.entities,
      ...params,
    } as TemplateTypeP<TTS[T], T>;
    const pushArgs = this.templates.makeEntity<T>(type, inflatedParams);
    const id = this.entities.pushTree(pushArgs);
    return this.entities.getNode(id)!;
  }
}
