# FIELD video asset

Place the generated FIELD video at:

```text
public/video/field-v01.mp4
```

The application intentionally does not include a placeholder media file. When
the MP4 is absent or cannot be decoded, Scroll Video Lab displays a clear
fallback message instead of failing.

For reliable seeking across desktop and mobile browsers, export an H.264 MP4
with frequent keyframes and enable fast-start metadata placement.
