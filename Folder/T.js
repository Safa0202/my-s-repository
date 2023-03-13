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
  class SamplePrepared extends HTMLElement {
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

    async render () {
      await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.0.0/echarts.min.js')

      const chart = echarts.init(this._root)
      myChart.showLoading();
$.get(ROOT_PATH + '/data/asset/data/flare.json', function (data) {
myChart.hideLoading();

data.children.forEach(function (datum, index) {
    index % 2 === 0 && (datum.collapsed = true);
});

myChart.setOption(option = {
    tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
    },
    series: [
        {
            type: 'tree',

            data: [data],

            top: '1%',
            left: '7%',
            bottom: '1%',
            right: '20%',

            symbolSize: 7,

            label: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right',
                fontSize: 9
            },

            leaves: {
                label: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'left'
                }
            },

            emphasis: {
                focus: 'descendant'
            },

            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
        }
    ]
});

setTimeout(function() {
    
         const op = myChart.getOption()
    const data = option.series[0].data[0].children[1]
    op.series[0].data = [data]
    myChart.setOption(op,true)
}
, 2000);
});
      chart.setOption(option)
    }
  }

  customElements.define('com-sap-sample-echarts-prepared', SamplePrepared)
})()