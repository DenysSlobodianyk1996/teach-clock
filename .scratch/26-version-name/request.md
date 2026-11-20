# Request

> I released allready a few versions of app. Does version change at all or stay 1.0.0 during each deployment? does it correct?

Found: the versionCode grows with every CI upload (the workflow's run number, 21 by 2026-11-20), but the versionName players see stayed 1.0.0: it was `package.json`'s `version`, "raised by hand", and never was.

Of the two fixes offered (raise `package.json` by hand per batch, or build the name from the run number), the author chose the second:

> I prefer to 2nd way
