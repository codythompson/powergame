import { Entity } from "../../entity";
import { TOf, Typed } from "../../types/typed";

export const RefType = "port-spec";

export interface Ref<E extends Entity> extends Typed<typeof RefType> {
  refType: TOf<E>;
  id: number;
}
