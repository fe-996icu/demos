window.onload = function () {
    var spread = new GC.Spread.Sheets.Workbook(document.getElementById("ss"), {calcOnDemand: true});
    // spread.fromJSON(jsonData);
    var excelIo = new GC.Spread.Excel.IO();
    var sheet = spread.getActiveSheet();
    document.getElementById('loadExcel').onclick = function () {
        var excelFile = document.getElementById("fileDemo").files[0];
        var password = document.getElementById('password').value;
        // here is excel IO API
        excelIo.open(excelFile, function (json) {
            var workbookObj = json;
            spread.fromJSON(workbookObj);
        }, function (e) {
            // process error
            alert(e.errorMessage);
            if (e.errorCode === 2/*noPassword*/ || e.errorCode === 3 /*invalidPassword*/) {
                document.getElementById('password').onselect = null;
            }
        }, {password: password});
    };
    document.getElementById('saveExcel').onclick = function () {

        var fileName = document.getElementById('exportFileName').value;
        var password = document.getElementById('password').value;
        if (fileName.substr(-5, 5) !== '.xlsx') {
            fileName += '.xlsx';
        }

        var json = spread.toJSON();

        // here is excel IO API
        excelIo.save(json, function (blob) {
			console.log(blob);
			// saveAs(blob, fileName);
			window.open(URL.createObjectURL(blob));

			var file = new File([blob], '文件名.xlsx', {
				type: blob.type,
			});

			console.log(file);
        }, function (e) {
            // process error
            console.log(e);
        }, {password: password});

    };
};
