margins = {
  top: 70,
  bottom: 40,
  left: 30,
  width: 550
};

generate = function() {
  // var pdf = new jsPDF('p', 'pt', 'a4');
  //
  // specialElementHandlers = {
  //     // element with id of "bypass" - jQuery style selector
  //     '#subStandartOutput': function (element, renderer) {
  //         // true = "handled elsewhere, bypass text extraction"
  //         return true;
  //     }
  // };
  //
  // pdf.fromHTML(document.getElementById('ion-scroll-pdf'),
  //   margins.left,
  //   margins.top,
  //   {
  //     width: margins.width,
  //     elementHandlers: specialElementHandlers
  //   },
  //   function(dispose) {
  //     headerFooterFormatting(pdf, pdf.internal.getNumberOfPages());
  //   },
  //   margins);
  //
  // pdf.save("Test.pdf");

  html2canvas(document.getElementById('ion-scroll-pdf'), {
    onrendered: function(canvasObj) {
      var pdf = new jsPDF('p', 'pt', 'a4');
      var pdfConf = {
        pagesplit: true,
        backgroundColor: '#FFF',
        margin: {
          top: 70,
          bottom: 40,
          left: 30,
          width: 550
        }
      };

      pdf.internal.scaleFactor = 1.5;

      document.body.appendChild(canvasObj); //appendChild is required for html to add page in pdf

      pdf.addHTML(canvasObj, 0, 0, pdfConf, function() {
        document.body.removeChild(canvasObj);
        pdf.save('Test.pdf');
      });
    }
  });

  // var iframe = document.createElement('iframe');
  // iframe.setAttribute('style', 'position:absolute;right:0; top:0; bottom:0; height:100%; width:650px; padding:20px;');
  // document.body.appendChild(iframe);
  //
  // iframe.src = pdf.output('datauristring');
};

function headerFooterFormatting(doc, totalPages) {
  for (var i = totalPages; i >= 1; i--) {
    doc.setPage(i);

    header(doc);
    footer(doc, i, totalPages);

    doc.page++;
  }
}

function header(doc) {
  doc.fromHTML(
    "<div class=\"header\">" +
      "<div class=\"logo\"></div>" +
      "<div class=\"note-header fr fz-small\">HALAMAN INI BUKAN MERUPAKAN BAGIAN DARI KONTRAK ASURANSI</div>" +
      "<div class=\"clearfix\"></div>" +
    "</div>"
  );
}

// You could either use a function similar to this or pre convert an image with for example http://dopiaza.org/tools/datauri
// http://stackoverflow.com/questions/6150289/how-to-convert-image-into-base64-string-using-javascript
function imgToBase64(url, callback, imgVariable) {

  if (!window.FileReader) {
    callback(null);
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      imgVariable = reader.result.replace('text/xml', 'image/jpeg');
      callback(imgVariable);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.send();
}

function footer(doc, pageNumber, totalPages) {
  var str = "Page " + pageNumber + " of " + totalPages;

  doc.setFontSize(10);
  doc.text(str, margins.left, doc.internal.pageSize.height - 20);
}
