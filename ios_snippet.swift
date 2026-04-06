import UIKit
import WebKit

class ViewController: UIViewController, WKNavigationDelegate {
    var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // 1. Initialize WebView
        let webConfiguration = WKWebViewConfiguration()
        webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.navigationDelegate = self
        view = webView

        // 2. Load index.html from Main Bundle
        // CRITICAL: Ensure you added the './dist' folder as a "Folder Reference" 
        // (the folder icon in Xcode must be BLUE, not yellow).
        if let bundlePath = Bundle.main.path(forResource: "dist", ofType: nil),
           let bundleURL = URL(fileURLWithPath: bundlePath) {
            
            let indexURL = bundleURL.appendingPathComponent("index.html")
            
            // 3. Use loadFileURL to allow reading local assets
            // allowingReadAccessTo should point to the root 'dist' folder
            webView.loadFileURL(indexURL, allowingReadAccessTo: bundleURL)
        } else {
            print("Error: Could not find 'dist' folder in Main Bundle.")
        }
    }
}
