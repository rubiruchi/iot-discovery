import React, { Component } from 'react';
// import StackedBarChart from './components/StackedBarChart'
import SimpleBarChart from './components/SimpleBarChart'
import SimpleLineChart from './components/SimpleLineChart'
// import LineChart from './components/LineChart'

import './App.css';

const dsrPortFlows = [
  {
    name: 'DNS', 'IOT': 3000, 'NON-IOT': 2400,
  },
  {
    name: 'HTTP', 'IOT': 3000, 'NON-IOT': 1398,
  },
  {
    name: 'HTTPS', 'IOT': 2000, 'NON-IOT': 9800,
  },
  {
    name: 'NTP', 'IOT': 2780, 'NON-IOT': 3908,
  },
  {
    name: 'DHCP', 'IOT': 1890, 'NON-IOT': 4800,
  },
];

const srcPortFlows = [
  {
    name: '1992', 'IOT': 2800, 'NON-IOT': 2400,
  },
  {
    name: '663', 'IOT': 3000, 'NON-IOT': 4000,
  },
  {
    name: '111', 'IOT': 1200, 'NON-IOT': 2500,
  },
  {
    name: '123', 'IOT': 2780, 'NON-IOT': 1398,
  },
  {
    name: '32132', 'IOT': 1900, 'NON-IOT': 3500,
  },
];



const networkProtocolFlows = [
  {
    name: 'IPv4', 'IOT': 4000, 'NON-IOT': 2400
  },
  {
    name: 'IPv6', 'IOT': 3000, 'NON-IOT': 1398
  },
];

const transportProtocolFlows = [
  {
    name: 'TCP', 'IOT': 2000, 'NON-IOT': 2050
  },
  {
    name: 'UDP', 'IOT': 1500, 'NON-IOT': 700
  },
];

const iotFlows = [
  {
    name: 'TCP', 'IOT': 2000
  },
  {
    name: 'UDP', 'IOT': 1500
  },
]

const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];
class App extends Component {
  state = {
    statistic: null,
    flowTimeSerieData: [],
    bytesTimeSerieData: [],
    packetTimeSerieData: [],
    deviceTimeSerieData: [],
  }

  componentDidMount() {
    this.loadData()
  }

  formatDate(date) {
    // return `${date.getHours()}:00`
    return `${date.getHours()}:00  ${date.getDate()} ${monthNames[date.getMonth()]}`
  }



  async loadData() {
    const response = await fetch("http://localhost:8000/flow/time-series")
    const data = await response.json()

    const flowTimeSerieData = data.map(d => {
      return {
        name: this.formatDate(new Date(d._id)),
        iot: d.count_iot,
        "non-iot": d.count_non_iot,
      }
    })

    const bytesTimeSerieData = data.map(d => {
      return {
        name: this.formatDate(new Date(d._id)),
        iot: d.iot_bytes / (1000 * 1000),
        "non-iot": d.non_iot_bytes / (1000 * 1000),
      }
    })

    const packetTimeSerieData = data.map(d => {
      return {
        name: this.formatDate(new Date(d._id)),
        iot: d.iot_packets,
        "non-iot": d.non_iot_packets,
      }
    })

    const responseStat = await fetch("http://localhost:8000/flow/stat")
    const jsonStat = await responseStat.json()

    const deviceTimeSerieData = jsonStat.devices.map(device => {
      return {
        name: device._id,
        count: device.count
      }
    })


    console.log(deviceTimeSerieData)

    this.setState({
      statistic: {
        ...jsonStat,
        devices: undefined
      },
      flowTimeSerieData,
      bytesTimeSerieData,
      packetTimeSerieData,
      deviceTimeSerieData,
    })
  }

  getStatisticByKey = key => this.state.statistic !== null ? this.state.statistic[key] : ""

  render() {
    return (
      <div className="main-container">
        <p className="main-title">Analytics Overview</p>
        <div className="card-container">
          <div className="card">
            <div>
              <p className="card-title">{this.getStatisticByKey("flow_count")}</p>
              <p className="card-sub-title">Total Flows</p>
            </div>
          </div>
          <div className="card">
            <div>
              <p className="card-title">{this.getStatisticByKey("classify_iot")}</p>
              <p className="card-sub-title">Total IOT Flows</p>
            </div>
          </div>
          <div className="card">
            <div>
              <p className="card-title">{this.getStatisticByKey("classify_not_iot")}</p>
              <p className="card-sub-title">Total NON-IOT Flows</p>
            </div>
          </div>
          <div className="card">
            <div>
              <p className="card-title">{this.getStatisticByKey("iot_ip_count")}</p>
              <p className="card-sub-title">Total IOT IP Address</p>
            </div>
          </div>

          <div className="card">
            <div>
              <p className="card-title">{this.getStatisticByKey("non_iot_ip_count")}</p>
              <p className="card-sub-title">Total NON-IOT IP Address</p>
            </div>
          </div>
          <div className="card">
            <div>
              <p className="card-title">{this.getStatisticByKey("device_count")}</p>
              <p className="card-sub-title">IOT Devices Detected</p>
            </div>
          </div>
        </div>
        <div className="chart-container">
          <p className="main-title" >IOT & NON-IOT Flows</p>
          {
            this.state.flowTimeSerieData.length > 0 && (
              <SimpleLineChart
                width={1200}
                height={300}
                data={this.state.flowTimeSerieData}
                yLabel="flow count"
                keys={[
                  {
                    name: "iot",
                    color: "#806cfa",
                  },
                  {
                    name: "non-iot",
                    color: "#ffcc00"
                  }
                ]}
              />
            )
          }
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          < div className="chart-container" style={{ width: '580px' }}>
            <p className="main-title">IOT & NON-IOT Packets</p>
            {
              this.state.packetTimeSerieData.length > 0 && (
                <SimpleLineChart
                  width={580}
                  height={300}
                  data={this.state.packetTimeSerieData}
                  yLabel="packet count"
                  keys={[
                    {
                      name: "iot",
                      color: "#806cfa",
                    },
                    {
                      name: "non-iot",
                      color: "#f1c40f"
                    }
                  ]}
                />
              )
            }
          </div>
          <div className="chart-container" style={{ width: '580px' }}>
            <p className="main-title">IOT & NON-IOT Bytes</p>
            {
              this.state.bytesTimeSerieData.length > 0 && (
                <SimpleLineChart
                  width={580}
                  height={300}
                  data={this.state.bytesTimeSerieData}
                  yLabel="MB"
                  keys={[
                    {
                      name: "iot",
                      color: "#806cfa",
                    },
                    {
                      name: "non-iot",
                      color: "#eebb2d"
                    }
                  ]}
                />
              )
            }
          </div>
        </div >
        <div className="chart-container">
          <p className="main-title">Device Flows</p>
          {
            this.state.deviceTimeSerieData.length > 0 && (
              <SimpleBarChart
                data={this.state.deviceTimeSerieData}
                yLabel="flow count"
              />
            )
          }
        </div>
      </div >
    );
  }
}

export default App;
