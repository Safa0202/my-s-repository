var getScriptPromisify = (src) => {
  return new Promise(resolve => {
    $.getScript(src, resolve)
  })
}

(function () {
  const prepared = document.createElement('template')
  prepared.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `
  class SampleRingKpi extends HTMLElement {
    constructor () {
      super()

      this._shadowRoot = this.attachShadow({ mode: 'open' })
      this._shadowRoot.appendChild(prepared.content.cloneNode(true))

      this._root = this._shadowRoot.getElementById('root')

      this._props = {}

      this.render()
    }

    onCustomWidgetResize (width, height) {
      this.render()
    }

    /*set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      this.render();
    }*/





    async render () {
      await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.0.0/echarts.min.js')
    
      const myChart = echarts.init(this._root, 'wight')
      const gaugeData = [
        {
          value: 20,
          name: 'Customer Expectation',
          title: {
            offsetCenter: ['-0%', '-115%']
          },
          detail: {
            valueAnimation: true,
            offsetCenter: ['0%', '0%']
          }
        },


      ];
const option = {
  series: [
    {
      type: 'gauge',
      startAngle: 90,
      endAngle: -270,
      pointer: {
        show: false
      },
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: false,
        itemStyle: {
          borderWidth: 0,
          borderColor: '#bb0000',
          color: '#bb0000'
        }
      },
      axisLine: {
        lineStyle: {
          width: 10
        }
      },
      splitLine: {
        show: false,
        distance: 0,
        length: 10
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false,
        distance: 50
      },
      data: gaugeData,
      title: {
        fontSize: 24

      },
      detail: {
        width: 50,
        height: 14,
        fontSize: 64,
        color: '#bb0000',
       // borderColor: 'auto',
      //  borderRadius: 6,
        //borderWidth: 1,
        formatter: '{value}%'
      }
    }
  ]
};
setInterval(function () {
  gaugeData[0].value = +(Math.random() * 100).toFixed(0);
 // gaugeData[1].value = +(Math.random() * 100).toFixed(2);
  //gaugeData[2].value = +(Math.random() * 100).toFixed(2);
  myChart.setOption({
    series: [
      {
        data: gaugeData,
        pointer: {
          show: false
        }
      }
    ]
  });
}, 2000);
      myChart.setOption(option)
    }
  }

  customElements.define('com-sap-sample-echarts-ring_kpi', SampleRingKpi)
})()