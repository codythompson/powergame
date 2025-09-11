import { assertDef, isDef, isNum } from "./types/guards"
import { Typed } from "./types/typed"

export interface Model<T extends string> extends Typed<T> {
  readonly type: T
  name: string
  id?: number
}

export interface Connector<T extends string = string> extends Model<T> {
  base: "connector"
  readonly maxRate: number
  x: number
  y: number

  parent: number|undefined
  connectedTo: number|undefined

  /// volume in or out for next tick
  volume: number
}

export interface System<T extends string = string> extends Model<T> { }

export interface ConnectorNode {
  readonly name:string
  readonly connector: Connector
  readonly connected: {
    readonly connector: Connector
    readonly system: System
  } | undefined
  readonly toConnected:()=>ConnectorNode|undefined
  readonly toSystem:()=>SystemNode|undefined
}

export interface SystemNode<T extends string = string> {
  readonly system: System<T>
  readonly connectors: ConnectorNode[]
  readonly toConnected:(name:string)=>ConnectorNode|undefined
}

export class ModelCollection {
  private _systems:System[] = []
  private _connectors:Connector[] = []
  private _byParentId:{ [nodeId:number]: Connector[] } = {}

  push(node:System, connectors:Connector[] = []):number {
    if (isDef(node.id)) {
      throw new Error(`[ModelCollection.push] cannot re-push system. id:${node.id} name:${node.name}`)
    }
    node.id = this._systems.push(node)-1
    for (let conn of connectors) {
      if (isDef(conn.id) || isDef(conn.parent)) {
        throw new Error(`[ModelCollection.push] cannot re-push connection. id:${conn.id} p:${conn.parent} name:${conn.name} for id:${node.id} name:${node.name}`)
      }
      conn.parent = node.id;
      conn.id = this._connectors.push(conn)-1
    }
    this._byParentId[node.id] = connectors;
    return node.id
  }

  connect(a:Connector, b:Connector) {
    // TODO compatibility check???
    assertDef(a.id)
    assertDef(b.id)
    a.connectedTo = b.id
    b.connectedTo = a.id
  }

  pushConnector(parent:System|number, connector:Connector):number {
    if (!isNum(parent)) {
      parent = assertDef(parent.id);
    }
    if (isDef(connector.id) || isDef(connector.parent)) {
      throw new Error(`[ModelCollection.push] cannot re-push connection. id:${connector.id} p:${connector.parent} name:${connector.name} for parent id:${parent}`)
    }
    connector.parent = parent;
    connector.id = this._connectors.push(connector)-1;
  }

  getSystem(id:number = Infinity):System|undefined {
    return id < this._systems.length ? this._systems[id] : undefined
  }

  getConnector(id:number = Infinity):Connector|undefined {
    return id < this._connectors.length ? this._connectors[id] : undefined
  }

  findByName<T extends Connector|ConnectorNode>(connectors:T[], name:string):T|undefined {
    return connectors.find(c => c.name === name)
  }

  expandConnector(connector:Connector|undefined):ConnectorNode|undefined {
    if (!isDef(connector)) {
      return undefined
    }
    const connectedTo = this.getConnector(connector.connectedTo)
    const connected = isDef(connectedTo)? {
        connector: connectedTo,
        system: assertDef(this.getSystem(connectedTo.parent)),
      }
      : undefined;
    return {
      name: connector.name,
      connector,
      connected,
      toConnected: () => {
        return this.expandConnector(connectedTo)
      },
      toSystem: () => {
        return this.expandSystemNode(connected?.system)
      },
    }
  }

  expandSystemNode(system:System|undefined):SystemNode|undefined {
    if (!isDef(system) || !isDef(system.id)) {
      return undefined;
    }
    const unExpConnectors = this._byParentId[system.id] ?? [];
    const connectors = unExpConnectors.map(c => this.expandConnector(c)) as ConnectorNode[];
    return {
      system,
      connectors, 
      toConnected: (name:string) => {
        return this.findByName(connectors, name)
      }
    }
  }

  getSystemNode(id:number):SystemNode|undefined {
    const system = this.getSystem(id);
    if (!isDef(system)) {
      return undefined
    }
    return this.expandSystemNode(system);
  }

  getConnectorNode(id:number):ConnectorNode|undefined {
    const connector = this.getConnector(id)
    if (!isDef(connector)) {
      return undefined
    }
    return this.expandConnector(connector)
  }
}

/**
 * 
 * node <-ref/connector-> wire <-ref/connector-> node
 * 
 * can exist inside subsystems? rooms? containers?
 * subsystems can be recursive / aka have nodes, wires, AND subsystems as children
 * 
 * nodes and wires can have views, ref/connectors are abstract
 * subsystems can views
 * 
 * a wire is kind of just a weird node
 * 
 * nodes and wires have connectors that restrict what can be plugged in
 * 
 * nodes are kind of just connectors into subsystems
 * wires are kind of just simple subsystems
 * 
 * ok so I've been thinking of nodes as nodes, but maybe they're edges?
 * or "plugs"/connectors
 * 
 * wires and/or subsystems are connections between nodes
 * they can _have_ subsystems.
 * 
 * f it. wires, powerplants, substations, are all Systems
 * Systems have Connectors (formerly nodes)
 * 
 * NOT QUITE - SEE BELOW ~~Systems can have internal connectors for sub-systems~~
 * 
 * visually/spatially - a connector for a subsystem may be kind of far away from it's parent system connector
 * OR a generator system's output connector might be weirdly placed WRT the grid wires system.
 * 
 * SO either big systems (generators/grid) have small systems (visual connections between two ends of connector)
 * OR connectors themselves can have internal "wires" that are maybe not full fledged systems
 * 
 * I like the latter for keeping complexity down
 * 
 * what about multiplexed connectors (definitely not the right def. of mulitplex)
 * like generator output has 8 pins/wires. this is maybe more about payload/bandwidth/pipe-size
 * 
 * hmmm.. each end of a connection will have compatible connectors
 * a Connector is attached to a System.
 * NOPE
 * 
 * TOO COMPLEX a connector is a SINGLE attachement point on surface, but exposes 1-many inputs/outpus in the SUBSYSTEM of the system it is attached to.
 * 
 * a connector has subconnectors and the payload streams through them are... channels??
 * like connectors are compatible if the channels match
 * a channel is a SINGLE stream - what flows through it is ... encoded?
 * AKA power, DC power, AC power, data, a special combo of power and data and water. lol.
 * this implies a payload/stream/type.
 * - violating KISS - for now.
 * 
 * ok a connector has 1 channel! and a rate associated with it
 * an opaque system would simply have a connector that was filled
 * at a rate less than / == to the connectors rate
 * an transparent system would have a subsystem connected to the internal end of the connector that supplied the stuff for the outside
 * (i.e. a connector with rate of 8 power might have a combiner subsystem that takes 8-1power inputs and turns into 1-8power output that is connected to top-level system output)
 * 
 * hmmm still ned a base-case producer or consumer - maybe that's a node?
 * 
 * renaming system to node - full circle history except swapped
 * 
 * So where are we:
 * connector:
 *   static:
 *     type
 *     id
 *     name
 *     min-rate per tick (0 for now)
 *     max-rate per tick
 *     near-future: type of thing (i.e. power, data, water)
 *     future: maybe min quality or damage occurs?
 *   refs (static, but have null-like state):
 *     parent node id
 *     paired connector id?
 *   dynamic:
 *     current tick volume
 * 
 * node (aka system): // children looked up via connectors pointing to this
 *   // puts volume in connected connector
 *   type
 *   id
 *   name
 *   min-rate per tick? // depending on type, omit for now, logic territory, not data territory
 *   max-rate per tick?
 *   dynamic or static:
 *     volumes: (for next tick) {
 *       [slotName]: number
 *     }
 * 
 * future: templates???
 */
