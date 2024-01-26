function ExportData(allQuantities, allSelectedValues) {
  const gatherExportedData2 = () => {
    const data = { S:
      {label: '',
      Rs1: {
      }
    }


    };

    data.S.label = 'Num1';
    // Object.keys(allSelectedValues).forEach((key1) => {
    // });

    for (let i = 1; i < 8; i++) {
      data.S.Rs1['k' + (i-1)] = allQuantities[1];
    }

    const jsonData = JSON.stringify(data, null, 2);

    // Create a Blob from the JSON data
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Create a download link and trigger the download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exportedData.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <button className="export-button" onClick={gatherExportedData2}>
        Export Data
      </button>
    </div>
  );
}

export default ExportData;
