// import { useState } from 'react';
import { React } from 'react';

function StimulationSettings({rightElectrode, setRightElectrode, leftElectrode, setLeftElectrode, IPG, setIPG, allQuantities, setAllQuantities, allSelectedValues, setAllSelectedValues}) {
  // const [IPG, setIPG] = useState('');
  // const [leftElectrode, setLeftElectrode] = useState('');
  // const [rightElectrode, setRightElectrode] = useState('');

  const handleLeftElectrodeChange = (e) => {
    const selectedLeftElectrode = e.target.value;
    if (rightElectrode === "") {
      if (selectedLeftElectrode.includes('Boston')) {
        setIPG('Boston');
      } else if (selectedLeftElectrode.includes('Medtronic')) {
        setIPG('Medtronic_Percept');
      } else if (selectedLeftElectrode.includes('Abbott')) {
        setIPG('Abbott');
      }
    }
    setRightElectrode(selectedLeftElectrode);
    setLeftElectrode(selectedLeftElectrode);
    setAllQuantities({});
    setAllSelectedValues({});
    console.log('IPGselection: ', IPG);
  };

  const handleRightElectrodeChange = (e) => {
    const selectedRightElectrode = e.target.value;
    if (leftElectrode === "") {
      if (selectedRightElectrode.includes('Boston')) {
        setIPG('Boston');
      } else if (selectedRightElectrode.includes('Medtronic')) {
        setIPG('Medtronic_Percept');
      } else if (selectedRightElectrode.includes('Abbott')) {
        setIPG('Abbott');
      }
    }
    setRightElectrode(selectedRightElectrode);
    setAllQuantities({});
    setAllSelectedValues({});
  };

  const handleIPGChange = (e) => {
    const selectedIPG = e.target.value;
    setIPG(selectedIPG);
    setAllQuantities({});
    setAllSelectedValues({});
    console.log('selectedIPG: ', selectedIPG);
  };

  return (
    <div className="StimulationParameters">
      <h2>Choose Left Electrode</h2>
      <select
        value={leftElectrode}
        onChange={(e) => handleLeftElectrodeChange(e)}
      >
        <option value="">None</option>
        {/* <option value="BostonCartesia">Boston Scientific Cartesia</option> */}
        <option value="Medtronic3389">Medtronic 3389</option>
        <option value="Medtronic3387">Medtronic 3387</option>
        <option value="Medtronic3391">Medtronic 3391</option>
        <option value="MedtronicB33005">Medtronic B33005</option>
        <option value="BostonScientificVercise">Boston Scientific Vercise</option>
        <option value="BostonCartesiaTest">Boston Scientific Vercise Directed</option>
        <option value="NewBostonCartesiaTest">Boston Scientific Vercise Directed - Alternate</option>
        {/* <option value="BostonScientificCartesiaHX">Boston Scientific Vercise Cartesia HX</option> */}
        {/* <option value="Boston ScientificCartesiaX">Boston Scientific Vercise Cartesia X</option> */}
        <option value="AbbottActiveTip2">Abbott ActiveTip (2mm)</option>
        <option value="AbbottActiveTip3">Abbott ActiveTip (3mm)</option>
        <option value="AbbottDirected6172">Abbott Directed 6172</option>
        <option value="AbbottDirected6173">Abbott Directed 6173</option>
        {/* <option value="AbbottDirectedTest">Abbott Directed</option> */}
      </select>
      <h2>Choose Right Electrode</h2>
      <select
        value={rightElectrode}
        onChange={(e) => handleRightElectrodeChange(e)}
      >
        <option value="">None</option>
        <option value="Medtronic3389">Medtronic 3389</option>
        <option value="Medtronic3387">Medtronic 3387</option>
        <option value="Medtronic3391">Medtronic 3391</option>
        <option value="MedtronicB33005">Medtronic B33005</option>
        <option value="BostonScientificVercise">Boston Scientific Vercise</option>
        <option value="BostonCartesiaTest">Boston Scientific Vercise Directed</option>
        <option value="NewBostonCartesiaTest">Boston Scientific Vercise Directed - Alternate</option>
        {/* <option value="BostonScientificCartesiaHX">Boston Scientific Vercise Cartesia HX</option> */}
        {/* <option value="Boston ScientificCartesiaX">Boston Scientific Vercise Cartesia X</option> */}
        <option value="AbbottActiveTip2">Abbott ActiveTip (2mm)</option>
        <option value="AbbottActiveTip3">Abbott ActiveTip (3mm)</option>
        <option value="AbbottDirected6172">Abbott Directed 6172</option>
        <option value="AbbottDirected6173">Abbott Directed 6173</option>
      </select>

      <h2>Choose IPG</h2>
      <select value={IPG} onChange={(e) => handleIPGChange(e)}>
        <option value="">None</option>
        <option value="Abbott">Abbott (Infinity, Brio, Libra)</option>
        <option value="Boston">
          Boston Scientific (Vercise, Genus, Gevia)
        </option>
        <option value="Medtronic_Activa">Medtronic Activa</option>
        <option value="Medtronic_Percept">Medtronic Percept</option>
      </select>
    </div>
  );
}

export default StimulationSettings;
