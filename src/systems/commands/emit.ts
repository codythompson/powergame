// TODO - better event arg handling and marriage of the system.ts events and the entity collection events

// import { TEntity } from "../../entity";
// import { Command, Event } from "../../system";

// export class Emit<T extends string = string, E extends TEntity = TEntity> implements Command<E> {
//   constructor(readonly event:T) {}

//   execute<ET extends string = string>({issuer}: Event<ET, E>): void {
//     issuer.emit(this.event)
//   }
// }
