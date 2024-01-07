import logo from './logo.svg';
import './App.css';
import { Button, Select, Space, Table, message } from 'antd';
import { useState } from 'react';
const organiser = require("./jsonlist/organiser.json")
const places = require("./jsonlist/places.json")

function App() {

  const [filteredorganiserList, setFilterOrganiserList] = useState(organiser)
  const [filteredPlacesList, setFilteredPlacesList] = useState(places)
  const [assignedList, setAssignedList] = useState([])

  const handleOrganiserChange = (e, item, inx) => {

    let temp = [...filteredPlacesList]
    let updatePlace = temp.map((data, index) => {

      if (index == inx) {
        return { ...data, selectedOrganiser: e, selectedOrganiserName: item }
      }
      return data
    })

    let tempOrg = [...filteredorganiserList]
    let updateorganiser = tempOrg.map((data, index) => {
      if (e.includes(data.value)) {
        return { ...data, disabled: true }
      }
      return data
    })
    setFilteredPlacesList(updatePlace)
    setFilterOrganiserList(updateorganiser)
  }

  const handleSubmit = (e) => {
    setAssignedList([...filteredPlacesList])
  }

  const handleCopyToClipboard = () => {
    const tableText = filteredPlacesList
      .map((item) => {
        const organiserNames = item.selectedOrganiserName
          .map((organiser) => organiser.label)
          .join(', ');

        return `${item.label}\t - ${organiserNames || 'Not allocated.'}`;
      })
      .join('\n');

    if (tableText) {
      navigator.clipboard.writeText(tableText);
      message.success('Table data copied to clipboard!');
    } else {
      message.warning('No table data to copy!');
    }
  };

  const handleReset = () => {
    setFilteredPlacesList(places)
  }

  return (
    <div style={{ padding: "30px" }}>
      <div >

        <div >
          {filteredPlacesList.map((data, inx) => {
            return <div key={inx} style={{ marginRight: "10px", display: "flex" }}>
              <div style={{ marginLeft: "10px", marginTop: "10px" }}>
                <span>{data?.label}</span>
              </div>
              <div style={{ marginLeft: "10px", marginTop: "10px" }}>
                <Select
                  mode="multiple"
                  // allowClear
                  style={{ width: 200 }}
                  placeholder="Please select Organiser Name"
                  value={data?.selectedOrganiser}
                  onChange={(e, data) => handleOrganiserChange(e, data, inx)}
                  options={filteredorganiserList}
                />
              </div>
            </div>
          })}
        </div>

        <div style={{ marginTop: "20px",display:"flex" }}>
          <Button style={{marginRight:"10px"}}onClick={(e) => handleSubmit(e)}>Generate</Button>
          <Button onClick={(e) => handleReset(e)} >Reset</Button>
        </div>
      </div>
      <div>
        <div>
          <label style={{ fontWeight: "bold", marginTop: "20px" }}>Place - Organiser List</label>
          <Button onClick={handleCopyToClipboard} style={{ marginLeft: "10px" }}>Copy </Button>
        </div>
        {
          assignedList
            .filter((data) => data.selectedOrganiserName.length > 0)
            .map((data) => {
              return (
                <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }} key={data.label}>
                  <div >{data.label}<span> - </span></div>
                  <div >
                    {data.selectedOrganiserName.map((item, index, array) => (
                      <span key={item.label}>
                        {item.label}
                        {index < array.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
        }

      </div>

    </div>
  );
}

export default App;
