from __future__ import annotations

import argparse
from io import BytesIO
from pathlib import Path
from zipfile import ZipFile

from PIL import Image


EXPECTED_SIZE = (1672, 941)
ASSET_MAP = {
    "R-01_RETURN_dawn_base.png": "public/media/journey/still/06-return.webp",
    "R-08_milky_way_stars.png": (
        "public/media/journey/layers/return/milky-way-stars.webp"
    ),
    "R-09_star_field.png": "public/media/journey/layers/return/star-field.webp",
    "R-10_dawn_horizon_glow.png": (
        "public/media/journey/layers/return/dawn-horizon-glow.webp"
    ),
    "R-11_subtle_grid_flow.png": (
        "public/media/journey/layers/return/subtle-grid-flow.webp"
    ),
    "R-12_blue_particles.png": (
        "public/media/journey/layers/return/blue-particles.webp"
    ),
    "R-13_white_dot_dissolve_particles.png": (
        "public/media/journey/transition/return-exit/"
        "white-dot-dissolve-particles.webp"
    ),
    "R-14_white_transition_wash.png": (
        "public/media/journey/transition/return-exit/"
        "white-transition-wash.webp"
    ),
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Import the approved RETURN dawn layers as lossless WebP assets."
    )
    parser.add_argument("archive", type=Path, help="Path to RETURN_dawn_layers.zip")
    parser.add_argument(
        "--project-root",
        type=Path,
        default=Path(__file__).resolve().parent.parent,
        help="Project root receiving public/media assets.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    project_root = args.project_root.resolve()

    with ZipFile(args.archive) as archive:
        archive_names = set(archive.namelist())
        missing = sorted(set(ASSET_MAP) - archive_names)
        if missing:
            raise RuntimeError(f"RETURN archive is missing: {', '.join(missing)}")

        for source_name, destination_name in ASSET_MAP.items():
            destination = (project_root / destination_name).resolve()
            if project_root not in destination.parents:
                raise RuntimeError(f"Destination escapes project root: {destination}")

            with Image.open(BytesIO(archive.read(source_name))) as source:
                if source.size != EXPECTED_SIZE:
                    raise RuntimeError(
                        f"{source_name} has {source.size}; expected {EXPECTED_SIZE}."
                    )

                destination.parent.mkdir(parents=True, exist_ok=True)
                source.convert("RGBA").save(
                    destination,
                    format="WEBP",
                    lossless=True,
                    exact=True,
                    method=6,
                )

            print(f"RETURN {source_name} -> {destination_name}")


if __name__ == "__main__":
    main()
