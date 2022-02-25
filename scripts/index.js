$(function() {
    $('#divBtnGroup').hide();

    const defSQLType = getDefaultParam('sqlType');
    const defIndent = getDefaultParam('indent');

    if(defSQLType !== null) $('#ddlSQLType').val(defSQLType);
    if(defIndent !== null) {
        if(defIndent === 'tabs') {
            $('#numSpaces').hide();
            $('#rbIndentTabs').prop('checked', true);
        }
        else if(defIndent === 'spaces') {
            $('#rbIndentSpaces').prop('checked', true);

            const defSpaces = getDefaultParam('spaces');
            if(defSpaces !== null) $('#txtNumSpaces').val(defSpaces);
        }
    }
    else {
        $('#numSpaces').hide();
    }

    $('input[name="rbIndent"]').on('click', function() {
        if ($(this).val() === 'spaces') $('#numSpaces').show();
        else $('#numSpaces').hide();
    });

    function getDefaultParam(cname) {
        let name = cname + '=';
        let ca = document.cookie.split(';');

        for(let i=0; i <ca.length; i++) {
            let c = ca[i];
            while(c.charAt(0) == ' ') c = c.substring(1);
            if(c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return null;
    }

    function setDefaultParam(cname, cvalue) {
        const currVal = getDefaultParam(cname);
        if(currVal !== null && currVal === cvalue) return;

        const exdays = 7;
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires="+d.toUTCString();
        document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
    }

    function saveAsToFile(filename, text) {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
   }

   function uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    // Format
    $('input[name="btnFormat"]').on('click', function() {
        // Get Input Parameter
        let sql = document.getElementById('txtQuery').value;
        let sqlType = document.getElementById('ddlSQLType').value;
        let indentBy = document.querySelector('input[name="rbIndent"]:checked').value;

        // Validate Input Parameter
        sqlType = sqlType.trim();
        indentBy = indentBy.trim();

        if(sql.trim() === '') return alert('Please input query');
        if(sqlType === '') return alert('Please select query type');
        if(indentBy === '') return alert('Please select indent by');

        let numSpaces = 4;
        if(indentBy === 'spaces') {
            numSpaces = document.getElementById('txtNumSpaces').value;
            if(numSpaces<1 || numSpaces>8) return alert('Indent spaces must between 1 to 8');
            setDefaultParam('spaces', numSpaces);
        }
        else {
            window.localStorage.removeItem('spaces');
        }
        
        // Set Default Param
        setDefaultParam('sqlType', sqlType);
        setDefaultParam('indent', indentBy);

        // Call SQL Formatter
        const isDebug = false;
        const formatter = new SQLFormatter(sqlType, isDebug);
        const formattedSql = formatter.format(sql, indentBy, numSpaces);
        document.getElementById('txtFormattedSQL').value = formattedSql;

        // Show Button Copy to Clipboard
        $('#divBtnGroup').show();
    });

    // Copy to Clipboard
    $('button[id="btnCopy"]').on('click', function() {
        const txtFormattedSQL = document.getElementById('txtFormattedSQL');
        const formattedSQL = txtFormattedSQL.value;
        if(formattedSQL.trim() === '') return alert('Empty formatted sql');

        txtFormattedSQL.select();
        txtFormattedSQL.setSelectionRange(0, 99999);

        navigator.clipboard.writeText(formattedSQL);
    });

    // Download Formatted SQL to File
    $('button[id="btnDownload"]').on('click', function() {
        // Validate File Extension
        let fileExt = document.getElementById('ddlFileExt').value;
        fileExt = fileExt.trim();
        if(fileExt === '') return alert('Please select file extension (sql/txt)');
        if(fileExt !== 'sql' && fileExt !== 'txt') return alert('Please select valid file extension');

        // Validate Formatted SQL
        const formattedSQL = document.getElementById('txtFormattedSQL').value
        if(formattedSQL.trim() === '') return alert('Empty formatted sql');

        // Get Download Datetime
        const downloadDttm = new Date();
        const year = downloadDttm.getFullYear();
        let month = '' + downloadDttm.getMonth();
        let day = '' + downloadDttm.getDate();

        let hour = '' + downloadDttm.getHours();
        let minutes = '' + downloadDttm.getMinutes();
        let seconds = '' + downloadDttm.getSeconds();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        if (hour.length < 2) hour = '0' + hour;
        if (minutes.length < 2) minutes = '0' + minutes;
        if (seconds.length < 2) seconds = '0' + seconds;

        const formatedDownloadDttm = year + month + day + '_' + hour + minutes + seconds;

        // Get UUID
        const uuid = uuidv4();
        
        // Prepare to Download
        const formatter = new SQLFormatter('sqlType');
        const headerFile = formatter.getTemplate();
        const fileContent = headerFile + formattedSQL;
        const filename = 'SQLFormatter-' + formatedDownloadDttm + '-' + uuid + '.' + fileExt;

        // Download File
        saveAsToFile(filename, fileContent);
    });
});
