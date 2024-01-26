// import React, { Component } from 'react';

// class JsonLoaderComponent extends Component {
//   constructor() {
//     super();
//     this.state = {
//       jsonData: null,
//     };
//   }

//   handleFileInputChange = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onload = (event) => {
//       const jsonData = JSON.parse(event.target.result);
//       this.setState({ jsonData });
//     };

//     reader.readAsText(file);
//   };

//   render() {
//     const { jsonData } = this.state;

//     // Render a file input and display JSON data
//     return (
//       <div>
//         <input type="file" onChange={this.handleFileInputChange} />
//         {jsonData ? (
//           <pre>{JSON.stringify(jsonData, null, 2)}</pre>
//         ) : (
//           <div>No JSON data loaded</div>
//         )}
//       </div>
//     );
//   }
// }

// export default JsonLoaderComponent;

import React, { Component } from 'react';

class JsonLoaderComponent extends Component {
  constructor() {
    super();
    this.state = {
      jsonData: null,
    };
  }

  handleFileInputChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const jsonData = JSON.parse(event.target.result);
      this.setState({ jsonData });
    };

    reader.readAsText(file);
  }

  render() {
    const { jsonData } = this.state;

    // Access k5.perc
    const k5Perc = jsonData?.Rs1?.k5?.perc;

    return (
      <div>
        <input type="file" onChange={this.handleFileInputChange} />
        {jsonData ? (
          <div>
            <pre>{JSON.stringify(jsonData, null, 2)}</pre>
            <h2>Accessed Value (k5.perc):</h2>
            <p>k5.perc: {k5Perc}</p>
          </div>
        ) : (
          <div>No JSON data loaded</div>
        )}
      </div>
    );
  }
}

export default JsonLoaderComponent;



