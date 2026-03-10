function fmt(cmd) {
      document.getElementById('letterBody').focus();
      document.execCommand(cmd, false, null);
    }

    function align(dir) {
      document.getElementById('letterBody').focus();
      document.execCommand('justify' + dir.charAt(0).toUpperCase() + dir.slice(1), false, null);
    }

    function applyFont(val) {
      document.getElementById('letterBody').style.fontFamily = val;
    }

    function applySize(val) {
      document.getElementById('letterBody').style.fontSize = val + 'px';
    }

    function applyColor(color, el) {
      document.getElementById('letterBody').focus();
      document.execCommand('foreColor', false, color);
      document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
      el.classList.add('active');
    }

    function updateWordCount() {
      const text = document.getElementById('letterBody').innerText.trim();
      const words = text ? text.split(/\s+/).length : 0;
      document.getElementById('wordCount').textContent = words + (words === 1 ? ' word' : ' words');
    }

    function clearLetter() {
      if (!confirm('Clear the entire letter?')) return;
      ['letterDate', 'letterTo', 'letterSign', 'letterName'].forEach(id => {
        document.getElementById(id).value = '';
      });
      document.getElementById('letterBody').innerHTML = '';
      updateWordCount();
    }

    async function exportPDF() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: 'pt', format: 'letter' });

      const margin = 72;
      const pageW  = doc.internal.pageSize.getWidth();
      const pageH  = doc.internal.pageSize.getHeight();
      const contentW = pageW - margin * 2;
      let y = margin;

      function addText(text, opts = {}) {
        if (!text) return;
        const { size = 12, style = 'normal', color = [0,0,0], gap = 8 } = opts;
        doc.setFontSize(size);
        doc.setFont('Times', style);
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text, contentW);
        lines.forEach(line => {
          if (y + size + 4 > pageH - margin) { doc.addPage(); y = margin; }
          doc.text(line, margin, y);
          y += size * 1.6;
        });
        y += gap;
      }

      const date = document.getElementById('letterDate').value.trim();
      const to   = document.getElementById('letterTo').value.trim();
      const body = document.getElementById('letterBody').innerText.trim();
      const sign = document.getElementById('letterSign').value.trim();
      const name = document.getElementById('letterName').value.trim();

      if (date) addText(date, { style: 'italic', gap: 20 });
      if (to)   addText(to,  { gap: 16 });
      if (body) {
        body.split(/\n+/).forEach(p => {
          if (p.trim()) addText(p.trim(), { gap: 6 });
          else y += 10;
        });
      }
      y += 16;
      if (sign) addText(sign, { style: 'italic', gap: 4 });
      if (name) addText(name, { size: 14, style: 'bold', gap: 0 });

      doc.save('letter.pdf');
    }

    document.getElementById('letterDate').value =
      new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });