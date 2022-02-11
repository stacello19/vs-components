import React, { useState } from 'react';
import Bar from './components/bar';
import StackBar from './components/bar/stackBar';
import Pie from './components/pie';
import Donut from './components/pie/donut';
import InteractivePie from './components/pie/interactivePie';
import AreaLine from './components/line/area';
import Heatmap from './components/heatmap';
import './App.css';

const data = [{type: 'a', value: 200}, {type:'b', value: 300}, {type:'c', value: 100}, {type: 'a', value: 50}];
const data2 = [{drink: 'Water', value: 5000}, {drink: 'Coke', value: 2550}, {drink:'Juice', value: 1000}, {drink: 'Sprite', value: 1500}, {drink: 'Coffee', value: 6000}];

const pie1 = [{type: 'a', value: 400}, {type:'b', value: 110}, {type:'c', value: 1000}, {type: 'a', value: 500}];
const pie2 = [{type: 'a', value: 200}, {type:'b', value: 300}, {type:'c', value: 100}, {type: 'a', value: 50}];

const barData = [{"risk_class": "MR", "SUM(risk_dist_per)": 39.38167062435006}, {"risk_class": "LR", "SUM(risk_dist_per)": 34.950715245783954}, {"risk_class": "VLR", "SUM(risk_dist_per)": 4.442875126405763}, {"risk_class": "HR", "SUM(risk_dist_per)": 0.937668620369216}];

function App() {
  const [pieIntData, setPieIntData] = useState([...pie1])
  return (
    <div className="App">
      <div className='row-wrapper'>
        <div>
          <h3>Pie</h3>
          <Pie 
            data={data} 
            dataKey='type' 
            value='value'
          />
        </div>
        <div>
          <h3>Donut</h3>
          <Donut 
            margin={70}
            data={data2}
            width={450}
            height={450} 
            donut={{show: true, innerRadius: 60}} 
            dataKey='drink' 
            value='value' 
            colorType='Color-3'
            tooltip={{ show: true, text: 'Human is consuming %drink% %value%ml a day'}}
            text={{ show: true, textAnchor: 'middle', location: 'outside', showLine: true}}
          />
        </div>
        <div>
          <h3>Interactive Pie</h3>
          <div>
            <button onClick={() => setPieIntData(pie1)}>Data 1</button>
            <button onClick={() => setPieIntData(pie2)}>Data 2</button>
          </div>
          <InteractivePie
            data={pieIntData} 
            width={400} 
            height={400}
            dataKey='type' 
            value='value'
          />
        </div>
      </div>
      <div className='row-wrapper'>
        <div>
          <h3>Bar</h3>
          <Bar
            data={barData}
            domain={['VLR', 'LR', 'MR', 'HR', 'VHR']}
            margin={{top: 100, bottom: 100, right: 80, left: 100}}
            yAxis={'risk_class'}
            xAxis={'SUM(risk_dist_per)'}
            barType={'horizontal'}
            barColor={'#FF6633'}
            text={{angle: 'tilted', anchor: 'end' }} // angle: center or tilted , anchor: start&center&end
            label={{show: true, yLabel: 'SUM(Risk Distribution Perc)', xLabel: 'Risk Class'}}
            grid={{xLine: true, yLine: false}}
            line={{show: true }}
            info={{
              show: true, 
              showHover: true, 
              location: 'outside', 
              text: `value?`, 
              hoverText: '%SUM(risk_dist_per)% %'
            }}
            tooltip={{show: false, text: `
              <div>
                <div>%SUM(risk_dist_per)% %</div>
                <div class='tooltip-line'></div>
                <div>This is %risk_class% class</div>
              </div>
              `
            }}
          />
        </div>
        <div>
          <h3>Stack Bar</h3>
          <StackBar />
        </div>
        <div>
          <h3>Line Area</h3>
          <AreaLine/>
        </div>
      </div>
      <div className='row-wrapper'>
        <div>
          <h3>Heatmap</h3>
          <Heatmap />
        </div>
      </div>
    </div>
  );
}

export default App;
