import { test, expect } from "bun:test"
import { renderGLTFToPNGBufferFromGLBBuffer } from "poppygl"
import { convertCircuitJsonToGltf } from "../../lib/index"
import { getBestCameraPosition } from "../../lib/utils/camera-position"
import type { CircuitJson, position } from "circuit-json"
import * as fs from "node:fs"
import * as path from "node:path"

test("led-texture-coordinates-snapshot", async () => {
  const ledBoardPath = path.join(
    __dirname,
    "../fixtures/led-texture-coordinates.json",
  )

  const circuitData = fs.readFileSync(ledBoardPath, "utf-8")
  const circuitJson: CircuitJson = JSON.parse(circuitData)

  // Convert circuit to GLTF (GLB format for rendering)
  const glbResult = await convertCircuitJsonToGltf(circuitJson, {
    format: "glb",
    boardTextureResolution: 1024,
    includeModels: true,
    showBoundingBoxes: false,
  })

  // Ensure we got a valid GLB buffer
  expect(glbResult).toBeInstanceOf(ArrayBuffer)
  expect((glbResult as ArrayBuffer).byteLength).toBeGreaterThan(0)

  // Render the GLB to PNG with camera position derived from circuit dimensions
  const cameraOptions = getBestCameraPosition(circuitJson)

  expect(
    renderGLTFToPNGBufferFromGLBBuffer(glbResult as ArrayBuffer, cameraOptions),
  ).toMatchPngSnapshot(import.meta.path, "led-texture-coordinates")
})
