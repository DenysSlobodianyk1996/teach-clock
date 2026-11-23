# Request

I want to cover a few things in 1 parent.

1." Suggestion: the Start button looks disabled (dim) until a name is typed; a short hint like "type your name to start" would help small kids understand why."
IMO, we should have red \* in what is your name label, button always inabled. In case if you click enter and filed empty - set border red, focus name field so user can type. If need, notify that Field is required

2. It still hard for user to understand, how to play it. So, yes, I need short gif or video how to play it. I don't know where is better to put in - somewhere in info overlay, should it be playebple video or gif. How to generate in based on last design and changes each time.

3. "I wish it was also in German."
   IMO, we should have top 5 Europe langs in a lang selection. Right now this is button which switch between 2 langs. So, when we click to current button, should appear a list of lang keys (EN, УК) etc. Give me a list, but I prefer DE, FR, IT, SPAIN. + 2 current one in the beginning. Current logic stay - prefferable device lang if exist in updated lang list or EN by default. Also, for each lang we should have store streenshots.
   Below store we could have N folders - lang keys. And inside their listing, feature graphics, phote, tablet-7, tablet-10 screenshots. Regroup folder structure and files name, since grouped by lang, don't need lang key in file names anymore.

Later, on point 2: "ignore point 2, this is for other app."

After the first build, on the language menu:

"I saw lang dropdown had uk lang in 2 lines. did you fix it to be in 1 line? We shouldn't have fixed width for dropdown - enough for each lang in 1 line"

Then, with screenshots (`images/12-footer-band.png`, `images/12-low-window.png`, `images/13-double-border-focus.png`, `images/13-double-border-error.png`):

Desktop issues, width bigger 768px settings page
[Image #1] - footer is too big here
[Image #2] - when height is low, this screen. width should be full, no scroll in the middle of screen
[Image #3] - no double borders on focus. Error - bordeer red. You focus - yellow if even error
[Image #4] - when error - 1 red border, when focus - change error border to focused
In general, for 768 + px layout strange - width should be full

On checks: "don't run such full tests, you just burn tokens", then "just do fixes, don't review them. it was fine to just catch them, fix, and dont retest".
