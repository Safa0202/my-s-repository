var getScriptPromisify = (src) => {
    return new Promise(resolve => {
        $.getScript(src, resolve)
    })
}

(function() {
    const prepared = document.createElement('template')
    prepared.innerHTML = `
        <style>
        </style>
        <div id="root3" style="width: 100%; height: 100%;">
        </div>
      `
    class SamplePrepared extends HTMLElement {
        constructor() {
            super()

            this._shadowRoot = this.attachShadow({ mode: 'open' })
            this._shadowRoot.appendChild(prepared.content.cloneNode(true))

            this._root = this._shadowRoot.getElementById('root3')

            this._props = {}

            this.render()
        }

        // onCustomWidgetResize(width, height) {
        //     this.render()
        // }

        async render() {
            await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.0.0/echarts.min.js')

            const xChart = echarts.init(this._root)
            // Generate data.
function makeData() {
  let data = [];
  for (let i = 0; i < 18; i++) {
    let cate = [];
    for (let j = 0; j < 100; j++) {
      cate.push(Math.random() * 200);
    }
    data.push(cate);
  }
  return data;
}
const data0 = makeData();
const data1 = makeData();
const data2 = makeData();
const option = {
  title: {
    text: 'Multiple Categories',
    left: 'center'
  },
  dataset: [
    {
      source: data0
    },
    {
      source: data1
    },
    {
      source: data2
    },
    {
      fromDatasetIndex: 0,
      transform: { type: 'boxplot' }
    },
    {
      fromDatasetIndex: 1,
      transform: { type: 'boxplot' }
    },
    {
      fromDatasetIndex: 2,
      transform: { type: 'boxplot' }
    }
  ],
  legend: {
    top: '10%'
  },
  tooltip: {
    trigger: 'item',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '10%',
    top: '20%',
    right: '10%',
    bottom: '15%'
  },
  xAxis: {
    type: 'category',
    boundaryGap: true,
    nameGap: 30,
    splitArea: {
      show: true
    },
    splitLine: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    name: 'Value',
    min: -400,
    max: 600,
    splitArea: {
      show: false
    }
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 20
    },
    {
      show: true,
      type: 'slider',
      top: '90%',
      xAxisIndex: [0],
      start: 0,
      end: 20
    }
  ],
  series: [
    {
      name: 'category0',
      type: 'boxplot',
      datasetIndex: 3
    },
    {
      name: 'category1',
      type: 'boxplot',
      datasetIndex: 4
    },
    {
      name: 'category2',
      type: 'boxplot',
      datasetIndex: 5
    }
  ]
};
                xChart.setOption(option);
            }, 200);

            // end paste
            // myChart.setOption(option)
        }
    }

    customElements.define('com-sap-sample-echarts-prepared3', SamplePrepared)
})()
