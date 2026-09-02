import subprocess
import os
import sys

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
    
    res = subprocess.run(["powershell", "-NoProfile", "-Command", ps_cmd], capture_output=True, text=True, timeout=30)
    print("STDOUT:", res.stdout)
    print("STDERR:", res.stderr)
    return os.path.exists(pdf_abs)

if __name__ == '__main__':
    test_pdf = os.path.join('scratch', 'native_test.pdf')
    success = convert_docx_to_pdf('Insurance-Template.docx', test_pdf)
    print("Success:", success, "File size:", os.path.getsize(test_pdf) if success else 0)
