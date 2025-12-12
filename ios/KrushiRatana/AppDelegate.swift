import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: RCTAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil
  ) -> Bool {
    self.moduleName = "KrushiRatana"
    self.dependencyProvider = RCTAppDependencyProvider()
    self.initialProps = [:]
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    return self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    // Force Metro URL to avoid "No script URL provided"
    return URL(string: "http://127.0.0.1:8081/index.bundle?platform=ios&dev=true")
#else
    // Use pre-bundled JS for release
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
