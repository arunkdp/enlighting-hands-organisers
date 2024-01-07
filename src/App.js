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

  const handlePlaceChange = (e, data, inx) => {

    let temp = [...filteredPlacesList]
    const selectedIndex = temp.findIndex(obj => obj.value == e);

    let updatedPlaces = temp.map((item, index) => {
      if (index === inx && index == selectedIndex) {
        return {
          ...item,
          selectedPlace: e,
          disabled: item.value == e,
        };
      }
      return item
    });

    setFilteredPlacesList(updatedPlaces)

  };

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

  return (
    <div style={{ padding: "30px" }}>
      <div >
        <div >
          {filteredPlacesList.map((data, inx) => {
            return <div key={inx} style={{ marginRight: "10px", display: "flex" }}>
              <div style={{ marginLeft: "10px", marginTop: "10px" }}>
                <Select
                  style={{
                    width: 200,
                  }}
                  value={data?.value}
                  onChange={(e) => handlePlaceChange(e, data, inx)}
                  options={filteredPlacesList}
                  disabled={true}
                />
              </div>
              <div style={{ marginLeft: "10px", marginTop: "10px" }}>
                <Select
                  mode="multiple"
                  // allowClear
                  style={{ width: 400 }}
                  placeholder="Please select Organiser Name"
                  value={data?.selectedOrganiser}
                  onChange={(e, data) => handleOrganiserChange(e, data, inx)}
                  options={filteredorganiserList}
                />
              </div>
            </div>
          })}
        </div>

        <div style={{ marginTop: "20px" }}>
          <Button onClick={(e) => handleSubmit(e)}>Add</Button>

        </div>
      </div>
      <div>
        <div>
          <label style={{ fontWeight: "bold", marginTop: "20px" }}>Place - Organiser List</label>
          <Button onClick={handleCopyToClipboard} style={{ marginLeft: "10px" }}>Copy </Button>
        </div>
        {
          assignedList.map((data) => {
            console.log("datas", data);
            return (
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ marginRight: '10px' }}>{data.label}</div>
                <div style={{ marginTop: "10px" }}>
                  {data?.selectedOrganiserName.length > 0 ? (
                    <div style={{ marginLeft: "10px", marginTop: "10px" }}>
                      {data?.selectedOrganiserName?.map((item) => (
                        <div>-{item.label}</div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ marginLeft: "10px", marginTop: "10px" }}>-Not Allocated</div>
                  )}
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
