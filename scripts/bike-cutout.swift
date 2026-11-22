// Cut the subject out of a photo with macOS's built-in subject lift (Vision,
// VNGenerateForegroundInstanceMaskRequest, macOS 14+). Writes an RGBA PNG at
// the input's full size: the subject opaque, everything else transparent.
//
//   swift scripts/bike-cutout.swift <upright-input.jpg> <output.png>
//
// The input must already be upright (gen-bike-images.mjs rotates it with
// sharp first), so the request is made with orientation .up. Local only — no
// model download, nothing leaves the machine.
import AppKit
import CoreImage
import Vision

let args = CommandLine.arguments
guard args.count == 3 else {
  FileHandle.standardError.write("usage: bike-cutout.swift <in> <out.png>\n".data(using: .utf8)!)
  exit(64)
}

let handler = VNImageRequestHandler(url: URL(fileURLWithPath: args[1]), orientation: .up)
let request = VNGenerateForegroundInstanceMaskRequest()
do {
  try handler.perform([request])
  guard let obs = request.results?.first else {
    FileHandle.standardError.write("no foreground subject found in \(args[1])\n".data(using: .utf8)!)
    exit(2)
  }
  // Vision lifts every foreground subject separately — the bike, but also a
  // rock or a kerb at the edge of the frame. Keep the largest (the bike) and
  // any instance whose box overlaps it (a helmet on the seat), drop the rest.
  func box(_ i: Int) throws -> (CGRect, Int) {
    let m = try obs.generateScaledMaskForImage(forInstances: IndexSet(integer: i), from: handler)
    CVPixelBufferLockBaseAddress(m, .readOnly)
    defer { CVPixelBufferUnlockBaseAddress(m, .readOnly) }
    let w = CVPixelBufferGetWidth(m), h = CVPixelBufferGetHeight(m), row = CVPixelBufferGetBytesPerRow(m)
    let base = CVPixelBufferGetBaseAddress(m)!.assumingMemoryBound(to: Float32.self)
    var x0 = w, y0 = h, x1 = -1, y1 = -1, n = 0
    for y in stride(from: 0, to: h, by: 4) {
      let line = base.advanced(by: y * row / 4)
      for x in stride(from: 0, to: w, by: 4) where line[x] > 0.5 {
        n += 1; x0 = min(x0, x); x1 = max(x1, x); y0 = min(y0, y); y1 = max(y1, y)
      }
    }
    return (n == 0 ? .null : CGRect(x: x0, y: y0, width: x1 - x0 + 1, height: y1 - y0 + 1), n)
  }
  let boxes = try obs.allInstances.map { ($0, try box($0)) }
  guard let main = boxes.max(by: { $0.1.1 < $1.1.1 }) else { exit(2) }
  var keep = IndexSet(integer: main.0)
  for (i, (r, _)) in boxes where i != main.0 && r.intersects(main.1.0) { keep.insert(i) }
  let buffer = try obs.generateMaskedImage(ofInstances: keep, from: handler, croppedToInstancesExtent: false)
  let image = CIImage(cvPixelBuffer: buffer)
  try CIContext().writePNGRepresentation(
    of: image, to: URL(fileURLWithPath: args[2]), format: .RGBA8,
    colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
} catch {
  FileHandle.standardError.write("cutout failed: \(error)\n".data(using: .utf8)!)
  exit(1)
}
