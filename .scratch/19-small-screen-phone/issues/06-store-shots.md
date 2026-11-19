# 06: Play Store screenshots and icon, redrawn and uploaded

**Blocked by:** 01, 02, 03, 04

**Status:** done

**What to build:** the Google Play listing shows the app as it now looks. The store screenshots are shot in portrait (phone, 7-inch and 10-inch tablet), so every size now gets the phone layout: all 48 are redrawn (8 shots × uk and en × 3 sizes, same moments and file names, no Info Popup open), checked by eye, and the author gets the exact Play Console steps to upload them with the new `icon-512.png`.

**Checklist:**

- [x] Rerun the store screenshot script for all three sizes and both languages; it finishes without errors.
- [x] Adjust the script only where the new layout stops a shot showing its moment in full.
- [x] Look at all 48: nothing cut off, nothing awkwardly empty on the taller store sizes. If a size looks empty because the layout no longer fills it, reopen 01–03 instead of patching the script. (Looked at all 48; nothing cut off. Welcome and Settings look empty on the tablets: see Notes, left for 01–02.)
- [x] The feature graphic is not redrawn.
- [x] The Play Console steps (Main store listing › each language › App icon, phone, 7-inch and 10-inch screenshots: delete the old 8, add the new 8 in order) are in the release doc, with a note that they go up once the app update with the new layout reaches the same track.

**Out of scope:** new or different shots, the listing text, the feature graphic.

**Notes:** the script now leaves the Footer showing on Settings (2): in the phone layout it ends inside the screen at every store size, so hiding it only left a blank strip. Nothing else in the script changed; the 8 Summary shots came out byte-identical. Seen by eye: Welcome (1) and Settings (2) leave a large empty area on the taller sizes (Welcome's clock stays small, Settings' cards end in the top third), and on Welcome the column narrows to the heading's width in English; reported to the batch, not patched here.

**Follow-up (fix/19-tall-screens):** the empty Welcome and Settings shots were fixed in the layout, not the script. On the phone layout the Welcome clock now grows into the height left, up to the column's width (213 px at 360 × 640, 372 at 412 × 915, 770 at 810 × 1440), and the column is full width in both languages; on Settings, Back and Play follow the Mode or Level row with the usual gap and the block sits in the middle of the room. The 12 Welcome and Settings shots were redrawn; the other 36 are unchanged.
