import { useState } from "react";
import ProductStage from "./ProductStage";

const features = [
  { title: "Hidden Compartments", text: "Multiple discreet pockets throughout the hoodie allow you to store essentials like phones, wallets, and travel documents." },
  { title: "RFID Protection", text: "Integrated RFID-blocking fabric keeps your cards and passport safe from digital theft." },
  { title: "Water Resistant", text: "A special coating keeps you dry and your belongings protected in unexpected weather." },
];

export default function ProductFeaturesSection() {
  const [featureIndex, setFeatureIndex] = useState(0);
  const cameraTargets = [
    [0, 3, 10],   // Center
    [-5, 3, 10],  // Left
    [5, 3, 10],   // Right
  ];

  return (
    <section id="product" style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* 3D Stage as background */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0,
        pointerEvents: "none"
      }}>
        <ProductStage cameraTarget={cameraTargets[featureIndex]} />
      </div>
      {/* Feature text/content */}
      <div style={{
        position: "relative", zIndex: 1, display: "flex", alignItems: "center", height: "100vh", justifyContent: "center"
      }}>
        <button onClick={() => setFeatureIndex(i => Math.max(0, i - 1))} disabled={featureIndex === 0} style={{ fontSize: 24, marginRight: 32 }}>&lt;</button>
        <div style={{ background: "rgba(255,255,255,0.85)", padding: 32, borderRadius: 16, minWidth: 320, textAlign: "center" }}>
          <h2 style={{ fontSize: 36, marginBottom: 16 }}>{features[featureIndex].title}</h2>
          <p style={{ fontSize: 20 }}>{features[featureIndex].text}</p>
        </div>
        <button onClick={() => setFeatureIndex(i => Math.min(features.length - 1, i + 1))} disabled={featureIndex === features.length - 1} style={{ fontSize: 24, marginLeft: 32 }}>&gt;</button>
      </div>
    </section>
  );
} 