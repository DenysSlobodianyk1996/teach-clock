# 13: One border on the name field

**What to build:** The name field never shows a double border. With an error its one border is red. While focused it is yellow, even with the error showing.

**Blocked by:** 01 Required name

**Status:** done

![Double border on focus](../images/13-double-border-focus.png)
![Double border on error](../images/13-double-border-error.png)

- [x] Focus adds no outline around the field's border
- [x] With an error and no focus, the border is red
- [x] With an error and focus, the border is yellow
- [x] The error message stays while the field is focused
- [x] A browser test covers focus and error in the light and dark themes

**Note:** an empty field without an error is also yellow, so focus changes the border's colour only when there is an error.
