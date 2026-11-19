// SafeAreaProbe: a minimal iOS app that prints its window's safe-area insets and size, in portrait
// and in landscape, as one JSON line on standard output, then exits.
// Built and run by extractor/measure-safe-areas.py; see extractor/README.md.
import UIKit

@main
final class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, configurationForConnecting session: UISceneSession,
                     options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        let config = UISceneConfiguration(name: nil, sessionRole: session.role)
        config.delegateClass = SceneDelegate.self
        return config
    }
}

final class ProbeController: UIViewController {
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask { .all }
    override var prefersStatusBarHidden: Bool { false }
}

final class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?
    var result: [String: Any] = [:]

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options: UIScene.ConnectionOptions) {
        guard let scene = scene as? UIWindowScene else { return }
        let window = UIWindow(windowScene: scene)
        window.rootViewController = ProbeController()
        window.makeKeyAndVisible()
        self.window = window
        result["screen"] = ["width": scene.screen.bounds.width, "height": scene.screen.bounds.height, "scale": scene.screen.scale]
        result["system"] = UIDevice.current.systemVersion
        result["model"] = ProcessInfo.processInfo.environment["SIMULATOR_MODEL_IDENTIFIER"] ?? ""
        result["device_name"] = ProcessInfo.processInfo.environment["SIMULATOR_DEVICE_NAME"] ?? ""
        // Wait for layout, read portrait, rotate, wait, read landscape, rotate back, print, exit.
        after(1.5) {
            self.record("portrait", scene)
            scene.requestGeometryUpdate(.iOS(interfaceOrientations: .landscapeRight)) { error in self.result["landscape_error"] = "\(error)" }
            // Read each orientation twice, 2 seconds apart, so a reading taken mid-rotation shows up.
            self.after(3.0) {
                self.record("landscape", scene)
                self.after(2.0) {
                self.record("landscape_again", scene)
                scene.requestGeometryUpdate(.iOS(interfaceOrientations: .landscapeLeft)) { _ in }
                self.after(3.0) {
                    self.record("landscape_left", scene)
                    let data = try! JSONSerialization.data(withJSONObject: self.result, options: [.sortedKeys])
                    print("SAFEAREA " + String(decoding: data, as: UTF8.self))
                    fflush(stdout)
                    exit(0)
                }
                }
            }
        }
    }

    func after(_ seconds: Double, _ work: @escaping () -> Void) {
        DispatchQueue.main.asyncAfter(deadline: .now() + seconds, execute: work)
    }

    func record(_ key: String, _ scene: UIWindowScene) {
        guard let window else { return }
        let i = window.safeAreaInsets
        result[key] = [
            "top": i.top, "bottom": i.bottom, "left": i.left, "right": i.right,
            "width": window.bounds.width, "height": window.bounds.height,
            "orientation": scene.effectiveGeometry.interfaceOrientation.rawValue,
        ]
    }
}
