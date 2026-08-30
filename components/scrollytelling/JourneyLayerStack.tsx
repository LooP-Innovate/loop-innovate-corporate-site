import Image from "next/image";
import { getJourneyLayers } from "@/lib/scrollytelling/layer-config";
import type { SceneId } from "@/lib/scrollytelling/scene-config";
import styles from "./loop-journey.module.css";

type JourneyLayerStackProps = {
  sceneId: SceneId;
};

export function JourneyLayerStack({ sceneId }: JourneyLayerStackProps) {
  const layers = getJourneyLayers(sceneId);

  if (layers.length === 0) {
    return null;
  }

  return (
    <div className={styles.layerStack} aria-hidden="true">
      {layers.map((layer) => (
        <Image
          key={layer.id}
          className={styles.separatedLayer}
          src={layer.src}
          alt=""
          fill
          sizes={sceneId === "return" ? "1672px" : "100vw"}
          loading="lazy"
          draggable={false}
          unoptimized={layer.delivery === "source"}
          quality={layer.quality ?? undefined}
          data-layer-id={layer.id}
          data-layer-delivery={layer.delivery}
          data-layer-motion={layer.motion}
        />
      ))}
    </div>
  );
}
