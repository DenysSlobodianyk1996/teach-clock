package app.teachclockforkids;

import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    /**
     * Edge to edge on every Android version, as Android 15 and newer always are (batch 25). Capacitor's
     * SystemBars hands the bars' sizes to the page as --safe-area-inset-* whenever the WebView is 140 or
     * newer; without this, Android 14 and older still kept the window between the bars, so the header
     * and the page added the status and navigation bars a second time (32 + 44 px on an Oppo A52,
     * Android 11, WebView 157). On an older WebView Capacitor pads the app itself and sends 0.
     * After super.onCreate: BridgeActivity sets the theme without an action bar there, and enabling
     * earlier builds the window with the splash theme's action bar.
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
    }
}
