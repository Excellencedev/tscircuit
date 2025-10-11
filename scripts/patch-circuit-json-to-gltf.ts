import { convertCircuitJsonToGltf as original_convertCircuitJsonToGltf, type ConversionOptions, type Scene3D, type Box3D as OriginalBox3D } from "circuit-json-to-gltf"
import type { CircuitJson } from "circuit-json"
import { cju } from "@tscircuit/circuit-json-util"

interface Box3D extends OriginalBox3D {
  pcb_component_id?: string;
}

export const convertCircuitJsonToGltf = async (circuit_json: CircuitJson, options: ConversionOptions) => {
  const result = await original_convertCircuitJsonToGltf(circuit_json, options);
  const db = cju(circuit_json);

  if (typeof result === 'object' && 'boxes' in result) {
    const scene = result as Scene3D;
    for (const box of scene.boxes as Box3D[]) {
      if (box.mesh && box.pcb_component_id) {
        const pcbComponent = db.pcb_component.get(box.pcb_component_id);
        if (pcbComponent) {
          const sourceComponent = db.source_component.get(pcbComponent.source_component_id);
          if (sourceComponent) {
            box.label = sourceComponent.name;
            box.labelColor = "white";
          }
        }
      }
    }
  }

  return result;
}