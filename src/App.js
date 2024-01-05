import logo from './logo.svg';
import './App.css';
import { Button, Select, Space, Table, message } from 'antd';
import { useState } from 'react';
const organiser = require("./jsonlist/organiser.json")
const places = require("./jsonlist/places.json")

function App() {
  const [organiserList, setOrganiserList] = useState(organiser);
  const [placesList, setPlacesList] = useState(places)
  const [filteredorganiserList, setFilterOrganiserList] = useState(organiser)
  const [filteredPlacesList, setFilteredPlacesList] = useState(places)
  const [assignedList, setAssignedList] = useState([])
  const [selectedPlace, setSelectdPlace] = useState({})
  const [selectedOrganiser, setSelectedOrganiser] = useState([])
  const [selectedorganiserIds, setSelectedOrganiserIds] = useState([])


  const getSelectedPlaceList = (id) => {
    return filteredPlacesList.find(data => data.value === id)
  }

  const getNonSelectedPlaceList = (id) => {
    return filteredPlacesList.filter(data => data.value !== id)
  }
  const handlePlaceChange = (e) => {
    let list = getSelectedPlaceList(e)
    setSelectdPlace(list)
  }

  const handleOrganiserChange = (e, data) => {
    // let list = filterList(e)
    setSelectedOrganiser(data)
    setSelectedOrganiserIds(e)
  }

  const handleSubmit = (e) => {

    if (selectedorganiserIds.length > 0 && Object.keys(selectedPlace).length > 0) {
      let placeLists = getNonSelectedPlaceList(selectedPlace.value)
      let updatePlaceinorganiserList = selectedOrganiser.map((data) => {
        return { ...data, place: selectedPlace?.label, placeId: selectedPlace?.value }
      })

      let List = organiserList.map((data => {
        if (selectedorganiserIds.includes(data.value)) {
          return { ...data, disabled: true }
        }
        return data
      }))

      setOrganiserList(List)
      setFilteredPlacesList(placeLists)
      setAssignedList([...assignedList, ...updatePlaceinorganiserList])
      setSelectedOrganiser([])
      setSelectedOrganiserIds([])
      setSelectdPlace({})
    }

  }

  const columns = [
    {
      title: 'organiser',
      dataIndex: 'label',
      key: 'label',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Place',
      dataIndex: 'place',
      key: 'place',
    },
  ]

  const handleCopyToClipboard = () => {
    const tableText = assignedList
      .map((item) => `${item.label}\t - ${item.place}`)
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
      <div>
        <div>
        <label>Place: </label>
        <Select
          style={{
            width: "100%",
          }}
          value={Object.keys(selectedPlace).length > 0 ? selectedPlace?.value : undefined}
          onChange={handlePlaceChange}
          options={filteredPlacesList}
        />
        </div>
        <div style={{marginTop: "10px" }}>
        <label >Organiser: </label>
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%'}}
          placeholder="Please select"
          value={selectedorganiserIds}
          // defaultValue={['a10', 'c12']}
          onChange={(e, data) => handleOrganiserChange(e, data)}
          options={organiserList}
        />
        </div>
        <div style={{ marginTop: "20px" }}>
          <Button onClick={(e) => handleSubmit(e)}>Add</Button>

        </div>
      </div>
      <div>

        <Button onClick={handleCopyToClipboard} style={{ float: "right", marginBottom: "4px" }}>Copy </Button>
        <label style={{ fontWeight: "bold", marginTop: "20px" }}>Organiser - place List</label>
        <Table columns={columns} dataSource={assignedList}></Table>
      </div>

    </div>
  );
}

export default App;
