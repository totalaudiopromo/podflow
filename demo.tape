# podflow hero demo — ~15s, show help + digest help
# Render: cd /Users/chrisschofield/workspace/active/podflow && vhs demo.tape

Output demo.gif

Set Shell "bash"
Set FontFamily "Menlo"
Set FontSize 18
Set Width 1200
Set Height 600
Set TypingSpeed 50ms
Set Theme "Catppuccin Mocha"
Set Padding 20
Set Framerate 30
Set PlaybackSpeed 1
Set WindowBar Colorful
Set Margin 40
Set MarginFill "#06b6d4"
Set BorderRadius 12

Env PS1 "\033[36m$\033[0m "
Env FORCE_COLOR "1"

# Hidden setup
Hide
Type "cd /Users/chrisschofield/workspace/active/podflow && alias podflow='node dist/cli.js' && clear"
Enter
Sleep 1s
Show

# ── Show main help with ASCII logo ────────────────────────────────
Type "podflow --help"
Sleep 300ms
Enter
Sleep 4s

# ── Show digest command details ───────────────────────────────────
Type "podflow digest --help"
Sleep 300ms
Enter
Sleep 5s

# ── Hold ──────────────────────────────────────────────────────────
Sleep 2s
