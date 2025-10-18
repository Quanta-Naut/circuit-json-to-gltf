import { Circuit } from "tscircuit"
import { test, expect } from "bun:test"
import { convertCircuitJsonToGltf } from "../../lib"
import { getBestCameraPosition } from "../../lib/utils/camera-position"
import { renderGLTFToPNGBufferFromGLBBuffer } from "poppygl"

test("led-texture-coordinates-snapshot", async () => {
  const circuit = new Circuit()
  circuit.add(
    <board width="12mm" height="12mm" pcbX={2} pcbY={2}>
      <led name="L0_0" footprint="0603" color="red" pcbX={0} pcbY={0} />
      <led name="L5_5" footprint="0603" color="red" pcbX={5} pcbY={5} />
      <led name="L0_5" footprint="0603" color="red" pcbX={0} pcbY={5} />
    </board>,
  )

  const circuitJson = await circuit.getCircuitJson()

  const glb = await convertCircuitJsonToGltf(circuitJson, {
    format: "glb",
    boardTextureResolution: 2048,
    includeModels: true,
    showBoundingBoxes: false,
  })

  const cameraOptions = getBestCameraPosition(circuitJson)
  cameraOptions.camPos = [6, 14, 8]
  cameraOptions.lookAt = [0, 0, 1]

  expect(
    await renderGLTFToPNGBufferFromGLBBuffer(glb as ArrayBuffer, cameraOptions),
  ).toMatchPngSnapshot(import.meta.path)
})
