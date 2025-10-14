import { Typed } from "../../types/typed";

export const PortSpecType = "port-spec";

export interface PortSpec extends Typed<typeof PortSpecType> {
  connectorType: string;
  maxVolume: number;
  minVolume: number;
}
