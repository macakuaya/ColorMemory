#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import time
from pathlib import Path

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def do_GET(self):
        if self.path == '/reload':
            self.send_response(200)
            self.send_header('Content-type', 'text/event-stream')
            self.send_header('Cache-Control', 'no-cache')
            self.send_header('Connection', 'keep-alive')
            self.end_headers()
            # Send a simple message
            self.wfile.write(b'data: reload\n\n')
            return
        return super().do_GET()

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🚀 Server running at http://localhost:{PORT}/")
        print("📝 Open http://localhost:8000 in your browser")
        print("🔄 Auto-reload is enabled - changes will refresh automatically")
        print("⏹️  Press Ctrl+C to stop the server")
        
        # Automatically open browser
        webbrowser.open(f'http://localhost:{PORT}/')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Server stopped")

if __name__ == "__main__":
    main()
