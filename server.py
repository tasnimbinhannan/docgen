import http.server
import socketserver
import os
import sys
import json
import uuid
import subprocess
import shutil

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def convert_docx_to_pdf(docx_path, pdf_path):
    docx_abs = os.path.abspath(docx_path).replace("'", "''")
    pdf_abs = os.path.abspath(pdf_path).replace("'", "''")
    
    os.makedirs(os.path.dirname(pdf_abs), exist_ok=True)
    
    ps_cmd = f"""
    $ErrorActionPreference = 'Stop'
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    try {{
        $doc = $word.Documents.Open('{docx_abs}')
        $doc.ExportAsFixedFormat('{pdf_abs}', 17)
        $doc.Close([ref]$false)
        Write-Output 'SUCCESS'
    }} finally {{
        $word.Quit()
    }}
    """
    
    res = subprocess.run(["powershell", "-NoProfile", "-Command", ps_cmd], capture_output=True, text=True, timeout=45)
    return os.path.exists(pdf_abs)

class DocumentAppHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        if self.path == '/api/status':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "active", "engine": "Word.Application (Native)"}).encode('utf-8'))
            return
        return super().do_GET()

    def do_POST(self):
        if self.path == '/api/convert-docx-to-pdf':
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(content_length)
                
                temp_id = str(uuid.uuid4())
                temp_dir = os.path.join(DIRECTORY, 'scratch', 'temp_' + temp_id)
                os.makedirs(temp_dir, exist_ok=True)
                
                docx_path = os.path.join(temp_dir, 'input.docx')
                pdf_path = os.path.join(temp_dir, 'output.pdf')
                
                with open(docx_path, 'wb') as f:
                    f.write(body)
                
                success = convert_docx_to_pdf(docx_path, pdf_path)
                
                if success and os.path.exists(pdf_path):
                    with open(pdf_path, 'rb') as f:
                        pdf_data = f.read()
                    
                    # Clean up
                    try:
                        shutil.rmtree(temp_dir, ignore_errors=True)
                    except:
                        pass

                    self.send_response(200)
                    self.send_header('Content-Type', 'application/pdf')
                    self.send_header('Content-Disposition', 'attachment; filename="Insurance_Certificate.pdf"')
                    self.send_header('Content-Length', str(len(pdf_data)))
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(pdf_data)
                    return
                else:
                    self.send_response(500)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Word conversion failed."}).encode('utf-8'))
                    return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
                return

        return super().do_POST()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def run_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), DocumentAppHandler) as httpd:
        print(f"DocuGen server running at http://localhost:{PORT}")
        httpd.serve_forever()

if __name__ == '__main__':
    run_server()
