---
name: apple-design
description: Use when designing, mocking up or building a screen or app for iPhone, iPad, Mac, Apple Watch, Apple TV or Apple Vision Pro, in HTML, a design tool, SwiftUI, UIKit or AppKit.
---

# Designing for Apple platforms

Use the Apple Design MCP server's tools for every Apple fact the design needs. Do not work from memory: Apple's guidelines, devices and components change every year.

## If the tools are missing

If no tool named `get_design_brief` is available, stop and tell the user to add the Apple Design MCP server as a connector: `https://apple-design-mcp.com/mcp`. It needs no sign-in.

## Before drawing or coding

Call `get_design_brief` once for each device the design targets, naming every component and every icon the screen will use. It returns the screen size, the device's guidelines, Apple's drawing of each component, the SF Symbols and the system values. Use the other tools only for what the brief says it does not cover. Do not guess a screen size, colour, text style or icon.

## In a mockup (HTML, Claude Design, any design tool)

- Place Apple's component SVGs as they are. Change only their icons and labels.
- Do not rebuild a toolbar, tab bar, list row, button or any other standard component in HTML or CSS, even to get tap states. Lay clickable areas over the SVG instead.
- When you swap an icon, use the weight the drawing's `data-symbol-weight` names, at the same place and size.
- Use only SF Symbols for icons, never another icon set.
- Put the screen in Apple's frame for the device when the user wants to see it on a device.

## In code (SwiftUI, UIKit, AppKit)

- Use the system's own components (`TabView`, `NavigationStack`, `List`, `.toolbar`, `UIToolbar` and so on) and SF Symbols by name, such as `Image(systemName: "heart.fill")`.
- Do not paste the SVG drawings into an app. Use them and their measurements only as a reference for layout and spacing.
- Use semantic colours and text styles (`.primary`, `.body`) rather than fixed values.

## Before finishing

Compare each standard component in the result with its drawing in the brief. In a mockup, replace any component you rebuilt by hand with Apple's SVG. Check that the layout follows the device guidelines the brief returned, such as where bars sit and which edges the hardware covers.
